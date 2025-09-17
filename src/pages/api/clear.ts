// src/pages/api/clear.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const db = await connectToDB();
    await db.collection("firebase_config").deleteMany({});
    res.status(200).json({ message: "Cache cleared ✅" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to clear cache" });
  }
}
