"use client";

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
type SkyMode = "brighten" | "blue-gradient" | "sunset" | "clear-day";

const SKY_PRESETS: { mode: SkyMode; label: string; desc: string; colors: [string, string] }[] = [
  { mode: "brighten", label: "Brighten Sky", desc: "Lighten existing sky tones", colors: ["#E0F2FE", "#BAE6FD"] },
  { mode: "blue-gradient", label: "Clear Blue", desc: "Clean blue gradient sky", colors: ["#3B82F6", "#93C5FD"] },
  { mode: "sunset", label: "Golden Hour", desc: "Warm golden sunset tones", colors: ["#F59E0B", "#FDE68A"] },
  { mode: "clear-day", label: "Bright Day", desc: "Bright white-to-blue", colors: ["#DBEAFE", "#60A5FA"] },
];

const faqItems = [
  {
    question: "How does the sky detection work?",
    answer:
      "The tool analyzes the top portion of your image looking for light-colored, low-saturation pixels (typical of overcast or dull skies). It then applies your chosen sky effect to the detected sky area while preserving trees, buildings, and other foreground elements.",
  },
  {
    question: "Will this work with any photo?",
    answer:
      "It works best with exterior photos where the sky is visible in the top third of the image. Interior photos, photos where trees cover most of the sky, or heavily obstructed sky areas may produce less accurate results. You can adjust the detection threshold for better control.",
  },
  {
    question: "Is this MLS compliant?",
    answer:
      "Brightening an existing sky is generally acceptable. However, completely replacing a sky with a different one may violate MLS photo editing rules in some markets. Check your local MLS guidelines. When in doubt, use the 'Brighten Sky' mode which enhances rather than replaces.",
  },
  {
    question: "Can I batch-process multiple photos?",
    answer:
      "Yes! Upload up to 50 photos and apply the same sky enhancement to all of them. Download everything as a ZIP file.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All processing happens locally in your browser using HTML5 Canvas. Your listing photos never leave your device.",
  },
];

async function processSky(
  file: File,
  config: {
    mode: SkyMode;
    threshold: number;
    intensity: number;
  }
): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file);
  const w = bitmap.width;
  const h = bitmap.height;
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Sky detection: analyze pixels in the top 40% of image
  // Pixels that are bright + low saturation = likely sky
  const skyLimit = Math.round(h * 0.4);
  const skyMask = new Uint8Array(w * h); // 0 = not sky, 255 = sky

  const thresholdBrightness = 100 + config.threshold; // 100-200 range
  const thresholdSaturation = 80 - config.threshold * 0.4; // lower threshold = more permissive

  for (let y = 0; y < skyLimit; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Brightness
      const brightness = (r + g + b) / 3;
      // Saturation (simplified)
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : ((max - min) / max) * 100;

      if (brightness >= thresholdBrightness && saturation <= thresholdSaturation) {
        skyMask[y * w + x] = 255;
      }
    }
  }

  // Expand detected sky downward using column-based flood fill
  for (let x = 0; x < w; x++) {
    let lastSkyY = -1;
    for (let y = 0; y < skyLimit; y++) {
      if (skyMask[y * w + x] === 255) lastSkyY = y;
    }
    // Fill gaps in sky columns
    if (lastSkyY > 0) {
      for (let y = 0; y <= lastSkyY; y++) {
        skyMask[y * w + x] = 255;
      }
    }
  }

  // Apply sky effect based on mode
  const preset = SKY_PRESETS.find((p) => p.mode === config.mode)!;
  const intensity = config.intensity / 100;

  if (config.mode === "brighten") {
    // Just brighten the sky pixels
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const mi = y * w + x;
        if (skyMask[mi] === 0) continue;
        const i = mi * 4;
        const boost = 30 * intensity;
        data[i] = Math.min(255, data[i] + boost);
        data[i + 1] = Math.min(255, data[i + 1] + boost);
        data[i + 2] = Math.min(255, data[i + 2] + boost + 10); // slight blue push
      }
    }
  } else {
    // Gradient replacement
    const [color1, color2] = preset.colors;
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    // Find max sky Y for gradient range
    let maxSkyY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (skyMask[y * w + x] === 255 && y > maxSkyY) maxSkyY = y;
      }
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const mi = y * w + x;
        if (skyMask[mi] === 0) continue;
        const i = mi * 4;
        const t = maxSkyY > 0 ? y / maxSkyY : 0;
        const gr = c1.r + (c2.r - c1.r) * t;
        const gg = c1.g + (c2.g - c1.g) * t;
        const gb = c1.b + (c2.b - c1.b) * t;

        // Blend: original * (1-intensity) + gradient * intensity
        data[i] = Math.round(data[i] * (1 - intensity) + gr * intensity);
        data[i + 1] = Math.round(data[i + 1] * (1 - intensity) + gg * intensity);
        data[i + 2] = Math.round(data[i + 2] * (1 - intensity) + gb * intensity);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  const baseName = file.name.replace(/\.[^.]+$/, "");

  return {
    originalName: file.name,
    newName: `${baseName}-sky.jpg`,
    blob,
    width: w,
    height: h,
    originalSize: file.size,
    newSize: blob.size,
  };
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 135, g: 206, b: 235 };
}

