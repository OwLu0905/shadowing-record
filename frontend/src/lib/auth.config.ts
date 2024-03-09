import { EnvParseConfig } from "@/util/env.schema";
import type { NextAuthConfig } from "next-auth";

import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientSecret: EnvParseConfig.GOOGLE_CLIENT_SECRET,
      clientId: EnvParseConfig.GOOGLE_CLIENT_ID,
    }),
    // Credentials({
    //   async authorize(credentials) {
    //     const validedFields = LoginSchema.safeParse(credentials);
    //
    //     if (validedFields.success) {
    //       const { email, password } = validedFields.data;
    //
    //       const user = await getUserByEmail(email);
    //
    //       // NOTE: third party login miss the password field
    //       if (!user || !user?.password) return null;
    //       const passwordMatch = await bcrypt.compare(password, user?.password);
    //
    //       if (passwordMatch) return user;
    //     }
    //     return null;
    //   },
    // }),
  ],
} satisfies NextAuthConfig;
