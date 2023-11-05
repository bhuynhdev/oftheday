import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { extensions } from "./schema";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.development" });

if (!("DB_URL" in process.env)) throw new Error("DB_URL not found on .env.development");

async function main() {
  const client = postgres(process.env.DB_URL!);
  const db = drizzle(client);

  const extenions_seeds = [
    "Interview question of the day",
    "Quote of the day",
    "Dog fact of the day",
    "Joke of the day",
  ];
  const data: (typeof extensions.$inferInsert)[] = extenions_seeds.map((text) => ({
    prompt: text,
  }));

  console.log("Seed start");
  await db.delete(extensions);
  await db.insert(extensions).values(data);

  console.log("Seed done");
  return;
}

main()
  .then(() => process.exit())
  .catch((err) => console.log(err));
