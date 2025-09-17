import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

let firebaseApp: any;

function initFirebase() {
  if (firebaseApp) return firebaseApp;

  const row:any = db.prepare("SELECT content FROM firebase_config LIMIT 1").get();
  if (!row) throw new Error("Firebase service account not uploaded yet!");

  const firebaseConfig = JSON.parse(row.content);

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });

  return firebaseApp;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    initFirebase();

    const { token, title, body, data } = req.body;

    const message = {
      token,
      notification: { title, body },
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, id: response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
