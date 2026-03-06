"use client";

import { useState, useRef } from "react";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import type { ProcessedImage } from "@/lib/image-processing";
import { downloadSingleImage } from "@/lib/image-processing";

type LayoutStyle = "side-by-side" | "top-bottom" | "split";

const faqItems = [
  {
    question: "What layout options are available?",
    answer:
      "Three layouts: Side-by-Side (before on left, after on right), Top & Bottom (before on top, after on bottom), and Diagonal Split (single image split diagonally). Side-by-Side is the most popular for social media.",
  },
  {
    question: "What can I use before/after comparisons for?",
    answer:
      "Renovation showcases, virtual staging comparisons, seasonal changes, photo enhancement results, landscaping improvements, decluttering results, and any property transformation. They are powerful for social media marketing.",
  },
  {
    question: "What size is the output?",
    answer:
      "The output maintains the resolution of your uploaded photos. For side-by-side, the width doubles. For top-bottom, the height doubles. For diagonal split, it matches the original dimensions.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. The comparison image is generated entirely in your browser using HTML5 Canvas. Your photos never leave your device.",
  },
];

async function createComparison(
  beforeFile: File,
  afterFile: File,
  layout: LayoutStyle,
  labelColor: string,
  showLabels: boolean
): Promise<ProcessedImage> {
  const beforeBm = await createImageBitmap(beforeFile);
  const afterBm = await createImageBitmap(afterFile);

  // Use the larger dimensions as reference
  const refW = Math.max(beforeBm.width, afterBm.width);
  const refH = Math.max(beforeBm.height, afterBm.height);

  let canvasW: number;
  let canvasH: number;

  if (layout === "side-by-side") {
    canvasW = refW * 2 + 4; // 4px divider
    canvasH = refH;
  } else if (layout === "top-bottom") {
    canvasW = refW;
    canvasH = refH * 2 + 4;
  } else {
    // split - same dimensions
    canvasW = refW;
    canvasH = refH;
  }

  const canvas = new OffscreenCanvas(canvasW, canvasH);
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#1E293B";
  ctx.fillRect(0, 0, canvasW, canvasH);

  if (layout === "side-by-side") {
    // Before on left
    const halfW = Math.floor((canvasW - 4) / 2);
    drawCoverFit(ctx, beforeBm, 0, 0, halfW, canvasH);
    // Divider
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(halfW, 0, 4, canvasH);
    // After on right
    drawCoverFit(ctx, afterBm, halfW + 4, 0, halfW, canvasH);

    if (showLabels) {
      drawLabel(ctx, "BEFORE", halfW * 0.5, canvasH - 50, labelColor, canvasW);
      drawLabel(ctx, "AFTER", halfW + 4 + halfW * 0.5, canvasH - 50, labelColor, canvasW);
    }
  } else if (layout === "top-bottom") {
    const halfH = Math.floor((canvasH - 4) / 2);
    drawCoverFit(ctx, beforeBm, 0, 0, canvasW, halfH);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, halfH, canvasW, 4);
    drawCoverFit(ctx, afterBm, 0, halfH + 4, canvasW, halfH);

    if (showLabels) {
      drawLabel(ctx, "BEFORE", canvasW / 2, halfH - 30, labelColor, canvasW);
      drawLabel(ctx, "AFTER", canvasW / 2, canvasH - 30, labelColor, canvasW);
    }
  } else {
    // Diagonal split
    // Draw after as full background
    drawCoverFit(ctx, afterBm, 0, 0, canvasW, canvasH);
    // Clip left triangle for before
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasW * 0.6, 0);
    ctx.lineTo(canvasW * 0.4, canvasH);
    ctx.lineTo(0, canvasH);
    ctx.closePath();
    ctx.clip();
    drawCoverFit(ctx, beforeBm, 0, 0, canvasW, canvasH);
    ctx.restore();

    // Diagonal divider line
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvasW * 0.6, 0);
    ctx.lineTo(canvasW * 0.4, canvasH);
    ctx.stroke();

    if (showLabels) {
      drawLabel(ctx, "BEFORE", canvasW * 0.22, canvasH - 50, labelColor, canvasW);
      drawLabel(ctx, "AFTER", canvasW * 0.78, canvasH - 50, labelColor, canvasW);
    }
  }

  beforeBm.close();
  afterBm.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });

  return {
    originalName: beforeFile.name,
    newName: `before-after-${beforeFile.name.replace(/\.[^.]+$/, "")}.jpg`,
    blob,
    width: canvasW,
    height: canvasH,
    originalSize: beforeFile.size + afterFile.size,
    newSize: blob.size,
  };
}

