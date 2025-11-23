
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Single-file Chat UI with streaming LLM (http://127.0.0.1:1234),
// image agent (http://127.0.0.1:8000) and video agent (http://127.0.0.1:8005).

type MsgBlock =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "video"; src: string };

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  hat?: string | null;
  content: MsgBlock[];
}

interface Agent {
  name: string;
  prompt: string;
  style?: string;
}

const DEFAULT_CHAT_HEADING = "multiple agents (+ image + video)";
const IMAGE_API_BASE = "http://127.0.0.1:8000"; // POST /generate
const VIDEO_API_BASE = "http://127.0.0.1:8005"; // POST /generate_video
const LLM_API_BASE = "http://127.0.0.1:1234/v1/chat/completions"; // streaming endpoint
// const LLM_API = "http://127.0.0.1:1234/v1/chat/completions"; // streaming endpoint
// const LLM_API = "api/v1/chat/completions"; // streaming endpoint

const HAT_STYLE: Record<string, string> = {
  white: "bg-white border border-gray-300 text-gray-900",
  black: "bg-black text-white",
  blue: "bg-blue-50 text-blue-900",
  red: "bg-red-50 text-red-900",
  yellow: "bg-yellow-50 text-yellow-900",
  green: "bg-green-50 text-green-900",
};

const HAT_SYSTEM_PROMPTS: Record<string, string> = {
  white: "You are the WHITE hat. Respond only with objective facts and verified data.",
  black: "You are the BLACK hat. Respond only with risks, concerns, and critical evaluation.",
  blue: "You are the BLUE hat. Respond only with structure, planning, and oversight.",
  red: "You are the RED hat. Respond only with emotional or intuitive reactions.",
  yellow: "You are the YELLOW hat. Respond only with positive outcomes and benefits.",
  green: "You are the GREEN hat. Respond only with creativity, ideas, alternatives.",
};

const mkId = (pref = "") => `${pref}${Date.now()}${Math.floor(Math.random() * 9999)}`;

const extractHatTag = (text: string): string | null => {
  const m = text.match(/^@(\w+)/i);
  if (!m) return null;
  return m[1].toLowerCase();
};
const stripHatTag = (text: string) => text.replace(/^@\w+\s*/, "");

