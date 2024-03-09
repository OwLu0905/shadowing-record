import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { EnvParseConfig } from "@/util/env.schema";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientSecret: EnvParseConfig.GOOGLE_CLIENT_SECRET,
      clientId: EnvParseConfig.GOOGLE_CLIENT_ID,
    }),
  ],
});
