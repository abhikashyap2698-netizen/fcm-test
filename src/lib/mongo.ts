import { MongoClient, Db } from "mongodb";

const uri =
  "mongodb+srv://abhikashyap2698_db_user:t0YIOzXwPUF5IVaS@abhi-pro.xmk207b.mongodb.net/?retryWrites=true&w=majority";
const dbName = "fcm_test";

let client: MongoClient;
let db: Db;

export async function connectToDB(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log("✅ MongoDB connected!");
  return db;
}
