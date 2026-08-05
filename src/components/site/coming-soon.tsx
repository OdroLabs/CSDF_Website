import { Facebook, Youtube, Instagram, Twitter, Linkedin, Music2, Mail, Sparkle } from "lucide-react";
import { buildSocials } from "@/lib/nav";
import { s, type SettingsMap } from "@/lib/settings";

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: Music2,
};

/** Fixed positions/delays for the background starfield — stable across renders. */
const STARS = [
  { top: "12%", left: "18%", size: 3, delay: "0s" },
  { top: "22%", left: "78%", size: 2, delay: "0.6s" },
  { top: "68%", left: "12%", size: 2, delay: "1.2s" },
  { top: "78%", left: "82%", size: 3, delay: "0.3s" },
  { top: "15%", left: "50%", size: 2, delay: "1.8s" },
  { top: "85%", left: "48%", size: 2, delay: "0.9s" },
  { top: "45%", left: "8%", size: 2, delay: "1.5s" },
  { top: "40%", left: "92%", size: 3, delay: "2.1s" },
];

export function ComingSoonPage({
  locale,
  settings,
}: {
  locale: string;
  settings: SettingsMap;
}) {
  const siteName = s(settings, "site_name", locale);
  const shortName = s(settings, "site_short_name");
  const logoImage = s(settings, "logo_image");
  const logoLetter = s(settings, "logo_letter");
  const background = s(settings, "coming_soon_background");
  const title = s(settings, "coming_soon_title", locale) || siteName || "We'll Be Back Soon";
  const message =
    s(settings, "coming_soon_message", locale) ||
    "We're putting the finishing touches on something new. Check back soon.";
  const email = s(settings, "email");
  const socials = buildSocials(settings);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#1e1130_0%,_#0a0612_75%)] px-6 py-16 text-center text-white">
      {/* Twinkling starfield */}
      {STARS.map((star, i) => (
        <span
          key={i}
          className="cs-sparkle absolute rounded-full bg-white/70"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}

      {background && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-multiply"
          style={{ backgroundImage: `url(${background})` }}
        />
      )}

      {(logoImage || logoLetter) && (
        <div className="absolute top-8 z-10">
          {logoImage ? (
            <img src={logoImage} alt={siteName} className="h-10 w-auto opacity-90" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-bold">
              {logoLetter}
            </span>
          )}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        {/* Glowing corona — slow rotating red/cyan blur */}
        <div className="relative mb-8 h-64 w-64 sm:h-80 sm:w-80">
          <div className="cs-ring-glow" />
          <Sparkle
            className="cs-sparkle absolute right-2 top-10 h-8 w-8 fill-white text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] sm:right-4 sm:top-12"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
          Coming Soon
        </p>

        <h1 className="font-heading text-3xl font-black uppercase tracking-[0.1em] sm:text-5xl">
          {title}
        </h1>

        {message && <p className="mt-6 max-w-md text-balance text-white/60">{message}</p>}

        {(socials.length > 0 || email) && (
          <div className="mt-10 flex items-center gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
            {socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.key];
              if (!Icon) return null;
              return (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}

        <p className="mt-12 text-xs text-white/30">
          &copy; {new Date().getFullYear()} {shortName || siteName}
        </p>
      </div>
    </div>
  );
}
