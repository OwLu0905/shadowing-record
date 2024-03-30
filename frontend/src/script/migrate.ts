import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { EnvParseConfig } from "@/util/env.schema";

const sql = postgres(EnvParseConfig.DATABASE_URL);
const db = drizzle(sql);

const main = async () => {
  try {
    console.log("Start migrating");
    await migrate(db, {
      migrationsFolder: "./src/drizzle",
      migrationsTable: "__drizzle_migrations",
    });
    console.log("Migrating finished");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to migrate the database");
  } finally {
    await sql.end();
  }
};

main();
