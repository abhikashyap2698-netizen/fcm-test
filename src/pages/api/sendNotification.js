import admin from "firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { serviceAccount, token, title, body } = req.body;

    if (!serviceAccount || !token || !title || !body) {
      return res
        .status(400)
        .json({ error: "Missing serviceAccount, token, title or body" });
    }

    // Fix private_key newlines
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    // Create a unique Firebase app instance for this request
    const app = admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
      },
      `app-${Date.now()}`
    );

    // Use messaging service from this app
    const messaging = admin.messaging(app);

    const message = {
      notification: { title, body },
      token,
    };

    const response = await messaging.send(message);

    // Clean up app instance
    await app.delete();

    return res.status(200).json({ success: true, response });
  } catch (err) {
    console.error("🔥 Firebase Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
