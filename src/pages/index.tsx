// import { useState } from "react";

// export default function Home() {
//   const [file, setFile] = useState<any>(null);
//   const [token, setToken] = useState("");
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", file);

//     await fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//     });
//     alert("Firebase JSON uploaded ✅");
//   };

//   const handleSend = async () => {
//     const res = await fetch("/api/notify", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token, title, body, data: { screen: "Home" } }),
//     });
//     const result = await res.json();
//     alert("Notification sent: " + JSON.stringify(result));
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "Arial" }}>
//       <h1>🔥 Firebase Notification Dashboard</h1>

//       <div style={{ marginBottom: 20 }}>
//         <h3>Step 1: Upload Service Account JSON</h3>
//         <input type="file" onChange={(e:any) => setFile(e.target.files[0])} />
//         <button onClick={handleUpload} style={{ marginLeft: 10 }}>Upload</button>
//       </div>

//       <div>
//         <h3>Step 2: Send Notification</h3>
//         <input
//           placeholder="Device FCM Token"
//           value={token}
//           onChange={(e) => setToken(e.target.value)}
//           style={{ width: "100%", marginBottom: 10 }}
//         />
//         <input
//           placeholder="Notification Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           style={{ width: "100%", marginBottom: 10 }}
//         />
//         <input
//           placeholder="Notification Body"
//           value={body}
//           onChange={(e) => setBody(e.target.value)}
//           style={{ width: "100%", marginBottom: 10 }}
//         />
//         <button onClick={handleSend}>Send Notification</button>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    alert("Firebase JSON uploaded ✅");
  };

  const handleSend = async () => {
    if (!token || !title || !body) return alert("All fields required");
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, title, body, data: { screen: "Home" } }),
    });
    const result = await res.json();
    alert("Notification sent: " + JSON.stringify(result));
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
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto"
            />
            <button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
            >
              Upload
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
