import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongo";

// ✅ CORS helper
function setCors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const db = await connectToDB();
    await db.collection("firebase_config").deleteMany({});

    if (req.body?.json) {
      const parsed = JSON.parse(req.body.json); // validate
      await db.collection("firebase_config").insertOne({
        content: parsed,
        createdAt: new Date(),
      });
      return res.status(200).json({ message: "JSON stored ✅" });
    }

    return res.status(400).json({ error: "No JSON provided" });
  } catch (err: any) {
    console.error("Upload API Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
