import "next-auth/jwt";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import authConfig from "@/lib/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      // NOTE: Allow OAuth without verification
      if (account?.provider !== "credentials") return true;

      // const existingUser = await getUserById(user.id!);

      // // Prevent sign in without verification
      // if (!existingUser?.emailVerified) return false;

      // // TODO: Add 2FA check

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser[0].role;

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

type UserRole = "ADMIN" | "USER";

declare module "next-auth" {
  interface User {
    role: UserRole;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}
