import { createRouter } from "next-connect";
import multer from "multer";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

const upload = multer({ dest: "uploads/" });
const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(upload.single("file") as any);

router.post((req, res) => {
  try {
    const filePath = (req as any).file.path;
    const content = fs.readFileSync(filePath, "utf8");

    // Clear old config
    db.prepare("DELETE FROM firebase_config").run();

    // Save new config
    db.prepare("INSERT INTO firebase_config (content) VALUES (?)").run(content);

    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Firebase config saved in DB ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save file" });
  }
});

export default router.handler();
export const config = { api: { bodyParser: false } };