export default function SkyReplacementPage() {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0, total: 0, currentFile: "", stage: "Processing sky",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);

  const [skyMode, setSkyMode] = useState<SkyMode>("brighten");
  const [threshold, setThreshold] = useState(50);
  const [intensity, setIntensity] = useState(60);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleProcess = async () => {
    setState("processing");
    const processed: ProcessedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({
        current: i + 1, total: files.length, currentFile: files[i].name, stage: "Processing sky",
      });
      const result = await processSky(files[i], { mode: skyMode, threshold, intensity });
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
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                Sky Replacement &amp; Brightener
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Fix overcast skies in your listing photos. Brighten dull skies or replace them with a clean blue gradient, golden hour, or bright day look.
              </p>
              <div className="mt-8">
                <PhotoDropzone onFiles={handleFiles} description="Upload exterior listing photos with visible sky" />
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
                {/* Sky Mode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sky Effect</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SKY_PRESETS.map((preset) => (
                      <button
                        key={preset.mode}
                        onClick={() => setSkyMode(preset.mode)}
                        className={`relative px-3 py-3 rounded-lg border text-sm font-medium transition-colors ${
                          skyMode === preset.mode
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-600 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-5 h-5 rounded-full border border-gray-200"
                            style={{
                              background: `linear-gradient(to bottom, ${preset.colors[0]}, ${preset.colors[1]})`,
                            }}
                          />
                          <span className="font-semibold text-xs">{preset.label}</span>
                        </div>
                        <span className="block text-[10px] text-gray-400">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Threshold */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">Sky Detection Sensitivity</label>
                    <span className="text-xs font-mono text-gray-500">{threshold}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-primary h-1.5"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>Less sky detected</span>
                    <span>More sky detected</span>
                  </div>
                </div>

                {/* Intensity */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">Effect Intensity</label>
                    <span className="text-xs font-mono text-gray-500">{intensity}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-primary h-1.5"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>Subtle</span>
                    <span>Full effect</span>
                  </div>
                </div>

                {/* MLS compliance note */}
                {skyMode !== "brighten" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                    <strong>MLS Note:</strong> Sky replacement may not be allowed in some MLS markets. &ldquo;Brighten Sky&rdquo; mode is the safest option for MLS-submitted photos. Check your local guidelines.
                  </div>
                )}

                <button
                  onClick={handleProcess}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg"
                >
                  Process {files.length} Photo{files.length !== 1 ? "s" : ""}
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
              Make Every Exterior Shot Pop — Even on Cloudy Days
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Overcast skies are the #1 complaint about DIY listing photos. A gray sky makes even a beautiful property look flat and uninviting. Professional photographers schedule shoots around weather — but agents don&apos;t always have that luxury. This tool detects the sky area in your photos and either brightens what&apos;s there or replaces it with a natural-looking gradient. The result: exterior photos that look like they were shot on a perfect day.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/photo-enhancer" className="text-primary font-semibold hover:underline">
              Want to fix interior brightness too? Try our Photo Enhancer &rarr;
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
