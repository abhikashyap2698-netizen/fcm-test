import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Upload Firebase Service Account JSON
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Firebase JSON uploaded ✅");
      } else {
        alert("Upload failed ❌: " + result.error);
      }
    } catch (err) {
      alert("Something went wrong while uploading ❌");
    }
  };

  // Send Push Notification
  const handleSend = async () => {
    if (!token || !title || !body) return alert("All fields required");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, title, body, data: { screen: "Home" } }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Notification sent ✅: " + JSON.stringify(result));
      } else {
        alert("Error ❌: " + result.error);
      }
    } catch (err) {
      alert("Something went wrong while sending ❌");
    }
  };

  // Clear Firebase Config from DB/Cache
  const handleClear = async () => {
    try {
      const res = await fetch("/api/clear", { method: "POST" });
      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Cache cleared ✅");
      } else {
        alert("Error ❌: " + result.error);
      }
    } catch (err) {
      alert("Something went wrong while clearing ❌");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🔥 Firebase Notification Dashboard
        </h1>

        {/* Step 1 - Upload */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Step 1: Upload Service Account JSON
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto"
            />
            <button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
            >
              Upload
            </button>
            <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
            >
              Clear Cache
            </button>
          </div>
        </div>

        {/* Step 2 - Send Notification */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Step 2: Send Notification
          </h3>
          <div className="space-y-3">
            <input
              placeholder="Device FCM Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <input
              placeholder="Notification Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <input
              placeholder="Notification Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow w-full"
            >
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
