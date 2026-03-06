"use client";

import { useState, useCallback } from "react";
import { PhotoDropzone } from "@/components/PhotoDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FAQSection } from "@/components/FAQSection";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import type {
  ProcessingOptions,
  ProcessedImage,
  ProcessingProgress,
} from "@/lib/image-processing";
import { processImages } from "@/lib/image-processing";

type AppState = "upload" | "configure" | "processing" | "done";

const toolCategories = [
  {
    label: "Convert & Format",
    desc: "File format conversions for MLS compatibility",
    tools: [
      { name: "HEIC to JPG Converter", href: "/heic-to-jpg-converter", desc: "Convert iPhone HEIC photos to JPG instantly", icon: "ph:file-image" },
      { name: "WebP/PNG to JPG Converter", href: "/webp-png-to-jpg-converter", desc: "Convert WebP, PNG, AVIF to universal JPG", icon: "ph:swap" },
    ],
  },
  {
    label: "Resize & Crop",
    desc: "Dimension adjustments for MLS & listing platforms",
    tools: [
      { name: "MLS Photo Resizer", href: "/mls-photo-resizer", desc: "Format photos with hard-coded MLS standards", icon: "ph:house-line" },
      { name: "Zillow Photo Formatter", href: "/zillow-photo-formatter", desc: "Meet Zillow and Realtor.com photo requirements", icon: "ph:seal-check" },
      { name: "Online Image Resizer", href: "/online-image-resizer", desc: "Resize photos to any dimension", icon: "ph:resize" },
      { name: "Batch Aspect Ratio Cropper", href: "/batch-aspect-ratio-cropper", desc: "Crop to 4:3, 16:9, 1:1 for MLS & social", icon: "ph:crop" },
      { name: "Batch Image Compressor", href: "/batch-image-compressor", desc: "Compress photos under 5MB for MLS uploads", icon: "ph:file-arrow-down" },
    ],
  },
  {
    label: "Privacy & Cleanup",
    desc: "Metadata removal and privacy compliance",
    tools: [
      { name: "Remove EXIF Data", href: "/remove-exif-data", desc: "Strip GPS & metadata for privacy compliance", icon: "ph:shield-check" },
      { name: "Privacy Blur Tool", href: "/blur-photo-privacy-tool", desc: "Blur license plates, faces & sensitive items", icon: "ph:eye-slash" },
      { name: "Bulk Rename Photos", href: "/bulk-rename-photos", desc: "SEO-friendly naming like 123-Main-St-01.jpg", icon: "ph:text-aa" },
    ],
  },
  {
    label: "Brand & Market",
    desc: "Branding, social media, and marketing tools",
    tools: [
      { name: "Batch Watermark Photos", href: "/batch-watermark-photos", desc: "Add your logo or text watermark to listings", icon: "ph:drop-half-bottom" },
      { name: "Agent Branding Bar", href: "/agent-branding-bar", desc: "Add your name, phone & brokerage to photos", icon: "ph:identification-badge" },
      { name: "Agent Intro/Outro Card", href: "/agent-intro-card", desc: "Contact card for slideshows & video intros", icon: "ph:address-book" },
      { name: "Bulk QR Code on Photos", href: "/bulk-qr-code-photos", desc: "Add QR code to all listing photos in bulk", icon: "ph:qr-code" },
      { name: "Status Overlays", href: "/listing-status-overlays", desc: "Just Listed, Just Sold & more ribbons", icon: "ph:flag-pennant" },
      { name: "Photo Grid Maker", href: "/photo-grid-maker", desc: "Create 2x2 or 3x1 listing photo collages", icon: "ph:squares-four" },
      { name: "9:16 Social Formatter", href: "/social-media-photo-formatter", desc: "Vertical format for Stories, TikTok & Reels", icon: "ph:device-mobile" },
      { name: "Open House Flyer Maker", href: "/open-house-flyer-generator", desc: "Generate print-ready listing flyers", icon: "ph:newspaper-clipping" },
    ],
  },
];

