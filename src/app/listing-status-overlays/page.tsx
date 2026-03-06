"use client";
import Image from "next/image";

import { useState, useCallback } from "react";
import { PhotoDropzone } from "@/components/PhotoDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import {
  createRuntimeCanvas,
  decodeImageWithFallback,
  getRuntime2DContext,
  runtimeCanvasToBlob,
} from "@/lib/canvas-runtime";
import type {
  ProcessedImage,
  ProcessingProgress,
} from "@/lib/image-processing";

type AppState = "upload" | "configure" | "processing" | "done";
type RibbonStyle = "corner" | "banner-top" | "banner-bottom";

const STATUS_PRESETS = [
  { text: "JUST LISTED", color: "#2563EB" },
  { text: "JUST SOLD", color: "#DC2626" },
  { text: "UNDER CONTRACT", color: "#F59E0B" },
  { text: "PRICE REDUCED", color: "#10B981" },
  { text: "PENDING", color: "#8B5CF6" },
  { text: "OPEN HOUSE", color: "#0891B2" },
  { text: "COMING SOON", color: "#1D4ED8" },
  { text: "NEW PRICE", color: "#059669" },
];

const faqItems = [
  {
    question: "What status ribbons are available?",
    answer:
      "We offer 8 pre-designed status options: Just Listed, Just Sold, Under Contract, Price Reduced, Pending, Open House, Coming Soon, and New Price. Each has a distinct color for instant recognition. You can also enter custom text.",
  },
  {
    question: "Can I customize the ribbon color?",
    answer:
      "Yes! Each status comes with a default color, but you can change it to match your brand using the color picker.",
  },
  {
    question: "What ribbon styles are available?",
    answer:
      "Three styles: Corner Ribbon (angled in the top-left corner), Top Banner (full-width bar at the top), and Bottom Banner (full-width bar at the bottom). Choose whichever fits your branding.",
  },
  {
    question: "Can I batch-apply to multiple photos?",
    answer:
      "Yes! Upload up to 50 listing photos and apply the same status ribbon to all of them at once. Download everything as a ZIP file - perfect for creating a consistent social media series.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All overlay rendering happens locally in your browser using HTML5 Canvas. Your listing photos never leave your device.",
  },
];

async function applyStatusOverlay(
  file: File,
  config: {
    text: string;
    color: string;
    style: RibbonStyle;
  }
): Promise<ProcessedImage> {
  const decoded = await decodeImageWithFallback(file, file.name);
  const canvas = createRuntimeCanvas(decoded.width, decoded.height);
  const ctx = getRuntime2DContext(canvas, file.name);
  ctx.drawImage(decoded.source, 0, 0);

  const w = decoded.width;
  const h = decoded.height;

  if (config.style === "corner") {
    // Angled corner ribbon
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(0);

    const ribbonW = Math.min(w * 0.55, 600);
    const ribbonH = Math.max(50, Math.round(h * 0.06));

    ctx.save();
    ctx.translate(w * 0.02, h * 0.02);

    // Ribbon background
    ctx.fillStyle = config.color;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;

    const rX = 0;
    const rY = 0;
    const radius = 6;
    ctx.beginPath();
    ctx.moveTo(rX + radius, rY);
    ctx.lineTo(rX + ribbonW - radius, rY);
    ctx.arcTo(rX + ribbonW, rY, rX + ribbonW, rY + radius, radius);
    ctx.lineTo(rX + ribbonW, rY + ribbonH - radius);
    ctx.arcTo(rX + ribbonW, rY + ribbonH, rX + ribbonW - radius, rY + ribbonH, radius);
    ctx.lineTo(rX + radius, rY + ribbonH);
    ctx.arcTo(rX, rY + ribbonH, rX, rY + ribbonH - radius, radius);
    ctx.lineTo(rX, rY + radius);
    ctx.arcTo(rX, rY, rX + radius, rY, radius);
    ctx.fill();

    ctx.shadowColor = "transparent";

    // Text
    const fontSize = Math.max(20, Math.round(ribbonH * 0.55));
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.text, ribbonW / 2, ribbonH / 2 + 1);

    ctx.restore();
  } else if (config.style === "banner-top") {
    const bannerH = Math.max(60, Math.round(h * 0.07));
    ctx.fillStyle = config.color;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, 0, w, bannerH);
    ctx.globalAlpha = 1;

    const fontSize = Math.max(22, Math.round(bannerH * 0.5));
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.text, w / 2, bannerH / 2);
  } else {
    // banner-bottom
    const bannerH = Math.max(60, Math.round(h * 0.07));
    ctx.fillStyle = config.color;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, h - bannerH, w, bannerH);
    ctx.globalAlpha = 1;

    const fontSize = Math.max(22, Math.round(bannerH * 0.5));
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.text, w / 2, h - bannerH / 2);
  }

  decoded.close();

  const blob = await runtimeCanvasToBlob(canvas, { type: "image/jpeg", quality: 0.92 });
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const statusSlug = config.text.toLowerCase().replace(/\s+/g, "-");

  return {
    originalName: file.name,
    newName: `${baseName}-${statusSlug}.jpg`,
    blob,
    width: w,
    height: h,
    originalSize: file.size,
    newSize: blob.size,
  };
}

