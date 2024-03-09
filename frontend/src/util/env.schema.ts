import * as z from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const EnvParseConfig = envSchema.parse(process.env);