export default function App(): React.JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [imageApiBase, setImageApiBase] = useState(IMAGE_API_BASE);
  const [videoApiBase, setVideoApiBase] = useState(VIDEO_API_BASE);
  const [llmApiBase, setLlmApiBase] = useState(LLM_API_BASE);
  const [imgNumSteps, setImgNumSteps] = useState(8);
  const [imgGuidance, setImgGuidance] = useState(2.5);
  const [vidNumFrames, setVidNumFrames] = useState(25);
  const [vidNumSteps, setVidNumSteps] = useState(15);
  const [vidFps, setVidFps] = useState(24);
  const [agents, setAgents] = useState<Agent[]>([
    { name: "white", prompt: HAT_SYSTEM_PROMPTS.white, style: HAT_STYLE.white },
    { name: "black", prompt: HAT_SYSTEM_PROMPTS.black, style: HAT_STYLE.black },
    { name: "blue", prompt: HAT_SYSTEM_PROMPTS.blue, style: HAT_STYLE.blue },
    { name: "red", prompt: HAT_SYSTEM_PROMPTS.red, style: HAT_STYLE.red },
    { name: "yellow", prompt: HAT_SYSTEM_PROMPTS.yellow, style: HAT_STYLE.yellow },
    { name: "green", prompt: HAT_SYSTEM_PROMPTS.green, style: HAT_STYLE.green },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

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
      if (file) handleFile(file);
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

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    setUploadFile(file);
    const url = URL.createObjectURL(file);
    setUploadPreview(url);
  };

  const removeUpload = () => {
    setUploadFile(null);
    setUploadPreview(null);
  };
  const updateAgentPrompt = (name: string, prompt: string) => {
    setAgents((p) => p.map((a) => (a.name === name ? { ...a, prompt } : a)));
  };
  const updateAgentName = (idx: number, name: string) => {
    const sanitized = name.replace(/\s+/g, "_");
    setAgents((p) => p.map((a, i) => (i === idx ? { ...a, name: sanitized } : a)));
  };
  const addAgent = () => {
    const base = "agent";
    let n = 1;
    const existing = new Set(agents.map((a) => a.name));
    while (existing.has(`${base}_${n}`)) n++;
    setAgents((p) => [...p, { name: `${base}_${n}`, prompt: "You are a helpful agent.", style: "bg-purple-50 text-purple-900" }]);
  };
  const removeAgent = (name: string) => {
    setAgents((p) => p.filter((a) => a.name !== name));
  };

  // ---------- Image Agent (unchanged behavior) ----------
  const handleImageAgent = async (promptText: string, file?: File | null) => {
    const genId = mkId("img_gen_");
    setMessages((p) => [
      ...p,
      { id: genId, role: "assistant", hat: "white", content: [{ type: "text", text: "🎨 Generating image..." }] },
    ]);
    scrollToBottom();
    try {
      const fd = new FormData();
      fd.append("prompt", promptText || "");
      fd.append("num_steps", String(imgNumSteps));
      fd.append("guidance", String(imgGuidance));
      if (file) fd.append("file", file);
      const res = await fetch(`${imageApiBase}/generate`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Image API error: ${res.status}`);
      const data = await res.json();
      if (!data || !data.image) throw new Error("Image API returned empty response.");
      const src = `data:image/png;base64,${data.image}`;
      setMessages((p) => {
        const without = p.filter((m) => m.id !== genId);
        const newMsg: ChatMessage = {
          id: mkId("img_"),
          role: "assistant",
          hat: "white",
          content: [{ type: "text", text: "Here is your generated image:" }, { type: "image_url", image_url: { url: src } }],
        };
        return [...without, newMsg];
      });
      scrollToBottom();
    } catch (err: unknown) {
      setMessages((p) => {
        const without = p.filter((m) => !m.id.startsWith("img_gen_"));
        return [
          ...without,
          { id: mkId("img_err_"), role: "assistant", hat: "white", content: [{ type: "text", text: `❌ Image generation failed: ${err instanceof Error ? err.message : String(err)}` }] },
        ];
      });
    }
  };

  // ---------- Video Agent (unchanged behavior) ----------
  const handleVideoAgent = async (promptText: string, file?: File | null) => {
    const genId = mkId("vid_gen_");
    setMessages((p) => [
      ...p,
      { id: genId, role: "assistant", hat: "blue", content: [{ type: "text", text: "🎬 Generating video..." }] },
    ]);
    scrollToBottom();
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      fd.append("prompt", promptText || "");
      fd.append("num_frames", String(vidNumFrames));
      fd.append("num_inference_steps", String(vidNumSteps));
      fd.append("fps", String(vidFps));
      const res = await fetch(`${videoApiBase}/generate_video`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Video API error: ${res.status}`);
      const data = await res.json();
      if (data.status === "success" && data.video_base64) {
        const videoSrc = `data:${data.mime};base64,${data.video_base64}`;
        setMessages((p) => {
          const without = p.filter((m) => m.id !== genId);
          const newMsg: ChatMessage = { id: mkId("vid_"), role: "assistant", hat: "blue", content: [{ type: "video", src: videoSrc }] };
          return [...without, newMsg];
        });
      } else {
        const msg = data.message || "Failed to generate video.";
        setMessages((p) => {
          const without = p.filter((m) => m.id !== genId);
          return [...without, { id: mkId("vid_err_"), role: "assistant", hat: "blue", content: [{ type: "text", text: `❌ ${msg}` }] }];
        });
      }
      scrollToBottom();
    } catch (err: unknown) {
      setMessages((p) => {
        const without = p.filter((m) => m.id !== genId);
        return [...without, { id: mkId("vid_err2_"), role: "assistant", hat: "blue", content: [{ type: "text", text: `❌ Video generation error: ${err instanceof Error ? err.message : String(err)}` }] }];
      });
    }
  };

  // ---------- Streaming LLM helper ----------
  // Sends a streaming request to LLM_API. It expects SSE-style data lines: "data: {json}\n\n"
  const streamToMessage = async (
    cleaned: string,
    systemPrompt: string | null,
    onUpdate: (chunk: string) => void,
    signal?: AbortSignal
  ) => {
    const body = {
      model: "local-model",
      stream: true,
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: cleaned },
      ],
    };

    // const res = await fetch(LLM_API, {
    const res = await fetch(llmApiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok || !res.body) {
      const txt = await res.text().catch(() => `${res.status}`);
      throw new Error(`LLM API error: ${res.status} ${txt}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // handle SSE-style chunks: could be multiple "data: ..." lines
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || ""; // remainder

      for (const part of parts) {
        const line = part.trim();
        if (!line) continue;
        // find data: prefix lines
        const lines = line.split(/\n/).map((l) => l.trim());
        for (const l of lines) {
          if (!l.startsWith("data:")) continue;
          const payload = l.replace(/^data:\s*/, "");
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.text ?? null;
            if (delta) onUpdate(String(delta));
          } catch {
            // not JSON — ignore
          }
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  // ---------- Main sendMessage: routes to image/video/hat/multi-hat streaming ----------
  const sendMessage = async () => {
    const raw = input.trim();
    if (!raw && !uploadFile) return;
    const tag = extractHatTag(raw);
    const cleaned = stripHatTag(raw);

    const userMsg: ChatMessage = { id: mkId("u_"), role: "user", content: [] };
    if (cleaned) userMsg.content.push({ type: "text", text: cleaned });
    if (uploadPreview) userMsg.content.push({ type: "image_url", image_url: { url: uploadPreview } });

    setMessages((p) => [...p, userMsg]);

    // reset input/upload state
    setInput("");
    setUploadFile(null);
    setUploadPreview(null);

    // cancel any previous stream
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setLoading(true);

    // image/video shortcuts
    if (tag === "image") {
      await handleImageAgent(cleaned, uploadFile);
      setLoading(false);
      scrollToBottom();
      return;
    }
    if (tag === "video") {
      await handleVideoAgent(cleaned, uploadFile);
      setLoading(false);
      scrollToBottom();
      return;
    }

    const hatNames: string[] = agents.map((a) => a.name);

    // single hat targeted
    if (tag && hatNames.includes(tag)) {
      const hat = tag;
      const assistantId = mkId("a_");
      setMessages((p) => [...p, { id: assistantId, role: "assistant", hat, content: [{ type: "text", text: "" }] }]);
      scrollToBottom();

      try {
        let acc = "";
        const agent = agents.find((a) => a.name === hat);
        await streamToMessage(cleaned, agent?.prompt ?? HAT_SYSTEM_PROMPTS[hat] ?? null, (chunk) => {
          acc += chunk;
          setMessages((p) => p.map((m) => (m.id === assistantId ? { ...m, content: [{ type: "text", text: acc }] } : m)));
          scrollToBottom();
        }, signal);
      } catch (err: unknown) {
        setMessages((p) => p.map((m) => (m.id === assistantId ? { ...m, content: [{ type: "text", text: `❌ LLM error: ${err instanceof Error ? err.message : String(err)}` }] } : m)));
      }

      setLoading(false);
      scrollToBottom();
      return;
    }

    // No hat tag => multi-hat: create one assistant message per hat and stream into each sequentially
    for (const hat of hatNames) {
      const assistantId = mkId("a_");
      setMessages((p) => [...p, { id: assistantId, role: "assistant", hat, content: [{ type: "text", text: "" }] }]);
      scrollToBottom();

      try {
        let acc = "";
        const agent = agents.find((a) => a.name === hat);
        await streamToMessage(cleaned, agent?.prompt ?? HAT_SYSTEM_PROMPTS[hat] ?? null, (chunk) => {
          acc += chunk;
          setMessages((p) => p.map((m) => (m.id === assistantId ? { ...m, content: [{ type: "text", text: acc }] } : m)));
          scrollToBottom();
        }, signal);
        // small pause between hats to make UI feel natural
        await new Promise((r) => setTimeout(r, 200));
      } catch (err: unknown) {
        setMessages((p) => p.map((m) => (m.id.startsWith(assistantId) ? { ...m, content: [{ type: "text", text: `❌ LLM error: ${err instanceof Error ? err.message : String(err)}` }] } : m)));
      }
    }

    setLoading(false);
    scrollToBottom();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {dragActive && (
        <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center text-white text-2xl pointer-events-none">
          Drop image to upload
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">{DEFAULT_CHAT_HEADING}</h1>
          <div className="text-xs text-gray-500">Use <code>@image</code>, <code>@video</code>, or <code>@white/@black/@green</code> to target a hat. No tag -&gt; multi-hat stream.</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSettings((s) => !s)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">
            {showSettings ? "Hide settings" : "Settings"}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-4 bg-white border-b space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium">Image API Base</label>
              <input type="text" value={imageApiBase} onChange={(e) => setImageApiBase(e.target.value)} className="p-2 border rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium">Video API Base</label>
              <input type="text" value={videoApiBase} onChange={(e) => setVideoApiBase(e.target.value)} className="p-2 border rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium">LLM Endpoint</label>
              {/* <div className="text-xs text-gray-600">Streaming endpoint: <code>{LLM_API}</code></div> */}
              <input type="text" value={llmApiBase} onChange={(e) => setLlmApiBase(e.target.value)} className="p-2 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 text-sm">
            <div>
              <label className="text-xs">Image Steps: {imgNumSteps}</label>
              <input type="range" min={4} max={100} value={imgNumSteps} onChange={(e) => setImgNumSteps(Number(e.target.value))} className="w-full accent-gray-600" />
            </div>
            <div>
              <label className="text-xs">Image Scale: {imgGuidance.toFixed(1)}</label>
              <input type="range" min={1} max={10} step={0.1} value={imgGuidance} onChange={(e) => setImgGuidance(Number(e.target.value))} className="w-full accent-gray-600" />
            </div>
            <div>
              <label className="text-xs">Video Frames: {vidNumFrames}</label>
              <input type="range" min={8} max={200} value={vidNumFrames} onChange={(e) => setVidNumFrames(Number(e.target.value))} className="w-full accent-gray-600" />
            </div>
            <div>
              <label className="text-xs">Video FPS: {vidFps}</label>
              <input type="range" min={8} max={60} value={vidFps} onChange={(e) => setVidFps(Number(e.target.value))} className="w-full accent-gray-600" />
            </div>
            <div>
              <label className="text-xs">Video Steps: {vidNumSteps}</label>
              <input type="range" min={4} max={200} value={vidNumSteps} onChange={(e) => setVidNumSteps(Number(e.target.value))} className="w-full accent-gray-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Agents</div>
              <button onClick={addAgent} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">Add agent</button>
            </div>
            <div className="space-y-2">
              {agents.map((a, idx) => (
                <div key={a.name + idx} className="p-3 border rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">@{a.name}</div>
                    <button onClick={() => removeAgent(a.name)} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Delete</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-medium">Name</label>
                      <input type="text" value={a.name} onChange={(e) => updateAgentName(idx, e.target.value)} className="p-2 border rounded" />
                    </div>
                    <div className="col-span-2 flex flex-col">
                      <label className="text-xs font-medium">Personality</label>
                      <textarea value={a.prompt} onChange={(e) => updateAgentPrompt(a.name, e.target.value)} rows={3} className="p-2 border rounded" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Use @{a.name} to target this agent</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const align = m.role === "user" ? "justify-end" : "justify-start";
          const hatStyle = m.role === "assistant" && m.hat ? (agents.find((a) => a.name === m.hat)?.style || HAT_STYLE[m.hat] || "") : "";
          return (
            <div key={m.id} className={`flex ${align}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${m.role === "user" ? "bg-gray-800 text-white" : hatStyle || "bg-white text-gray-900"}`}>
                {m.hat && m.role === "assistant" && <div className="text-xs opacity-60 mb-1">{m.hat.toUpperCase()}</div>}
                {m.content.map((blk, idx) => {
                  if (blk.type === "text") {
                    return (
                      <div key={idx} className="mb-2">
                        <ReactMarkdown
                          components={{
                            pre: ({ children }) => <div className="relative">{children}</div>,
                            code({ className, children }) {
                              const match = /language-(\w+)/.exec(className || "");
                              const content = String(children).replace(/\n$/, "");
                              const isBlock = !!match || content.includes("\n");
                              if (!isBlock) {
                                return <code className="px-1 py-0.5 bg-gray-100 rounded text-[0.95em]">{content}</code>;
                              }
                              return (
                                <div className="relative group">
                                  <button
                                    onClick={() => navigator.clipboard.writeText(content)}
                                    className="absolute top-2 right-2 z-10 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
                                  >
                                    Copy
                                  </button>
                                  <SyntaxHighlighter
                                    language={match?.[1] || "text"}
                                    style={oneDark}
                                    customStyle={{ margin: 0, borderRadius: 8 }}
                                  >
                                    {content}
                                  </SyntaxHighlighter>
                                </div>
                              );
                            },
                          }}
                        >
                          {blk.text}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  if (blk.type === "image_url") {
                    return (
                      <div key={idx} className="mt-2">
                        <img src={blk.image_url.url} alt="img" className="rounded-lg max-w-full" />
                      </div>
                    );
                  }
                  if (blk.type === "video") {
                    return (
                      <div key={idx} className="mt-2">
                        <video src={blk.src} controls loop className="rounded-lg max-w-full" />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            {/* <div className="bg-white p-3 rounded-2xl shadow max-w-[60%] animate-pulse">Generating...</div> */}
            <div className="bg-white p-3 rounded-2xl shadow max-w-[60%] animate-pulse">Thinking...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      <footer className="p-4 bg-white border-t">
        {uploadPreview && (
          <div className="flex items-center gap-3 mb-3">
            <img src={uploadPreview} alt="preview" className="h-16 rounded-lg object-cover border" />
            <div className="flex gap-2">
              <button onClick={() => removeUpload()} className="px-3 py-1 bg-red-100 text-red-700 rounded">Remove</button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message. Use @image, @video, or @white/@black/@green etc."
            className="flex-1 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-200"
          />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
                className="hidden"
                id="file_input"
              />
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className={`px-5 py-2 rounded-lg text-white font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900"}`}>
                Send
              </button>

              {/* {loading &&
              <button
                onClick={() => {
                  // Abort active stream(s)
                  abortRef.current?.abort();
                  setLoading(false);
                }}
                className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-800"
              >
                Stop
              </button>
              } */}

            </div>

          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Tip: Prefix a message with <code>@image</code> to generate images, <code>@video</code> to generate videos, or <code>@black</code> etc. to call a specific hat. No tag -&gt; receive responses streamed sequentially from all hats.
        </div>
      </footer>
    </div>
  );
}