function drawCoverFit(
  ctx: OffscreenCanvasRenderingContext2D,
  img: ImageBitmap,
  x: number, y: number, w: number, h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const srcW = Math.round(w / scale);
  const srcH = Math.round(h / scale);
  const srcX = Math.round((img.width - srcW) / 2);
  const srcY = Math.round((img.height - srcH) / 2);
  ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h);
}

function drawLabel(
  ctx: OffscreenCanvasRenderingContext2D,
  text: string, cx: number, cy: number, color: string, canvasW: number
) {
  const fontSize = Math.max(18, Math.round(canvasW * 0.025));
  ctx.font = `bold ${fontSize}px 'DM Sans', Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Background pill
  const metrics = ctx.measureText(text);
  const pw = metrics.width + fontSize * 1.2;
  const ph = fontSize * 1.8;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  const r = ph / 2;
  ctx.beginPath();
  ctx.moveTo(cx - pw / 2 + r, cy - ph / 2);
  ctx.lineTo(cx + pw / 2 - r, cy - ph / 2);
  ctx.arcTo(cx + pw / 2, cy - ph / 2, cx + pw / 2, cy, r);
  ctx.arcTo(cx + pw / 2, cy + ph / 2, cx + pw / 2 - r, cy + ph / 2, r);
  ctx.lineTo(cx - pw / 2 + r, cy + ph / 2);
  ctx.arcTo(cx - pw / 2, cy + ph / 2, cx - pw / 2, cy, r);
  ctx.arcTo(cx - pw / 2, cy - ph / 2, cx - pw / 2 + r, cy - ph / 2, r);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.fillText(text, cx, cy + 1);
}

export default function BeforeAfterPhotoPage() {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const [layout, setLayout] = useState<LayoutStyle>("side-by-side");
  const [labelColor, setLabelColor] = useState("#FFFFFF");
  const [showLabels, setShowLabels] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleBeforeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBeforeFile(file);
    setBeforePreview(URL.createObjectURL(file));
    setResult(null);
    setResultUrl(null);
  };

  const handleAfterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAfterFile(file);
    setAfterPreview(URL.createObjectURL(file));
    setResult(null);
    setResultUrl(null);
  };

  const handleGenerate = async () => {
    if (!beforeFile || !afterFile) return;
    setGenerating(true);
    const res = await createComparison(beforeFile, afterFile, layout, labelColor, showLabels);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResult(res);
    setResultUrl(URL.createObjectURL(res.blob));
    setGenerating(false);
  };

  const handleDownload = () => {
    if (!result) return;
    downloadSingleImage(result);
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
              Before &amp; After Photo Comparison
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Create stunning side-by-side, top-bottom, or diagonal split comparison images for renovations, staging, and property transformations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Upload + Options */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                  Upload Photos
                </h3>

                {/* Before photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Before Photo *</label>
                  <input ref={beforeRef} type="file" accept="image/*" onChange={handleBeforeUpload} className="hidden" />
                  {beforePreview ? (
                    <div className="flex items-center gap-3">
                      <img src={beforePreview} alt="Before" className="w-20 h-14 rounded-lg object-cover border border-gray-200" />
                      <div className="flex-1 text-xs text-gray-500 truncate">{beforeFile?.name}</div>
                      <button onClick={() => { setBeforeFile(null); setBeforePreview(null); setResult(null); setResultUrl(null); }} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                    </div>
                  ) : (
                    <button onClick={() => beforeRef.current?.click()} className="w-full border-2 border-dashed border-gray-200 rounded-lg py-4 text-sm text-gray-400 hover:border-primary/40 hover:text-primary transition-colors">
                      + Upload before photo
                    </button>
                  )}
                </div>

                {/* After photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">After Photo *</label>
                  <input ref={afterRef} type="file" accept="image/*" onChange={handleAfterUpload} className="hidden" />
                  {afterPreview ? (
                    <div className="flex items-center gap-3">
                      <img src={afterPreview} alt="After" className="w-20 h-14 rounded-lg object-cover border border-gray-200" />
                      <div className="flex-1 text-xs text-gray-500 truncate">{afterFile?.name}</div>
                      <button onClick={() => { setAfterFile(null); setAfterPreview(null); setResult(null); setResultUrl(null); }} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                    </div>
                  ) : (
                    <button onClick={() => afterRef.current?.click()} className="w-full border-2 border-dashed border-gray-200 rounded-lg py-4 text-sm text-gray-400 hover:border-primary/40 hover:text-primary transition-colors">
                      + Upload after photo
                    </button>
                  )}
                </div>
              </div>

              {/* Layout Options */}
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                  Layout
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { style: "side-by-side" as LayoutStyle, label: "Side by Side" },
                    { style: "top-bottom" as LayoutStyle, label: "Top & Bottom" },
                    { style: "split" as LayoutStyle, label: "Diagonal Split" },
                  ]).map(({ style, label }) => (
                    <button
                      key={style}
                      onClick={() => { setLayout(style); setResult(null); setResultUrl(null); }}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                        layout === style
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 text-gray-600 hover:border-primary/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showLabels}
                      onChange={(e) => { setShowLabels(e.target.checked); setResult(null); setResultUrl(null); }}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Show labels</span>
                  </label>
                  {showLabels && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Label color:</span>
                      <input
                        type="color"
                        value={labelColor}
                        onChange={(e) => { setLabelColor(e.target.value); setResult(null); setResultUrl(null); }}
                        className="w-7 h-7 rounded cursor-pointer border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">
                Preview
              </h3>
              {beforePreview && afterPreview ? (
                <div className="space-y-3">
                  {layout === "side-by-side" && (
                    <div className="flex gap-0.5 rounded-lg overflow-hidden border border-gray-200">
                      <div className="relative flex-1">
                        <img src={beforePreview} alt="Before" className="w-full h-40 object-cover" />
                        {showLabels && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: labelColor }}>BEFORE</span>}
                      </div>
                      <div className="w-0.5 bg-white flex-shrink-0" />
                      <div className="relative flex-1">
                        <img src={afterPreview} alt="After" className="w-full h-40 object-cover" />
                        {showLabels && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: labelColor }}>AFTER</span>}
                      </div>
                    </div>
                  )}
                  {layout === "top-bottom" && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <div className="relative">
                        <img src={beforePreview} alt="Before" className="w-full h-24 object-cover" />
                        {showLabels && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: labelColor }}>BEFORE</span>}
                      </div>
                      <div className="h-0.5 bg-white" />
                      <div className="relative">
                        <img src={afterPreview} alt="After" className="w-full h-24 object-cover" />
                        {showLabels && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: labelColor }}>AFTER</span>}
                      </div>
                    </div>
                  )}
                  {layout === "split" && (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 h-48">
                      <img src={afterPreview} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 60% 0, 40% 100%, 0 100%)" }}>
                        <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0" style={{
                        background: "linear-gradient(to bottom left, transparent calc(50% - 1px), white calc(50% - 1px), white calc(50% + 1px), transparent calc(50% + 1px))",
                        clipPath: "polygon(60% 0, 61% 0, 41% 100%, 40% 100%)"
                      }} />
                      {showLabels && (
                        <>
                          <span className="absolute bottom-2 left-[22%] -translate-x-1/2 bg-black/50 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: labelColor }}>BEFORE</span>
                          <span className="absolute bottom-2 left-[78%] -translate-x-1/2 bg-black/50 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: labelColor }}>AFTER</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-sm text-gray-400">
                  Upload both photos to see preview
                </div>
              )}
            </div>
          </div>

          {/* Generate */}
          <div className="mt-8">
            {!resultUrl ? (
              <button
                onClick={handleGenerate}
                disabled={!beforeFile || !afterFile || generating}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating ? "Generating..." : "Create Comparison"}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 bg-success text-white font-bold rounded-lg hover:bg-success-dark transition-colors text-base sm:text-lg"
                >
                  Download Comparison (JPG)
                </button>
                <button
                  onClick={() => { setResult(null); setResultUrl(null); }}
                  className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {resultUrl && (
            <div className="mt-8 rounded-xl overflow-hidden border border-border-light shadow-lg">
              <img src={resultUrl} alt="Before/After comparison" className="w-full" />
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Showcase Property Transformations That Sell
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Before and after comparisons are one of the most engaging types of real estate content on social media. Whether you&apos;re showing a renovation, virtual staging result, seasonal change, or a simple declutter - a side-by-side comparison tells the story instantly. This tool creates professional comparison images with customizable layouts, labels, and divider styles - ready to share on Instagram, Facebook, or your listing page.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/photo-enhancer" className="text-primary font-semibold hover:underline">
              Need to enhance your photos first? Try our Photo Enhancer &rarr;
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
