import { useState } from "react";

export default function Home() {
  const [jsonText, setJsonText] = useState("");
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleUpload = async () => {
    if (!jsonText) return alert("Paste JSON first");

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: jsonText }),
    });
    const result = await res.json();
    alert(result.message || result.error);
  };

  const handleSend = async () => {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, title, body, data: { screen: "Home" } }),
    });
    const result = await res.json();
    alert(res.ok ? "✅ " + JSON.stringify(result) : result.error);
  };

  const handleClear = async () => {
    const res = await fetch("/api/clear", { method: "POST" });
    const result = await res.json();
    alert(result.message || result.error);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">🔥 Firebase Notification Tester</h1>

      <div>
        <h3 className="font-semibold">Step 1: Paste JSON</h3>
        <textarea
          placeholder="Paste serviceAccountKey.json here..."
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="border w-full p-2 mt-2"
          rows={6}
        />
        <div className="flex gap-3 mt-2">
          <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
          <button onClick={handleClear} className="bg-red-600 text-white px-4 py-2 rounded">Clear</button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Step 2: Send Notification</h3>
        <input
          placeholder="Device Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border w-full p-2"
        />
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full p-2 mt-2"
        />
        <input
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border w-full p-2 mt-2"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded w-full mt-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}
