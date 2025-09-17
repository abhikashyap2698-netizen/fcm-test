// src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongo";
import multer from "multer";
import { createRouter } from "next-connect";

const upload = multer({ storage: multer.memoryStorage() }); // store in memory
const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(upload.single("file") as any);

router.post(async (req: NextApiRequest & { file?: any }, res: NextApiResponse) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const db = await connectToDB();

    // Clear previous config
    await db.collection("firebase_config").deleteMany({});

    // Insert new config
    await db.collection("firebase_config").insertOne({
      content: req.file.buffer.toString("utf8"),
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Firebase config uploaded ✅" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to upload" });
  }
});

export const config = {
  api: { bodyParser: false },
};

export default router.handler();
