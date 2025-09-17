// src/lib/mongo.ts
import { MongoClient, Db } from "mongodb";

const uri = "mongodb+srv://abhikashyap2698_db_user:t0YIOzXwPUF5IVaS@abhi-pro.xmk207b.mongodb.net/";
const dbName = "fcm_test"; // you can change the DB name

let client: MongoClient;
let db: Db;

export async function connectToDB() {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}
