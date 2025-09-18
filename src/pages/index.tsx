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
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(to right, #1e3c72, #2a5298);
          color: #000;
        }
        @media (prefers-color-scheme: dark) {
          body {
            background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
            color: #fff;
          }
          .card {
            background: #1e293b;
            color: #fff;
            border: 1px solid #334155;
          }
          input,
          textarea {
            background: #0f172a;
            color: #fff;
            border: 1px solid #334155;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="card"
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "12px",
            width: "500px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#1e3c72",
            }}
          >
            🚀 FCM Notification Tester
          </h1>

          <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
            🔑 Service Account JSON
          </label>
          <textarea
            placeholder="Paste service account JSON here"
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={6}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "15px",
              fontFamily: "monospace",
            }}
          />

          <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
            📱 Device Token
          </label>
          <input
            placeholder="Enter device FCM token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "15px",
            }}
          />

          <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
            📝 Title
          </label>
          <input
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "15px",
            }}
          />

          <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
            💬 Body
          </label>
          <input
            placeholder="Notification Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "20px",
            }}
          />

          <button
            onClick={sendNotification}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background: "linear-gradient(to right, #1e3c72, #2a5298)",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.background =
                "linear-gradient(to right, #2a5298, #1e3c72)")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.background =
                "linear-gradient(to right, #1e3c72, #2a5298)")
            }
          >
            🚀 Send Notification
          </button>
        </div>
      </div>
    </>
  );
}
