import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongo";
import admin from "firebase-admin";

function setCors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function initFirebase() {
  if (admin.apps.length) return admin.app();

  const db = await connectToDB();
  const row = await db.collection("firebase_config").findOne({});
  if (!row) throw new Error("No Firebase config uploaded");

  let config: any = row.content;
  if (typeof config === "string") config = JSON.parse(config);

  if (config.private_key) {
    config.private_key = config.private_key.replace(/\\n/g, "\n");
  }

  admin.initializeApp({
    credential: admin.credential.cert(config),
  });

  return admin.app();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

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
    console.error("Notify API Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
