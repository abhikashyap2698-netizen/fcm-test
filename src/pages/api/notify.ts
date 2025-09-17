// import fs from "fs";
// import path from "path";
// import admin from "firebase-admin";

// let firebaseApp:any;

// function initFirebase() {
//   if (firebaseApp) return firebaseApp;

//   const filePath = path.join(process.cwd(), "uploads", "firebase.json");
//   if (!fs.existsSync(filePath)) {
//     throw new Error("Firebase service account not uploaded yet!");
//   }

//   const serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));

//   firebaseApp = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });

//   return firebaseApp;
// }

// export default async function handler(req:any, res:any) {
//   if (req.method !== "POST") return res.status(405).end();

//   try {
//     initFirebase();

//     const { token, title, body, data } = req.body;

//     const message = {
//       token,
//       notification: { title, body },
//       data: data || {},
//     };

//     const response = await admin.messaging().send(message);

//     return res.status(200).json({ success: true, id: response });
//   } catch (error:any) {
//     return res.status(500).json({ error: error.message });
//   }
// }


import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import { firebaseConfig } from "./upload";
import type { NextApiRequest, NextApiResponse } from "next";

let firebaseApp:any;

function initFirebase() {
  if (firebaseApp) return firebaseApp;

  if (!firebaseConfig) {
    throw new Error("Firebase service account not uploaded yet!");
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig as ServiceAccount),
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
