import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inspirations as inspirationsTable } from "./schema";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

if (!("DB_URL" in process.env)) throw new Error("DB_URL not found on .env.development");

async function main() {
  const client = postgres(process.env.DB_URL!);
  const db = drizzle(client);

  const inspirations_seeds = [
    "Interview question of the year",
    "Quote of the day",
    "Dog fact of the day",
    "Joke of the day",
  ];
  const data: (typeof inspirationsTable.$inferInsert)[] = inspirations_seeds.map((text) => ({
    prompt: text,
  }));

  console.log("Seed start");
  await db.delete(inspirationsTable);
  await db.insert(inspirationsTable).values(data).returning();

  console.log("Seed done");
  return;
}

main()
  .then(() => process.exit())
  .catch((err) => console.log(err));
