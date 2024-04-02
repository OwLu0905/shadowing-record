import { EnvParseConfig } from "@/util/env.schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/schema";

const connectionString = EnvParseConfig.DATABASE_URL;

let client: postgres.Sql;

if (process.env.NODE_ENV === "production") {
  client = postgres(connectionString, { prepare: false });
} else {
  const globalConnection = global as typeof globalThis & {
    connection: postgres.Sql;
  };

  if (!globalConnection.connection) {
    globalConnection.connection = postgres(process.env.DATABASE_URL, {
      prepare: false,
    });
  }

  client = globalConnection.connection;
}

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
