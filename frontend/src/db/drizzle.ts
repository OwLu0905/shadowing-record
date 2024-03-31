import { EnvParseConfig } from "@/util/env.schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/schema";

const connectionString = EnvParseConfig.DATABASE_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, {
  connect_timeout: 30,
  prepare: false,
});
export const db = drizzle(client, { schema });