const categoryIllustrations: Record<string, string> = {
  "Convert & Format": "/illustrations/category-convert.jpg",
  "Resize & Crop": "/illustrations/category-resize.jpg",
  "Privacy & Cleanup": "/illustrations/category-privacy.jpg",
  "Brand & Market": "/illustrations/category-brand.jpg",
};

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
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(800px,200vw)] h-[min(800px,200vw)] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
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
                <span className="bg-gradient-to-r from-primary to-primary-end bg-clip-text text-transparent">
                  for the MLS in Seconds.
                </span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Batch resize, compress, and watermark up to 50 real estate
                photos instantly. Runs completely in your browser for
                ultimate privacy.
              </p>
              <div className="mt-8 mb-10">
                <Image
                  src="/illustrations/hero-main.jpg"
                  alt="Real estate agent processing listing photos"
                  width={600}
                  height={338}
                  className="mx-auto rounded-2xl max-w-full h-auto"
                  priority
                />
              </div>
              <div className="mt-6">
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
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
                        <div className="flex flex-wrap gap-2 items-center text-sm">
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

              {/* Need something else? */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  Need something else?
                  <Icon
                    icon="ph:caret-down"
                    className={`w-4 h-4 transition-transform ${showToolsDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showToolsDropdown && (
                  <div className="mt-4 bg-white rounded-xl border border-border-light shadow-md p-4 text-left">
                    <div className="space-y-4">
                      {toolCategories.map((category) => (
                        <div key={category.label}>
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            {category.label}
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-1">
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-dark hover:bg-primary-light hover:text-primary rounded-lg transition-colors"
                              >
                                <Icon icon={tool.icon} className="w-4 h-4 text-primary flex-shrink-0" />
                                {tool.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                <Icon icon="ph:lightning" className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Lightning Fast</h3>
              <p className="text-gray-500">
                No waiting for huge files to upload to a server. Everything
                processes instantly on your device.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-success/5 to-transparent">
              <div className="w-14 h-14 mx-auto mb-4 bg-success/10 rounded-2xl flex items-center justify-center">
                <Icon icon="ph:seal-check" className="w-7 h-7 text-success" />
              </div>
              <h3 className="font-semibold text-xl mb-2">MLS Compliant</h3>
              <p className="text-gray-500">
                Never get a photo rejected by your MLS, Zillow, or Realtor.com
                again. Pre-built formatting presets.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Icon icon="ph:lock-key" className="w-7 h-7 text-primary" />
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

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-center mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-lg mx-auto">
            Three simple steps to MLS-ready listing photos.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-primary-light rounded-2xl p-4 mb-5">
                <Image
                  src="/illustrations/how-it-works-upload.jpg"
                  alt="Upload your photos"
                  width={400}
                  height={300}
                  className="rounded-xl mx-auto"
                />
              </div>
              <div className="w-9 h-9 mx-auto mb-3 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-1">Upload Photos</h3>
              <p className="text-gray-500 text-sm">
                Drag & drop up to 50 listing photos at once. Supports JPG, PNG, WebP, and HEIC.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-light rounded-2xl p-4 mb-5">
                <Image
                  src="/illustrations/how-it-works-configure.jpg"
                  alt="Configure your settings"
                  width={400}
                  height={300}
                  className="rounded-xl mx-auto"
                />
              </div>
              <div className="w-9 h-9 mx-auto mb-3 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-1">Configure</h3>
              <p className="text-gray-500 text-sm">
                Choose dimensions, compression, watermark, and rename options.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-light rounded-2xl p-4 mb-5">
                <Image
                  src="/illustrations/how-it-works-download.jpg"
                  alt="Download processed photos"
                  width={400}
                  height={300}
                  className="rounded-xl mx-auto"
                />
              </div>
              <div className="w-9 h-9 mx-auto mb-3 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-1">Download</h3>
              <p className="text-gray-500 text-sm">
                Get all your MLS-ready photos as a ZIP. Done in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-primary-end/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <Image
              src="/illustrations/trust-privacy.jpg"
              alt="Your photos never leave your device"
              width={600}
              height={338}
              className="rounded-2xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="font-heading font-bold text-2xl mb-4">
              Your Photos Never Leave Your Device
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Unlike other tools that upload your images to remote servers, MLS Photo Tools processes everything locally in your browser. Your unreleased listings, client photos, and sensitive property data stay 100% private.
            </p>
            <div className="flex items-center gap-2 text-sm text-success-dark font-medium">
              <Icon icon="ph:seal-check" className="w-5 h-5" />
              No uploads, no tracking, no data collection
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid - organized by category */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-3xl text-center mb-3">
            Free Real Estate Photo Tools
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            18 free tools, organized by workflow. Every tool runs in your
            browser and is designed for real estate professionals.
          </p>

          <div className="space-y-12">
            {toolCategories.map((category) => (
              <div key={category.label}>
                <div className="flex items-center gap-3 mb-4">
                  {categoryIllustrations[category.label] && (
                    <Image
                      src={categoryIllustrations[category.label]}
                      alt={category.label}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  )}
                  <h3 className="font-heading font-bold text-lg text-midnight">
                    {category.label}
                  </h3>
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {category.desc}
                  </span>
                  <div className="flex-1 h-px bg-border-light hidden sm:block" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="bg-white rounded-xl border border-border-light p-4 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group flex items-start gap-3"
                    >
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                        <Icon icon={tool.icon} className="w-4.5 h-4.5 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-0.5">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-gray-500">{tool.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
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
