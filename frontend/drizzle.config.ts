import { EnvParseConfig } from "@/util/env.schema";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/data/schema/",
  out: "./src/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: EnvParseConfig.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