export default function ListingStatusOverlaysPage() {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0, total: 0, currentFile: "", stage: "Applying overlay",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState("#2563EB");
  const [useCustom, setUseCustom] = useState(false);
  const [ribbonStyle, setRibbonStyle] = useState<RibbonStyle>("corner");

  const activeText = useCustom ? customText : STATUS_PRESETS[selectedPreset].text;
  const activeColor = useCustom ? customColor : STATUS_PRESETS[selectedPreset].color;

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleProcess = async () => {
    if (!activeText.trim()) return;
    setState("processing");
    const processed: ProcessedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({
        current: i + 1, total: files.length, currentFile: files[i].name, stage: "Applying overlay",
      });
      const result = await applyStatusOverlay(files[i], {
        text: activeText, color: activeColor, style: ribbonStyle,
      });
      processed.push(result);
    }
    setResults(processed);
    setState("done");
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setState("upload");
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {state === "upload" && (
            <div className="text-center">
              <div className="text-center mb-6">
                <Image
                  src="/illustrations/tool-status-overlay.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                Listing Status Overlays
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Add &ldquo;Just Listed&rdquo;, &ldquo;Just Sold&rdquo;, &ldquo;Under Contract&rdquo;, and more to your listing photos. One click, batch apply, download.
              </p>
              <div className="mt-8">
                <PhotoDropzone onFiles={handleFiles} />
              </div>
            </div>
          )}

          {state === "configure" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-2xl">
                  {files.length} Photo{files.length !== 1 ? "s" : ""} Ready
                </h2>
                <button onClick={handleReset} className="text-sm text-gray-500 hover:text-primary">
                  Start Over
                </button>
              </div>

              <div className="space-y-6">
                {/* Status Presets */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STATUS_PRESETS.map((preset, i) => (
                      <button
                        key={preset.text}
                        onClick={() => {
                          setSelectedPreset(i);
                          setUseCustom(false);
                        }}
                        className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
                          !useCustom && selectedPreset === i
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-600 hover:border-primary/40"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: preset.color }}
                        />
                        {preset.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom option */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCustom}
                      onChange={(e) => setUseCustom(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Custom text & color
                    </span>
                  </label>
                  {useCustom && (
                    <div className="mt-3 flex items-center gap-3 pl-7">
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                        placeholder="YOUR TEXT HERE"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                {/* Ribbon Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ribbon Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {([
                      { style: "corner" as RibbonStyle, label: "Corner Ribbon", desc: "Top-left corner" },
                      { style: "banner-top" as RibbonStyle, label: "Top Banner", desc: "Full width top" },
                      { style: "banner-bottom" as RibbonStyle, label: "Bottom Banner", desc: "Full width bottom" },
                    ]).map(({ style, label, desc }) => (
                      <button
                        key={style}
                        onClick={() => setRibbonStyle(style)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                          ribbonStyle === style
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-600 hover:border-primary/40"
                        }`}
                      >
                        {label}
                        <span className="block text-xs text-gray-400 mt-0.5">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                  <div className="relative w-64 h-44 bg-gray-300 rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                      Photo
                    </div>
                    {ribbonStyle === "corner" && (
                      <div
                        className="absolute top-2 left-2 px-4 py-1.5 rounded text-white text-xs font-bold shadow-md"
                        style={{ backgroundColor: activeColor }}
                      >
                        {activeText || "STATUS"}
                      </div>
                    )}
                    {ribbonStyle === "banner-top" && (
                      <div
                        className="absolute top-0 left-0 right-0 py-2 text-white text-xs font-bold text-center"
                        style={{ backgroundColor: activeColor, opacity: 0.9 }}
                      >
                        {activeText || "STATUS"}
                      </div>
                    )}
                    {ribbonStyle === "banner-bottom" && (
                      <div
                        className="absolute bottom-0 left-0 right-0 py-2 text-white text-xs font-bold text-center"
                        style={{ backgroundColor: activeColor, opacity: 0.9 }}
                      >
                        {activeText || "STATUS"}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleProcess}
                  disabled={!activeText.trim()}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Apply to {files.length} Photo{files.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          )}

          {state === "processing" && <ProgressBar progress={progress} />}
          {state === "done" && <ResultsPanel images={results} onReset={handleReset} />}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Professional Status Overlays for Real Estate Social Media
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Every real estate transaction milestone is a marketing opportunity. &ldquo;Just Listed&rdquo; photos generate buyer interest. &ldquo;Just Sold&rdquo; photos build your track record. &ldquo;Under Contract&rdquo; and &ldquo;Price Reduced&rdquo; photos keep your listings visible. Instead of designing these overlays from scratch in Canva, this tool applies professional status ribbons to your listing photos in one click - batch process your entire listing in seconds.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/agent-branding-bar" className="text-primary font-semibold hover:underline">
              Want to add your contact info to photos? Try our Agent Branding Bar &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-2xl text-center mb-8">
            Frequently Asked Questions
          </h2>
          <FAQSection items={faqItems} />
        </div>
      </section>
    </>
  );
}
