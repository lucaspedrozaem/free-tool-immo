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
import { downloadAsZip, downloadSingleImage, formatFileSize } from "@/lib/image-processing";
type AppState = "upload" | "configure" | "processing" | "done";

const ASPECT_PRESETS = [
  { label: "4:3 - MLS Standard", ratio: 4 / 3 },
  { label: "3:2 - DSLR Photos", ratio: 3 / 2 },
  { label: "16:9 - Widescreen / Presentations", ratio: 16 / 9 },
  { label: "1:1 - Instagram Square", ratio: 1 },
  { label: "9:16 - Instagram Stories / TikTok", ratio: 9 / 16 },
  { label: "3:4 - Portrait MLS", ratio: 3 / 4 },
  { label: "Custom", ratio: 0 },
];

const faqItems = [
  {
    question: "What aspect ratio does the MLS require?",
    answer:
      "Most MLS systems prefer 4:3 aspect ratio photos. Some accept 3:2 or 16:9. The standard MLS photo dimensions are typically 2048x1536 (4:3) or 1920x1080 (16:9). Our tool automatically center-crops your photos to the exact ratio required.",
  },
  {
    question: "Will cropping reduce image quality?",
    answer:
      "No. This tool performs a lossless center-crop - it simply trims the edges to match your target ratio. The remaining pixels are untouched. The output is saved at 92% JPG quality, which is visually identical to the original.",
  },
  {
    question: "Can I crop multiple photos at once?",
    answer:
      "Yes! Upload up to 50 photos and crop them all to the same aspect ratio in one batch. All photos are downloaded together as a ZIP file.",
  },
  {
    question: "What's the difference between cropping and resizing?",
    answer:
      "Cropping removes pixels from the edges to change the shape (aspect ratio) of the image. Resizing changes the overall dimensions while keeping the same shape. This tool does both - it center-crops to your target ratio, then optionally resizes to specific pixel dimensions.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All processing happens locally in your browser. Your listing photos never leave your device, ensuring complete privacy for unreleased properties.",
  },
];

async function cropImage(
  file: File,
  targetRatio: number,
  maxWidth?: number,
  quality: number = 0.92
): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file);
  const srcW = bitmap.width;
  const srcH = bitmap.height;
  const srcRatio = srcW / srcH;

  let cropW: number, cropH: number, cropX: number, cropY: number;

  if (srcRatio > targetRatio) {
    cropH = srcH;
    cropW = Math.round(srcH * targetRatio);
    cropX = Math.round((srcW - cropW) / 2);
    cropY = 0;
  } else {
    cropW = srcW;
    cropH = Math.round(srcW / targetRatio);
    cropX = 0;
    cropY = Math.round((srcH - cropH) / 2);
  }

  let outW = cropW;
  let outH = cropH;
  if (maxWidth && outW > maxWidth) {
    const scale = maxWidth / outW;
    outW = maxWidth;
    outH = Math.round(outH * scale);
  }

  const canvas = new OffscreenCanvas(outW, outH);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, cropX, cropY, cropW, cropH, 0, 0, outW, outH);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  const baseName = file.name.replace(/\.[^.]+$/, "");

  return {
    originalName: file.name,
    newName: `${baseName}-cropped.jpg`,
    blob,
    width: outW,
    height: outH,
    originalSize: file.size,
    newSize: blob.size,
  };
}

export default function BatchAspectRatioCropperPage() {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0,
    total: 0,
    currentFile: "",
    stage: "Cropping",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [presetIndex, setPresetIndex] = useState(0);
  const [customW, setCustomW] = useState(4);
  const [customH, setCustomH] = useState(3);
  const [enableMaxWidth, setEnableMaxWidth] = useState(false);
  const [maxWidth, setMaxWidth] = useState(2048);

  const selectedRatio =
    ASPECT_PRESETS[presetIndex].ratio === 0
      ? customW / customH
      : ASPECT_PRESETS[presetIndex].ratio;

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleProcess = async () => {
    setState("processing");
    const processed: ProcessedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({
        current: i + 1,
        total: files.length,
        currentFile: files[i].name,
        stage: "Cropping",
      });
      const result = await cropImage(
        files[i],
        selectedRatio,
        enableMaxWidth ? maxWidth : undefined
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
                  src="/illustrations/tool-aspect-ratio.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                Batch Aspect Ratio Cropper
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Center-crop all your listing photos to the exact aspect ratio your MLS requires. 4:3, 16:9, 1:1, or custom - batch process up to 50 photos.
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
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-primary"
                >
                  Start Over
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Target Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ASPECT_PRESETS.map((preset, i) => (
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
                      </button>
                    ))}
                  </div>
                </div>

                {ASPECT_PRESETS[presetIndex].ratio === 0 && (
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Width ratio</label>
                      <input
                        type="number"
                        value={customW}
                        onChange={(e) => setCustomW(Math.max(1, Number(e.target.value)))}
                        min={1}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <span className="text-gray-400 mt-5">:</span>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Height ratio</label>
                      <input
                        type="number"
                        value={customH}
                        onChange={(e) => setCustomH(Math.max(1, Number(e.target.value)))}
                        min={1}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableMaxWidth}
                      onChange={(e) => setEnableMaxWidth(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">
                        Limit max width
                      </span>
                      <p className="text-xs text-gray-500">
                        Scale down photos larger than the specified width
                      </p>
                    </div>
                  </label>
                  {enableMaxWidth && (
                    <div className="mt-3 pl-7">
                      <select
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value={1280}>1280px (Web)</option>
                        <option value={1920}>1920px (Full HD)</option>
                        <option value={2048}>2048px (MLS Standard)</option>
                        <option value={3840}>3840px (4K)</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="bg-primary-light rounded-lg p-4 text-sm text-primary">
                  Preview: Photos will be center-cropped to{" "}
                  <strong>
                    {ASPECT_PRESETS[presetIndex].ratio === 0
                      ? `${customW}:${customH}`
                      : ASPECT_PRESETS[presetIndex].label.split(" - ")[0]}
                  </strong>{" "}
                  aspect ratio
                  {enableMaxWidth && ` (max ${maxWidth}px wide)`}
                </div>

                <button
                  onClick={handleProcess}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg"
                >
                  Crop {files.length} Photo{files.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          )}

          {state === "processing" && <ProgressBar progress={progress} />}
          {state === "done" && (
            <ResultsPanel images={results} onReset={handleReset} />
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Why Aspect Ratio Matters for Real Estate Photos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Every MLS and listing platform has specific aspect ratio requirements. Photos that don&apos;t match get stretched, letterboxed, or rejected entirely. The most common requirement is 4:3 for MLS uploads and 16:9 for presentation-quality hero images. Instead of manually cropping each photo in Photoshop, this tool batch-processes your entire listing in seconds - center-cropping each image to the perfect ratio.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              How to Batch Crop Photos
            </h2>
            <ol className="space-y-3">
              {[
                "Upload your listing photos - drag and drop up to 50 images at once.",
                "Select your target aspect ratio - choose a preset (4:3 for MLS, 1:1 for Instagram) or enter a custom ratio.",
                "Download your cropped photos - get perfectly formatted images ready for upload.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-primary-light rounded-lg p-4">
            <Link
              href="/mls-photo-resizer"
              className="text-primary font-semibold hover:underline"
            >
              Need to resize for specific MLS dimensions? Try our MLS Photo Resizer &rarr;
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
