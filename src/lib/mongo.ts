// lib/mongo.ts
import { MongoClient, Db } from "mongodb";

const uri =
  "mongodb+srv://abhikashyap2698_db_user:t0YIOzXwPUF5IVaS@abhi-pro.xmk207b.mongodb.net/?retryWrites=true&w=majority";
const dbName = "fcm_test";

let cached: { client: MongoClient; db: Db } | null = null;

export async function connectToDB(): Promise<Db> {
  if (cached) return cached.db;

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  cached = { client, db };

  console.log("✅ MongoDB connected!");
  return db;
}
