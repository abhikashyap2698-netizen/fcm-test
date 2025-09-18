import { useState } from "react";

export default function Home() {
  const [json, setJson] = useState(""); // service account JSON as string
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const sendNotification = async () => {
    try {
      const res = await fetch("/api/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceAccount: JSON.parse(json),
          token,
          title,
          body,
        }),
      });

      const data = await res.json();
      console.log("Notification Response:", data);
      if (data.success) {
        alert("✅ Notification Sent!");
      } else {
        alert("❌ Error: " + JSON.stringify(data));
      }
    } catch (err:any) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Send FCM Notification</h1>

      <textarea
        placeholder="Paste service account JSON here"
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={8}
        cols={60}
      />
      <br />

      <input
        placeholder="Device Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "400px", marginTop: "10px" }}
      />
      <br />

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "400px", marginTop: "10px" }}
      />
      <br />

      <input
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ width: "400px", marginTop: "10px" }}
      />
      <br />

      <button
        onClick={sendNotification}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send Notification
      </button>
    </div>
  );
}
