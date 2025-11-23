
// import './App.css';
import { useState } from "react";

// const API_BASE = "http://127.0.0.1:8000";
const SAMPLE_PROMPTS = [
  "describe this document in details",
  "summarize it",
  "audit it",
  "describe what you see in one sentence",
  "tell me the amount",
];

// const Audit = ({theme,ArrowLoad}:any) => {
const Audit = ({ArrowLoad}:any) => {
  // const [apiBase, setApiBase] = useState<string>("http://127.0.0.1:8000");
  const [apiBase] = useState<string>("http://127.0.0.1:8000");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [numTokens, setNumTokens] = useState(128);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClearAll = () => {
    setImage(null);
    setPreview(null);
    setPrompt("");
    setNumTokens(128);
    setResult("");
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };
  
  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }
    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);
      formData.append("num_tokens", numTokens.toString());

      const resp = await fetch(`${apiBase}/api/describe`, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const json = await resp.json().catch(() => null);
        throw new Error(json?.error || `Server error ${resp.status}`);
      }

      const response = await resp.json();
      setResult(response.description || "No description returned.");
    } catch (err: any) {
      setResult("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
    // <div className="min-h-screen">
    <div className="max-w-6xl mx-auto">
    <div className='py-6'></div>
    {/* <div className="min-h-screen flex flex-col items-center p-6"> */}
      {/* <h1 className="text-3xl font-bold mb-6">🖼️ Image Descriptor</h1> */}

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* Left Panel - Input */}
        <div
          className="flex-1 border rounded-xl bg-white shadow-sm p-4 flex flex-col"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Drag-and-Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 text-center mb-4 transition ${
              preview
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            {preview ? (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg object-contain"
                />
                {/* Remove Image Button */}
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <p className="text-gray-500">
                Drag & Drop an image here, or click to upload
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="hidden"
              id="file-input"
            />
            {/* <label
              htmlFor="file-input"
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
            >
              Choose File
            </label> */}
          </div>

          {/* Prompt Input */}
          <textarea
            className="border rounded p-2 mb-3 w-full"
            rows={2}
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* Sample Prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Token Slider */}
          <label className="flex items-center justify-between mb-2">
            <span>Output Tokens:</span>
            <span className="font-semibold">{numTokens}</span>
          </label>
          <input
            type="range"
            min={1}
            max={1024}
            value={numTokens}
            onChange={(e) => setNumTokens(Number(e.target.value))}
            className="w-full mb-4"
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              // className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              className={`flex-1 ${loading ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-600"} px-4 py-2 rounded font-semibold w-full  text-white`}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
            <button
              onClick={handleClearAll}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="flex-1 border rounded-xl bg-white shadow-sm p-4 overflow-auto text-left">
          <h2 className="text-lg font-semibold mb-2">Output</h2>
          {loading && (
            // <p className="text-gray-500 italic text-center">Generating description...</p>
            <div className="grid grid-cols-1 grid-rows-1 place-items-center">
              Thinking...
              <ArrowLoad />
            </div>
          )}
          {!loading && result && (
            <div className="p-3 border rounded bg-gray-50 whitespace-pre-wrap text-gray-800">
              {result}
            </div>
          )}
          {!loading && !result && (
            <p className="text-gray-400 italic text-center">Result will appear here.</p>
          )}
          {/* {loading&&(
            <div className="grid grid-cols-1 grid-rows-1 place-items-center">
              <ArrowLoad />
              Generating image...
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Audit;
