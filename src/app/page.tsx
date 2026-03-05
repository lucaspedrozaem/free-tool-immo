"use client";

import { useState, useCallback } from "react";
import { PhotoDropzone } from "@/components/PhotoDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import type {
  ProcessingOptions,
  ProcessedImage,
  ProcessingProgress,
} from "@/lib/image-processing";
import { processImages } from "@/lib/image-processing";

type AppState = "upload" | "configure" | "processing" | "done";

const tools = [
  {
    name: "HEIC to JPG Converter",
    href: "/heic-to-jpg-converter",
    desc: "Convert iPhone HEIC photos to JPG instantly",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    name: "Batch Image Compressor",
    href: "/batch-image-compressor",
    desc: "Compress photos under 5MB for MLS uploads",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    name: "Online Image Resizer",
    href: "/online-image-resizer",
    desc: "Resize photos to any dimension",
    icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
  },
  {
    name: "Batch Watermark Photos",
    href: "/batch-watermark-photos",
    desc: "Add your logo or text watermark to listings",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    name: "MLS Photo Resizer",
    href: "/mls-photo-resizer",
    desc: "Format photos with hard-coded MLS standards",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Remove EXIF Data",
    href: "/remove-exif-data",
    desc: "Strip GPS & metadata for privacy compliance",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    name: "Zillow Photo Formatter",
    href: "/zillow-photo-formatter",
    desc: "Meet Zillow and Realtor.com photo requirements",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    name: "Bulk Rename Photos",
    href: "/bulk-rename-photos",
    desc: "SEO-friendly naming like 123-Main-St-01.jpg",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
];

const faqItems = [
  {
    question: "What is the best photo size for the MLS?",
    answer:
      "Most MLS systems accept photos at 1920x1080 pixels (16:9) or 2048x1536 (4:3) with a maximum file size of 5MB. Our MLS Photo Resizer tool automatically formats your images to meet these requirements.",
  },
  {
    question: "Does this work on Mac and Windows?",
    answer:
      "Yes! MLS Photo Tools runs entirely in your web browser, so it works on any operating system including Mac, Windows, Linux, Chromebooks, and even tablets. No software to install.",
  },
  {
    question: "Is it really 100% free?",
    answer:
      "Yes, completely free with no hidden costs, no watermarks, no sign-up required, and no limits on usage. All processing happens directly in your browser, which means our server costs are minimal.",
  },
  {
    question: "Are my listing photos private and secure?",
    answer:
      "Absolutely. Your photos never leave your computer. All processing happens locally in your browser using client-side JavaScript. We never upload, store, or even see your images. This is especially important for unreleased listings.",
  },
  {
    question:
      "Does resizing and compressing comply with California's 2025 digital alteration law?",
    answer:
      "Yes. Utility edits like resizing, compressing, and stripping metadata do not alter the appearance of the property and are not considered digital alterations under California's disclosure requirements. These are standard formatting operations required by every MLS system.",
  },
];

export default function HomePage() {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0,
    total: 0,
    currentFile: "",
    stage: "Processing",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);

  // Config state
  const [optimizeMLS, setOptimizeMLS] = useState(true);
  const [resizeWidth, setResizeWidth] = useState(1920);
  const [resizeHeight, setResizeHeight] = useState(1080);
  const [compressBelow, setCompressBelow] = useState(5);
  const [stripExif, setStripExif] = useState(true);
  const [batchRename, setBatchRename] = useState(false);
  const [renamePrefix, setRenamePrefix] = useState("");
  const [addWatermark, setAddWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkPosition, setWatermarkPosition] = useState<
    "bottom-right" | "bottom-left" | "center" | "top-right"
  >("bottom-right");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleProcess = async () => {
    setState("processing");

    const options: ProcessingOptions = {
      format: "jpeg",
    };

    if (optimizeMLS) {
      options.resize = {
        width: resizeWidth,
        height: resizeHeight,
        maintainAspect: true,
      };
      options.compress = { maxSizeMB: compressBelow, quality: 0.92 };
    }

    if (stripExif) {
      options.stripExif = true;
    }

    if (batchRename && renamePrefix) {
      options.rename = { prefix: renamePrefix, startIndex: 1 };
    }

    if (addWatermark && watermarkText) {
      options.watermark = {
        text: watermarkText,
        position: watermarkPosition,
        opacity: watermarkOpacity,
      };
    }

    try {
      const processed = await processImages(files, options, setProgress);
      setResults(processed);
      setState("done");
    } catch (err) {
      console.error("Processing error:", err);
      setState("configure");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setState("upload");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          {state === "upload" && (
            <>
              <div className="inline-flex items-center gap-2 bg-white border border-border-light rounded-full px-4 py-1.5 text-sm text-slate-dark mb-6 shadow-sm">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                100% Free &middot; No Sign-up &middot; Browser-Based
              </div>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-midnight leading-tight">
                Format Listing Photos
                <br />
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  for the MLS in Seconds.
                </span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Batch resize, compress, and watermark up to 50 real estate
                photos instantly. Runs completely in your browser for
                ultimate privacy.
              </p>
              <div className="mt-10">
                <PhotoDropzone onFiles={handleFiles} />
              </div>
            </>
          )}

          {state === "configure" && (
            <div className="text-left">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-2xl">
                  Listing Prep Dashboard
                </h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-primary"
                >
                  Start Over
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Thumbnails */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">
                    {files.length} Photo{files.length !== 1 ? "s" : ""} Selected
                  </h3>
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden relative"
                      >
                        {f.type.startsWith("image/") &&
                        !f.name.toLowerCase().endsWith(".heic") ? (
                          <img
                            src={URL.createObjectURL(f)}
                            alt={f.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            {f.name
                              .split(".")
                              .pop()
                              ?.toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configuration Panel */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                  {/* MLS Optimization */}
                  <div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-semibold text-slate-dark">
                          Optimize for MLS / Zillow
                        </span>
                        <p className="text-sm text-gray-500">
                          Resize and compress for MLS upload
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={optimizeMLS}
                        onChange={(e) => setOptimizeMLS(e.target.checked)}
                        className="w-5 h-5 accent-primary"
                      />
                    </label>
                    {optimizeMLS && (
                      <div className="mt-3 pl-4 border-l-2 border-primary-light space-y-2">
                        <div className="flex gap-2 items-center text-sm">
                          <span className="text-gray-500">Resize to</span>
                          <input
                            type="number"
                            value={resizeWidth}
                            onChange={(e) =>
                              setResizeWidth(Number(e.target.value))
                            }
                            className="w-20 border border-border rounded px-2 py-1 text-sm"
                          />
                          <span className="text-gray-400">x</span>
                          <input
                            type="number"
                            value={resizeHeight}
                            onChange={(e) =>
                              setResizeHeight(Number(e.target.value))
                            }
                            className="w-20 border border-border rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div className="flex gap-2 items-center text-sm">
                          <span className="text-gray-500">
                            Compress below
                          </span>
                          <select
                            value={compressBelow}
                            onChange={(e) =>
                              setCompressBelow(Number(e.target.value))
                            }
                            className="border border-border rounded px-2 py-1 text-sm"
                          >
                            <option value={2}>2 MB</option>
                            <option value={3}>3 MB</option>
                            <option value={5}>5 MB</option>
                            <option value={10}>10 MB</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Privacy */}
                  <div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-semibold text-slate-dark">
                          Strip GPS / EXIF Data
                        </span>
                        <p className="text-sm text-gray-500">
                          Protects seller/tenant privacy
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={stripExif}
                        onChange={(e) => setStripExif(e.target.checked)}
                        className="w-5 h-5 accent-primary"
                      />
                    </label>
                  </div>

                  {/* Batch Rename */}
                  <div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-semibold text-slate-dark">
                          Batch Rename for SEO
                        </span>
                        <p className="text-sm text-gray-500">
                          e.g. 123-Main-St-01.jpg
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={batchRename}
                        onChange={(e) => setBatchRename(e.target.checked)}
                        className="w-5 h-5 accent-primary"
                      />
                    </label>
                    {batchRename && (
                      <div className="mt-3 pl-4 border-l-2 border-primary-light">
                        <input
                          type="text"
                          placeholder="Type property address..."
                          value={renamePrefix}
                          onChange={(e) => setRenamePrefix(e.target.value)}
                          className="w-full border border-border rounded px-3 py-2 text-sm"
                        />
                        {renamePrefix && (
                          <p className="text-xs text-gray-400 mt-1">
                            Preview:{" "}
                            {renamePrefix.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}
                            -01.jpg
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Watermark */}
                  <div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-semibold text-slate-dark">
                          Add Watermark
                        </span>
                        <p className="text-sm text-gray-500">
                          Text watermark on all photos
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={addWatermark}
                        onChange={(e) => setAddWatermark(e.target.checked)}
                        className="w-5 h-5 accent-primary"
                      />
                    </label>
                    {addWatermark && (
                      <div className="mt-3 pl-4 border-l-2 border-primary-light space-y-2">
                        <input
                          type="text"
                          placeholder="Watermark text (e.g. © Your Agency)"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full border border-border rounded px-3 py-2 text-sm"
                        />
                        <div className="flex gap-2 items-center text-sm">
                          <span className="text-gray-500">Position</span>
                          <select
                            value={watermarkPosition}
                            onChange={(e) =>
                              setWatermarkPosition(
                                e.target.value as ProcessingOptions["watermark"] extends undefined ? never : NonNullable<ProcessingOptions["watermark"]>["position"]
                              )
                            }
                            className="border border-border rounded px-2 py-1 text-sm"
                          >
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="center">Center</option>
                            <option value="top-right">Top Right</option>
                          </select>
                        </div>
                        <div className="flex gap-2 items-center text-sm">
                          <span className="text-gray-500">Opacity</span>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={watermarkOpacity}
                            onChange={(e) =>
                              setWatermarkOpacity(Number(e.target.value))
                            }
                            className="flex-1 accent-primary"
                          />
                          <span className="text-xs text-gray-400 w-8">
                            {Math.round(watermarkOpacity * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Process Button */}
              <div className="mt-6">
                <button
                  onClick={handleProcess}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-4 px-8 rounded-md transition-colors shadow-md hover:shadow-lg"
                >
                  Process {files.length} Photo{files.length !== 1 ? "s" : ""}{" "}
                  Now
                </button>
              </div>
            </div>
          )}

          {state === "processing" && <ProgressBar progress={progress} />}

          {state === "done" && (
            <ResultsPanel
              images={results}
              onReset={handleReset}
              zipName={
                renamePrefix
                  ? renamePrefix.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")
                  : "listing-photos"
              }
            />
          )}
        </div>
      </section>

      {/* Below the fold: Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-center mb-3">
            Why Real Estate Pros Use Us
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-lg mx-auto">
            Trusted by agents, photographers, and brokerages nationwide.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-2">Lightning Fast</h3>
              <p className="text-gray-500">
                No waiting for huge files to upload to a server. Everything
                processes instantly on your device.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-success/5 to-transparent">
              <div className="w-14 h-14 mx-auto mb-4 bg-success/10 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-2">MLS Compliant</h3>
              <p className="text-gray-500">
                Never get a photo rejected by your MLS, Zillow, or Realtor.com
                again. Pre-built formatting presets.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-2">100% Private</h3>
              <p className="text-gray-500">
                We never see your photos. Everything runs in your browser. Your
                unreleased listings stay confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-center mb-3">
            Free Real Estate Photo Tools
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Every tool is 100% free, runs in your browser, and is designed
            specifically for real estate professionals.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white rounded-xl border border-border-light p-5 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5 text-primary group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={tool.icon}
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
                <p className="text-xs text-gray-500">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-center mb-12">
            Frequently Asked Questions
          </h2>
          <FAQSection items={faqItems} />
        </div>
      </section>
    </>
  );
}
