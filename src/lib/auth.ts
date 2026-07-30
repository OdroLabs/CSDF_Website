import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { toRole, type Role } from "./roles";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });
        if (!user) return null;
        // Suspended accounts are rejected even with the correct password.
        if (!user.active) return null;
        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;

        // Recorded so dormant accounts are visible on the Users screen.
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: toRole(user.role),
        } as { id: string; name: string; email: string; role: Role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      } else if (token.id) {
        /**
         * Re-read role and status from the database rather than trusting the
         * token, so demoting or suspending someone takes effect immediately
         * instead of waiting for their JWT to expire.
         */
        const fresh = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          select: { role: true, active: true },
        });
        if (!fresh || !fresh.active) return {};
        token.role = toRole(fresh.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = toRole(token.role);
      }
      return session;
    },
  },
};
