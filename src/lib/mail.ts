/**
 * Minimal, dependency-free SMTP client.
 *
 * Written by hand (using only Node's built-in `net`/`tls`) instead of pulling
 * in nodemailer because this workspace's mounted drive can't do npm's atomic
 * rename during install (the same constraint that forced a hand-rolled
 * SigV4 signer for DigitalOcean Spaces in src/lib/storage.ts) — any `npm
 * install` here fails with ENOTEMPTY partway through node_modules.
 *
 * Supports both implicit TLS (port 465) and STARTTLS (port 587/25), AUTH
 * LOGIN, multiple To/Cc recipients, and an optional Reply-To. That covers
 * every mainstream SMTP provider (Gmail, Outlook/Office365, cPanel mail).
 */
import { connect as netConnect, type Socket } from "net";
import { connect as tlsConnect, type TLSSocket } from "tls";
import { s, sBool, type SettingsMap } from "./settings";

export interface SendMailOptions {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

function asList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : value.split(",");
  return raw.map((v) => v.trim()).filter(Boolean);
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

/**
 * Admin → Site Settings → General → Email (SMTP) takes priority so the
 * config can be changed without redeploying. `.env` values are kept as a
 * fallback for setups that would rather not put credentials in the database.
 */
function getConfig(settings?: SettingsMap): SmtpConfig | null {
  if (settings) {
    if (!sBool(settings, "smtp_enabled", false)) return null;
    const host = s(settings, "smtp_host") || process.env.SMTP_HOST;
    const user = s(settings, "smtp_user") || process.env.SMTP_USER;
    const pass = s(settings, "smtp_pass") || process.env.SMTP_PASS;
    if (!host || !user || !pass) return null;
    const portRaw = s(settings, "smtp_port");
    const port = Number(portRaw) || Number(process.env.SMTP_PORT) || 587;
    return {
      host,
      port,
      secure: sBool(settings, "smtp_secure", false) || port === 465,
      user,
      pass,
      from: s(settings, "smtp_from") || process.env.SMTP_FROM || user,
    };
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
    user,
    pass,
    from: process.env.SMTP_FROM || user,
  };
}

/** Reads SMTP response line(s) until a line whose 4th char is a space (end of a multi-line reply). */
function readResponse(socket: Socket | TLSSocket): Promise<{ code: number; message: string }> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split("\r\n").filter(Boolean);
      const last = lines[lines.length - 1];
      if (last && /^\d{3} /.test(last)) {
        cleanup();
        resolve({ code: Number(last.slice(0, 3)), message: lines.join("\n") });
      }
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    const onEnd = () => {
      cleanup();
      reject(new Error("SMTP connection closed unexpectedly"));
    };
    function cleanup() {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("end", onEnd);
    }
    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("end", onEnd);
  });
}

function writeCommand(socket: Socket | TLSSocket, command: string): Promise<{ code: number; message: string }> {
  const pending = readResponse(socket);
  socket.write(command + "\r\n");
  return pending;
}

function expect(res: { code: number; message: string }, min = 200, max = 399) {
  if (res.code < min || res.code > max) {
    throw new Error(`SMTP error: ${res.message}`);
  }
}

function encodeHeader(value: string): string {
  // Encode non-ASCII header values (e.g. a name in Sinhala/Tamil) per RFC 2047.
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

/**
 * Send a single email via SMTP. Resolves silently if SMTP isn't configured
 * or is turned off (Admin → Site Settings → General → Email (SMTP), or the
 * equivalent .env vars as a fallback) so the caller can treat email as
 * best-effort — the site keeps working, it just skips the notification.
 */
export async function sendMail(options: SendMailOptions, settings?: SettingsMap): Promise<void> {
  const config = getConfig(settings);
  if (!config) {
    console.warn("[mail] SMTP not configured — skipping email send.");
    return;
  }

  let socket: Socket | TLSSocket = config.secure
    ? tlsConnect({ host: config.host, port: config.port, servername: config.host })
    : netConnect({ host: config.host, port: config.port });

  await new Promise<void>((resolve, reject) => {
    socket.once(config.secure ? "secureConnect" : "connect", () => resolve());
    socket.once("error", reject);
  });

  try {
    expect(await readResponse(socket), 200, 220); // greeting

    const host = config.host;
    expect(await writeCommand(socket, `EHLO ${host}`));

    if (!config.secure) {
      expect(await writeCommand(socket, "STARTTLS"));
      const plainSocket = socket as Socket;
      socket = tlsConnect({ socket: plainSocket, servername: host });
      await new Promise<void>((resolve, reject) => {
        socket.once("secureConnect", () => resolve());
        socket.once("error", reject);
      });
      expect(await writeCommand(socket, `EHLO ${host}`));
    }

    expect(await writeCommand(socket, "AUTH LOGIN"), 300, 399);
    expect(await writeCommand(socket, Buffer.from(config.user).toString("base64")), 300, 399);
    expect(await writeCommand(socket, Buffer.from(config.pass).toString("base64")), 200, 299);

    const toList = asList(options.to);
    const ccList = asList(options.cc);
    if (toList.length === 0) throw new Error("sendMail: at least one To address is required");

    expect(await writeCommand(socket, `MAIL FROM:<${config.user}>`));
    for (const recipient of [...toList, ...ccList]) {
      expect(await writeCommand(socket, `RCPT TO:<${recipient}>`));
    }
    expect(await writeCommand(socket, "DATA"), 300, 399);

    const boundary = `----csdf-${Date.now().toString(36)}`;
    const headers = [
      `From: ${encodeHeader(config.from)} <${config.user}>`,
      `To: ${toList.map((a) => `<${a}>`).join(", ")}`,
      ccList.length > 0 ? `Cc: ${ccList.map((a) => `<${a}>`).join(", ")}` : null,
      options.replyTo ? `Reply-To: ${encodeHeader(options.replyTo)}` : null,
      `Subject: ${encodeHeader(options.subject)}`,
      "MIME-Version: 1.0",
    ].filter(Boolean);

    let body: string;
    if (options.html) {
      headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
      body =
        `--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${options.text}\r\n` +
        `--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${options.html}\r\n` +
        `--${boundary}--`;
    } else {
      headers.push("Content-Type: text/plain; charset=UTF-8");
      body = options.text;
    }

    // Dot-stuff any line that starts with "." so it isn't read as the end-of-data marker.
    const message = [...headers, "", body].join("\r\n").replace(/\r\n\./g, "\r\n..");

    expect(await writeCommand(socket, `${message}\r\n.`));
    await writeCommand(socket, "QUIT").catch(() => {});
  } finally {
    socket.end();
  }
}
