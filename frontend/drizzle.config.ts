import "dotenv/config";
import { EnvParseConfig } from "@/util/env.schema";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/schema.ts",
  out: "./src/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: EnvParseConfig.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
