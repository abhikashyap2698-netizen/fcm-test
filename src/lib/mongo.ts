// lib/mongo.ts
import { MongoClient, Db } from "mongodb";

const uri =
  "mongodb+srv://abhikashyap2698_db_user:t0YIOzXwPUF5IVaS@abhi-pro.xmk207b.mongodb.net/fcm_test?retryWrites=true&w=majority&maxPoolSize=1";

const dbName = "fcm_test";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDB(): Promise<Db> {
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(dbName);
  console.log("✅ MongoDB connected (cached)");
  return cachedDb;
}
