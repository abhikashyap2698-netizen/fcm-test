// src/pages/api/notify.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongo";
import admin from "firebase-admin";

async function initFirebase() {
  // Reuse firebase app if already initialized
  if (admin.apps.length) return admin.app();

  const db = await connectToDB();
  const row = await db.collection("firebase_config").findOne({});
  if (!row) throw new Error("No Firebase config uploaded");

  let config = row.content;

  // Ensure config is parsed
  if (typeof config === "string") {
    config = JSON.parse(config);
  }

  // Fix private key line breaks if stored as escaped string
  if (config.private_key) {
    config.private_key = config.private_key.replace(/\\n/g, "\n");
  }

  admin.initializeApp({
    credential: admin.credential.cert(config),
  });

  return admin.app();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await initFirebase();

    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ error: "Missing fields: token, title, or body" });
    }

    const message: admin.messaging.Message = {
      token,
      notification: { title, body },
      data: data || {},
    };

    const response = await admin.messaging().send(message);

    return res.status(200).json({ success: true, id: response });
  } catch (err: any) {
    console.error("Notify API Error:", err); // 👈 check terminal logs
    return res.status(500).json({ error: err.message });
  }
}
