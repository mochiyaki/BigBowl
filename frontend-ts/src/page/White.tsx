
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
const API_URL = "/api/v1/chat/completions";
interface Message {
  role: "user" | "assistant";
  content: string | any[];
}
const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1] || "plaintext";
  const codeText = String(children).trim();
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeText);
  };
  if (!inline) {
    return (
      <div className="relative group">
        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          className="
            absolute top-2 right-2 opacity-0 group-hover:opacity-100 
            transition bg-gray-200 text-gray-800 text-xs px-2 py-1 
            rounded shadow hover:bg-gray-300
          "
        >
          Copy
        </button>
        <SyntaxHighlighter
          language={language}
          PreTag="div"
          {...props}
        >
          {codeText}
        </SyntaxHighlighter>
      </div>
    );
  }
  return <code className="bg-gray-200 px-1 py-0.5 rounded">{children}</code>;
};
// export default function App() {
const White = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setDragActive(true);
    };
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setDragActive(true);
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDragActive(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) processFile(file);
    };
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);
  const sendMessage = async () => {
    const text = input.trim();
    if (!text && !imageBase64) return;
    const newUserMessage: Message = { role: "user", content: [] };
    if (text)
      (newUserMessage.content as any[]).push({ type: "text", text });
    if (imageBase64)
      (newUserMessage.content as any[]).push({
        type: "image_url",
        image_url: { url: imageBase64 }
      });
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput("");
    setImagePreview(null);
    setImageBase64(null);
    setLoading(true);
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma-3-4b-it",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...updatedMessages
          ],
          max_tokens: -1,
          temperature: 0.7,
          stream: true
        })
      });
      if (!response.ok || !response.body) {
        const err = await response.text();
        throw new Error(`HTTP ${response.status}: ${err}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n")
          .filter(l => l.trim().startsWith("data: "));
        for (const line of lines) {
          const jsonStr = line.replace("data: ", "").trim();
          if (jsonStr === "[DONE]") break;
          try {
            const data = JSON.parse(jsonStr);
            const delta = data?.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                return [...prev.slice(0, -1), { ...last, content: assistantText }];
              });
            }
          } catch {}
        }
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `⚠️ ${err.message}` }
      ]);
    }
    setLoading(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };
  return (
    <div className="relative flex flex-col h-screen bg-gray-100">
      {/* Drag overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-black/40 z-50
          backdrop-blur-sm text-white text-2xl flex items-center justify-center
          pointer-events-none">
          Drop image to upload
        </div>
      )}
      {/* Chat messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl shadow
                whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-gray-500 text-white"
                    : "bg-white border border-gray-300 text-gray-900"
                }`}
            >
              {typeof m.content === "string" ? (
                m.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      code: CodeBlock,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  m.content
                )
              ) : (
                m.content.map((item: any, idx: number) => (
                  <div key={idx}>
                    {item.type === "text" && <p>{item.text}</p>}
                    {item.type === "image_url" && (
                      <img
                        src={item.image_url.url}
                        alt="upload"
                        className="rounded-lg mt-2 max-w-[200px]"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </main>
      {/* Input area */}
      <footer className="bg-white border-t p-4 flex flex-col gap-2">
        {imagePreview && (
          <div className="flex items-center gap-2">
            <img
              src={imagePreview}
              className="w-16 h-16 rounded-lg object-cover border"
            />
            <button
              className="text-red-500 text-sm"
              onClick={() => {
                setImageBase64(null);
                setImagePreview(null);
              }}
            >
              ✕ Remove
            </button>
          </div>
        )}
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            disabled={loading}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border rounded-lg px-4 py-2
            focus:ring-2 focus:ring-blue-400"
          />
          <button
            disabled={loading}
            onClick={sendMessage}
            className="bg-black text-white px-4 py-2 rounded-lg
            hover:bg-gray-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default White;