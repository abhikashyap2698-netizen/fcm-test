// src/pages/api/notify.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongo";
import admin from "firebase-admin";

let firebaseApp: admin.app.App | null = null;

async function initFirebase() {
  if (firebaseApp) return firebaseApp;

  const db = await connectToDB();
  const row = await db.collection("firebase_config").findOne({});
  if (!row) throw new Error("Firebase config not uploaded yet!");

  const firebaseConfig = JSON.parse(row.content);
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });

  return firebaseApp;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await initFirebase();

    const { token, title, body, data } = req.body;

    const message = {
      token,
      notification: { title, body },
      data: data || {},
    };

    const response = await admin.messaging().send(message);

    res.status(200).json({ success: true, id: response });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to send notification" });
  }
}
