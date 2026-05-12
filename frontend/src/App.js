import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! Upload a PDF and ask me anything about it." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post(API + "/upload", form);
      setUploadedFile(file.name);
      setMessages(prev => [...prev, {
        role: "bot",
        text: "PDF uploaded! Indexed " + res.data.chunks + " chunks. Ask me anything!"
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "bot", text: "Upload failed. Make sure the backend is running."
      }]);
    }
    setUploading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(API + "/ask", { question });
      const sources = res.data.sources || [];
      const pages = [...new Set(sources.map(s => s.page).filter(Boolean))];
      setMessages(prev => [...prev, {
        role: "bot",
        text: res.data.answer,
        sources: pages.length ? "Sources: Page " + pages.join(", ") : ""
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "bot", text: "Error getting answer. Is the backend running?"
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700",
            color: "#1a1a1a", margin: "0 0 4px" }}>RAG Chatbot</h1>
          <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
            Upload a PDF and ask questions about it
          </p>
        </div>
        <div style={{ background: "white", borderRadius: "12px",
          padding: "14px 16px", marginBottom: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ display: "inline-flex", alignItems: "center",
            gap: "6px", padding: "8px 16px", background: "#0084ff",
            color: "white", borderRadius: "8px", cursor: "pointer",
            fontSize: "13px", fontWeight: "500" }}>
            {uploading ? "Uploading..." : "Upload PDF"}
            <input type="file" accept=".pdf" onChange={uploadFile}
              style={{ display: "none" }} disabled={uploading} />
          </label>
          {uploadedFile && (
            <span style={{ fontSize: "12px", color: "#666" }}>
              Active: {uploadedFile}
            </span>
          )}
        </div>
        <div style={{ background: "white", borderRadius: "12px",
          height: "420px", overflowY: "auto", padding: "16px",
          marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: "12px",
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "80%" }}>
                <div style={{
                  background: m.role === "user" ? "#0084ff" : "#f0f2f5",
                  color: m.role === "user" ? "white" : "#1a1a1a",
                  padding: "10px 14px", borderRadius: "18px",
                  fontSize: "14px", lineHeight: "1.5" }}>
                  {m.text}
                </div>
                {m.sources && (
                  <div style={{ fontSize: "11px", color: "#888",
                    marginTop: "4px", paddingLeft: "4px" }}>
                    {m.sources}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start",
              marginBottom: "12px" }}>
              <div style={{ background: "#f0f2f5", padding: "10px 14px",
                borderRadius: "18px", fontSize: "14px", color: "#666" }}>
                Thinking...
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question about your PDF..."
            disabled={loading}
            style={{ flex: 1, padding: "12px 16px", borderRadius: "24px",
              border: "1px solid #ddd", fontSize: "14px", outline: "none",
              background: "white" }} />
          <button onClick={sendMessage} disabled={loading}
            style={{ padding: "12px 24px", borderRadius: "24px",
              background: loading ? "#ccc" : "#0084ff",
              color: "white", border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px", fontWeight: "500" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
