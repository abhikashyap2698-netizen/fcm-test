import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const db = await connectToDB();
    await db.collection("firebase_config").deleteMany({});

    if (req.body?.json) {
      // Case: pasted JSON
      JSON.parse(req.body.json); // validate JSON
      await db.collection("firebase_config").insertOne({
        content: req.body.json,
        createdAt: new Date(),
      });
      return res.status(200).json({ message: "JSON stored ✅" });
    }

    return res.status(400).json({ error: "No JSON provided" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
