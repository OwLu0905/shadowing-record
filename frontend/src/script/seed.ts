import "dotenv/config";
import { EnvParseConfig } from "@/util/env.schema";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema/schema";

const client = postgres(EnvParseConfig.DATABASE_URL);

const db = drizzle(client, { schema });

const main = async () => {
  try {
    console.log("Seeding database");
    await db.delete(schema.records);
    await db.delete(schema.audios);
    await db.delete(schema.kinds);

    await db.insert(schema.kinds).values([{ kindId: 0, name: "YouTube" }]);

    console.log("Seeding finished");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to seed the database");
  } finally {
    await client.end(); // Close the database connection
  }
};

main();
