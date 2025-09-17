import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";

let firebaseApp: admin.app.App | null = null;

function setCors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function initFirebase(serviceAccount: any) {
  if (firebaseApp) return firebaseApp;

  // Fix private key line breaks
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return firebaseApp;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { serviceAccount, token, title, body, data } = req.body;

    if (!serviceAccount || !token || !title || !body) {
      return res.status(400).json({ error: "Missing fields: serviceAccount, token, title, or body" });
    }

    await initFirebase(serviceAccount);

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
