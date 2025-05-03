import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { testSchema } from "./db/schema";
import { isNull } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

const getNewSubmissions = async () =>
  await db.select().from(testSchema).where(isNull(testSchema.token));

async function main() {
  console.log("Start");
  setInterval(() => {
    getNewSubmissions().then((response) => console.log(response));
  }, 1000);
}

main();
