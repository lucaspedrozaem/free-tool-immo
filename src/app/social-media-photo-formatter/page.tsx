"use client";
import Image from "next/image";

import { useState, useCallback } from "react";
import { PhotoDropzone } from "@/components/PhotoDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import type {
  ProcessedImage,
  ProcessingProgress,
} from "@/lib/image-processing";

type AppState = "upload" | "configure" | "processing" | "done";
type FillMode = "blur" | "black" | "white" | "brand" | "crop";

const CANVAS_PRESETS = [
  { label: "9:16 — Stories / TikTok", width: 1080, height: 1920 },
  { label: "4:5 — Instagram Post", width: 1080, height: 1350 },
  { label: "1:1 — Instagram Square", width: 1080, height: 1080 },
];

const faqItems = [
  {
    question: "Why do my listing photos look bad on Instagram Stories?",
    answer:
      "Instagram Stories use a 9:16 vertical format (1080x1920px). When you share a horizontal listing photo, Instagram either crops out the sides or adds ugly black bars. This tool places your full photo on a vertical canvas with a professional blurred background — no cropping needed.",
  },
  {
    question: "What's the blurred background effect?",
    answer:
      "The tool takes your original photo, scales and blurs it to fill the vertical canvas, then places the sharp original photo centered on top. This creates a professional, magazine-quality look that's become the standard for real estate social media.",
  },
  {
    question: "Can I use this for TikTok and Reels too?",
    answer:
      "Yes! TikTok, Instagram Reels, YouTube Shorts, and Facebook Stories all use the same 9:16 vertical format. Photos formatted with this tool work perfectly on all these platforms.",
  },
  {
    question: "Can I add my branding color instead of blur?",
    answer:
      "Yes! You can choose between blurred background, solid black, solid white, or a custom brand color for the fill areas above and below your photo.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All processing happens locally in your browser using HTML5 Canvas. Your listing photos never leave your device.",
  },
];

async function formatForSocial(
  file: File,
  canvasWidth: number,
  canvasHeight: number,
  fillMode: FillMode,
  brandColor: string
): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d")!;

  if (fillMode === "crop") {
    // Center-crop to fill the entire canvas (no background)
    const coverScale = Math.max(canvasWidth / bitmap.width, canvasHeight / bitmap.height);
    const srcW = Math.round(canvasWidth / coverScale);
    const srcH = Math.round(canvasHeight / coverScale);
    const srcX = Math.round((bitmap.width - srcW) / 2);
    const srcY = Math.round((bitmap.height - srcH) / 2);
    ctx.drawImage(bitmap, srcX, srcY, srcW, srcH, 0, 0, canvasWidth, canvasHeight);
  } else {
    // Fill background
    if (fillMode === "blur") {
      const bgScale = Math.max(canvasWidth / bitmap.width, canvasHeight / bitmap.height);
      const bgW = Math.round(bitmap.width * bgScale);
      const bgH = Math.round(bitmap.height * bgScale);
      const bgX = Math.round((canvasWidth - bgW) / 2);
      const bgY = Math.round((canvasHeight - bgH) / 2);
      ctx.filter = "blur(30px) brightness(0.7)";
      ctx.drawImage(bitmap, bgX - 20, bgY - 20, bgW + 40, bgH + 40);
      ctx.filter = "none";
    } else if (fillMode === "brand") {
      ctx.fillStyle = brandColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      ctx.fillStyle = fillMode === "black" ? "#000000" : "#ffffff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Draw original photo centered (fit inside canvas)
    const scale = Math.min(canvasWidth / bitmap.width, canvasHeight / bitmap.height) * 0.9;
    const drawW = Math.round(bitmap.width * scale);
    const drawH = Math.round(bitmap.height * scale);
    const drawX = Math.round((canvasWidth - drawW) / 2);
    const drawY = Math.round((canvasHeight - drawH) / 2);
    ctx.drawImage(bitmap, drawX, drawY, drawW, drawH);
  }
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  const baseName = file.name.replace(/\.[^.]+$/, "");

  return {
    originalName: file.name,
    newName: `${baseName}-social.jpg`,
    blob,
    width: canvasWidth,
    height: canvasHeight,
    originalSize: file.size,
    newSize: blob.size,
  };
}

export default function SocialMediaFormatterPage() {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0, total: 0, currentFile: "", stage: "Formatting",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [presetIndex, setPresetIndex] = useState(0);
  const [fillMode, setFillMode] = useState<FillMode>("blur");
  const [brandColor, setBrandColor] = useState("#2563EB");

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleProcess = async () => {
    setState("processing");
    const preset = CANVAS_PRESETS[presetIndex];
    const processed: ProcessedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({
        current: i + 1,
        total: files.length,
        currentFile: files[i].name,
        stage: "Formatting",
      });
      const result = await formatForSocial(
        files[i], preset.width, preset.height, fillMode, brandColor
      );
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
                  src="/illustrations/tool-social-media.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                9:16 Social Media Photo Formatter
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Convert horizontal listing photos to vertical format for Instagram Stories, TikTok, and Reels — with a professional blurred background. No cropping.
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Canvas Size
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {CANVAS_PRESETS.map((preset, i) => (
                      <button
                        key={preset.label}
                        onClick={() => setPresetIndex(i)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                          presetIndex === i
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-600 hover:border-primary/40"
                        }`}
                      >
                        {preset.label}
                        <span className="block text-xs text-gray-400 mt-0.5">
                          {preset.width}x{preset.height}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Background Fill
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {([
                      { mode: "blur" as FillMode, label: "Blurred Photo", desc: "Most popular" },
                      { mode: "crop" as FillMode, label: "Crop to Fill", desc: "No background" },
                      { mode: "black" as FillMode, label: "Black", desc: "Classic look" },
                      { mode: "white" as FillMode, label: "White", desc: "Clean & minimal" },
                      { mode: "brand" as FillMode, label: "Brand Color", desc: "Custom color" },
                    ]).map(({ mode, label, desc }) => (
                      <button
                        key={mode}
                        onClick={() => setFillMode(mode)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                          fillMode === mode
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

                {fillMode === "brand" && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700">Brand Color:</label>
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <span className="text-sm text-gray-500">{brandColor}</span>
                  </div>
                )}

                <button
                  onClick={handleProcess}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg"
                >
                  Format {files.length} Photo{files.length !== 1 ? "s" : ""}
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
              Make Listing Photos Work on Instagram Stories & TikTok
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Real estate photos are almost always horizontal (landscape orientation). But Instagram Stories, TikTok, Reels, and YouTube Shorts all use a vertical 9:16 format. Simply uploading a horizontal photo means Instagram will crop out the best parts of your listing. This tool solves the problem by placing your full photo on a vertical canvas with a beautiful blurred background — keeping every detail visible while looking professionally formatted.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/photo-grid-maker" className="text-primary font-semibold hover:underline">
              Want to combine multiple photos into a collage? Try our Photo Grid Maker &rarr;
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
