// import { createRouter } from "next-connect";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import type { NextApiRequest, NextApiResponse } from "next";

// const upload:any = multer({ dest: "uploads/" });

// const router = createRouter<NextApiRequest, NextApiResponse>();

// router.use(upload.single("file"));

// router.post((req, res) => {
//   const tempPath = (req as any).file.path;
//   const targetPath = path.join(process.cwd(), "uploads", "firebase.json");

//   fs.rename(tempPath, targetPath, (err) => {
//     if (err) return res.status(500).json({ error: "Upload failed" });
//     res.status(200).json({ message: "Firebase service account uploaded successfully!" });
//   });
// });

// export default router.handler({
//   onError(error, req, res) {
//     res.status(501).json({ error: `Something went wrong: ${error instanceof Error ? error.message : String(error)}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' not allowed` });
//   },
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };


import { createRouter } from "next-connect";
import multer from "multer";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ServiceAccount } from "firebase-admin";

let firebaseConfig: ServiceAccount | null = null; // store in memory

const upload = multer({ dest: "uploads/" });

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(upload.single("file") as any);

router.post((req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filePath = (req as any).file.path;

    // Read JSON content
    const content = fs.readFileSync(filePath, "utf8");
    firebaseConfig = JSON.parse(content) as ServiceAccount;

    // Delete file immediately
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Firebase config loaded into memory ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to process file" });
  }
});

export default router.handler({
  onError(error:any, req:any, res:any) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req:any, res:any) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  },
});

export { firebaseConfig }; // export memory reference

export const config = {
  api: {
    bodyParser: false,
  },
};
