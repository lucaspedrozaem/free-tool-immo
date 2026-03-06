"use client";
import Image from "next/image";

import { useState, useCallback, useRef, useEffect } from "react";
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

const faqItems = [
  {
    question: "What adjustments can I make?",
    answer:
      "You can adjust brightness, contrast, exposure (overall lightness), saturation (color intensity), and warmth (color temperature). Each slider goes from -100 to +100 with 0 being no change.",
  },
  {
    question: "Will this fix dark or overexposed photos?",
    answer:
      "Yes! Increasing brightness and exposure can rescue dark interior shots. Reducing exposure helps tone down blown-out windows and overly bright areas. The contrast slider helps add depth to flat-looking photos.",
  },
  {
    question: "Can I batch-enhance multiple photos?",
    answer:
      "Yes! Upload up to 50 listing photos and the same adjustments are applied to all of them at once. Download everything as a ZIP file.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All enhancement happens locally in your browser using HTML5 Canvas filters. Your listing photos never leave your device.",
  },
  {
    question: "What's the difference between brightness and exposure?",
    answer:
      "Brightness uniformly lightens or darkens the image. Exposure simulates camera exposure - it affects highlights and midtones more naturally, similar to adjusting the exposure dial on a camera.",
  },
];

async function enhancePhoto(
  file: File,
  config: {
    brightness: number;
    contrast: number;
    exposure: number;
    saturation: number;
    warmth: number;
  }
): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;

  // Build CSS filter string from adjustments
  // brightness: 0-200% (100% = no change)
  const brightnessVal = 100 + config.brightness;
  // contrast: 0-200% (100% = no change)
  const contrastVal = 100 + config.contrast;
  // exposure maps to brightness too, but more subtle
  const exposureVal = 100 + config.exposure * 0.5;
  // saturation: 0-200% (100% = no change)
  const saturationVal = 100 + config.saturation;

  const combinedBrightness = (brightnessVal / 100) * (exposureVal / 100) * 100;

  ctx.filter = `brightness(${combinedBrightness}%) contrast(${contrastVal}%) saturate(${saturationVal}%)`;
  ctx.drawImage(bitmap, 0, 0);
  ctx.filter = "none";

  // Warmth: apply a subtle orange/blue color overlay
  if (config.warmth !== 0) {
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = Math.abs(config.warmth) / 400;
    if (config.warmth > 0) {
      // Warm: orange tint
      ctx.fillStyle = "#FF8C00";
    } else {
      // Cool: blue tint
      ctx.fillStyle = "#4488FF";
    }
    ctx.fillRect(0, 0, bitmap.width, bitmap.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  const baseName = file.name.replace(/\.[^.]+$/, "");

  return {
    originalName: file.name,
    newName: `${baseName}-enhanced.jpg`,
    blob,
    width: canvas.width,
    height: canvas.height,
    originalSize: file.size,
    newSize: blob.size,
  };
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon: string;
}

function EnhanceSlider({ label, value, onChange, icon }: SliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="text-base">{icon}</span> {label}
        </label>
        <span className="text-xs font-mono text-gray-500 w-10 text-right">
          {value > 0 ? "+" : ""}{value}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={-100}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-primary h-1.5"
        />
        <button
          onClick={() => onChange(0)}
          className="text-xs text-gray-400 hover:text-primary flex-shrink-0"
          title="Reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function PhotoEnhancerPage() {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0, total: 0, currentFile: "", stage: "Enhancing",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [warmth, setWarmth] = useState(0);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a preview from the first uploaded file
  useEffect(() => {
    if (files.length === 0) return;
    const url = URL.createObjectURL(files[0]);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [files]);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleProcess = async () => {
    setState("processing");
    const processed: ProcessedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({
        current: i + 1, total: files.length, currentFile: files[i].name, stage: "Enhancing",
      });
      const result = await enhancePhoto(files[i], {
        brightness, contrast, exposure, saturation, warmth,
      });
      processed.push(result);
    }
    setResults(processed);
    setState("done");
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setPreviewUrl(null);
    setState("upload");
  };

  const handleResetAll = () => {
    setBrightness(0);
    setContrast(0);
    setExposure(0);
    setSaturation(0);
    setWarmth(0);
  };

  // CSS filter for live preview
  const brightnessVal = 100 + brightness;
  const contrastVal = 100 + contrast;
  const exposureVal = 100 + exposure * 0.5;
  const saturationVal = 100 + saturation;
  const combinedBrightness = (brightnessVal / 100) * (exposureVal / 100) * 100;
  const previewFilter = `brightness(${combinedBrightness}%) contrast(${contrastVal}%) saturate(${saturationVal}%)`;

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {state === "upload" && (
            <div className="text-center">
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                Photo Enhancer
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Adjust brightness, contrast, exposure, saturation, and warmth on your listing photos. Batch enhance up to 50 photos at once.
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

              <div className="grid md:grid-cols-2 gap-6">
                {/* Controls */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                      Adjustments
                    </h3>
                    <button
                      onClick={handleResetAll}
                      className="text-xs text-gray-400 hover:text-primary font-medium"
                    >
                      Reset All
                    </button>
                  </div>

                  <EnhanceSlider label="Brightness" icon="☀" value={brightness} onChange={setBrightness} />
                  <EnhanceSlider label="Contrast" icon="◐" value={contrast} onChange={setContrast} />
                  <EnhanceSlider label="Exposure" icon="📷" value={exposure} onChange={setExposure} />
                  <EnhanceSlider label="Saturation" icon="🎨" value={saturation} onChange={setSaturation} />
                  <EnhanceSlider label="Warmth" icon="🌡" value={warmth} onChange={setWarmth} />

                  {/* Quick presets */}
                  <div className="pt-3 border-t border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setBrightness(15); setContrast(10); setExposure(10); setSaturation(10); setWarmth(5); }}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        Brighten Interior
                      </button>
                      <button
                        onClick={() => { setBrightness(5); setContrast(20); setExposure(0); setSaturation(15); setWarmth(0); }}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        Vivid & Punchy
                      </button>
                      <button
                        onClick={() => { setBrightness(0); setContrast(5); setExposure(0); setSaturation(-20); setWarmth(-10); }}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        Cool & Clean
                      </button>
                      <button
                        onClick={() => { setBrightness(10); setContrast(10); setExposure(5); setSaturation(5); setWarmth(15); }}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        Warm & Inviting
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">
                    Preview
                  </h3>
                  {previewUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full"
                        style={{ filter: previewFilter }}
                      />
                    </div>
                  )}
                  {warmth !== 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Warmth adjustment is applied during processing (not shown in live preview).
                    </p>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleProcess}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg"
                >
                  Enhance {files.length} Photo{files.length !== 1 ? "s" : ""}
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
              Fix Dark Interiors & Flat Listing Photos in Seconds
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Not every listing photo comes out perfectly exposed. Dark interiors, overcast skies, and flat lighting are common challenges in real estate photography. Instead of opening Photoshop or paying an editor, this tool lets you quickly adjust brightness, contrast, exposure, saturation, and color warmth - then batch apply those same adjustments to your entire listing photo set. Quick presets like &ldquo;Brighten Interior&rdquo; and &ldquo;Warm & Inviting&rdquo; give you one-click professional results.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/listing-status-overlays" className="text-primary font-semibold hover:underline">
              Enhanced your photos? Add a &ldquo;Just Listed&rdquo; overlay next &rarr;
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
