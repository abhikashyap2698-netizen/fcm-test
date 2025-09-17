import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    db.prepare("DELETE FROM firebase_config").run();
    res.status(200).json({ message: "Cache cleared ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cache" });
  }
}
