import "server-only";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { credentialsSchema } from "@/lib/credentials";

function configuration() {
  const secret = process.env.NEXTAUTH_SECRET;
  const email = process.env.DEMO_EMAIL;
  const hash = process.env.DEMO_PASSWORD_HASH;
  if (!secret || secret.length < 32 || secret.includes("replace") || !email || !hash || !/^\$2[aby]\$12\$[./A-Za-z0-9]{53}$/.test(hash)) {
    throw new Error("Configure .env.local using npm run setup:demo. A random secret and bcrypt cost-12 demo hash are required.");
  }
  return { secret, email: email.trim().toLowerCase(), hash };
}

export function authOptions(): NextAuthOptions {
  const env = configuration();
  return {
    secret: env.secret,
    session: { strategy: "jwt", maxAge: 60 * 60 },
    pages: { signIn: "/login", error: "/login" },
    providers: [CredentialsProvider({
      name: "Demo account",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        const result = credentialsSchema.safeParse(credentials);
        if (!result.success || Buffer.byteLength(result.data.password, "utf8") > 72) return null;
        // Always verify the hash for valid input, including an unknown email.
        const valid = await compare(result.data.password, env.hash);
        if (!valid || result.data.email !== env.email) return null;
        return { id: "demo-user", name: "Alex Morgan", email: env.email };
      },
    })],
    callbacks: {
      async redirect({ url, baseUrl }) {
        return url === "/login" || url === `${baseUrl}/login` ? `${baseUrl}/login` : `${baseUrl}/dashboard`;
      },
    },
  };
}

export function getSession() { return getServerSession(authOptions()); }
