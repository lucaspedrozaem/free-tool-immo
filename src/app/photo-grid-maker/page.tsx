"use client";

import { useState, useRef, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";

type GridLayout = "2x2" | "2x1" | "1x2" | "3x1" | "1x3";

const GRID_CONFIGS: Record<GridLayout, { cols: number; rows: number; count: number }> = {
  "2x2": { cols: 2, rows: 2, count: 4 },
  "2x1": { cols: 2, rows: 1, count: 2 },
  "1x2": { cols: 1, rows: 2, count: 2 },
  "3x1": { cols: 3, rows: 1, count: 3 },
  "1x3": { cols: 1, rows: 3, count: 3 },
};

const faqItems = [
  {
    question: "What grid layouts are available?",
    answer:
      "We offer 5 clean grid layouts: 2x2 (4 photos), 2x1 (2 side-by-side), 1x2 (2 stacked), 3x1 (3 side-by-side), and 1x3 (3 stacked). All grids use clean white borders for a professional look.",
  },
  {
    question: "What's the best grid for a listing teaser?",
    answer:
      "The 2x2 grid is the most popular for listing teasers — it lets you showcase the exterior, kitchen, bathroom, and a key feature room in a single image. The 3x1 horizontal strip is great for Facebook posts and email headers.",
  },
  {
    question: "Can I adjust the border width?",
    answer:
      "Yes! Use the gap slider to adjust the white border between photos from 0px (no border) to 20px. Most agents prefer 4-8px for a clean, professional look.",
  },
  {
    question: "What resolution is the output?",
    answer:
      "The output resolution depends on your source photos. Each cell preserves the original photo quality. A 2x2 grid of 1920x1080 photos will produce a 3840+ pixel wide image — perfect for high-resolution displays and print.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All grid assembly happens in your browser using HTML5 Canvas. Your listing photos never leave your device.",
  },
];

export default function PhotoGridMakerPage() {
  const [layout, setLayout] = useState<GridLayout>("2x2");
  const [gap, setGap] = useState(6);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const config = GRID_CONFIGS[layout];

  useEffect(() => {
    const newImages = new Array(config.count).fill(null);
    const newPreviews = new Array(config.count).fill(null);
    for (let i = 0; i < Math.min(images.length, config.count); i++) {
      newImages[i] = images[i];
      newPreviews[i] = previews[i];
    }
    setImages(newImages);
    setPreviews(newPreviews);
    setResultUrl(null);
    setResultBlob(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  const handleImageSelect = (index: number, file: File) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    setPreviews((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!);
      next[index] = url;
      return next;
    });
    setResultUrl(null);
    setResultBlob(null);
  };

  const allFilled = images.slice(0, config.count).every((img) => img !== null);

  const handleGenerate = async () => {
    if (!allFilled) return;

    const bitmaps = await Promise.all(
      images.slice(0, config.count).map((file) => createImageBitmap(file!))
    );

    const cellW = 800;
    const cellH = 600;
    const totalW = config.cols * cellW + (config.cols - 1) * gap;
    const totalH = config.rows * cellH + (config.rows - 1) * gap;

    const canvas = new OffscreenCanvas(totalW, totalH);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, totalW, totalH);

    let idx = 0;
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (idx >= bitmaps.length) break;
        const bm = bitmaps[idx];
        const x = c * (cellW + gap);
        const y = r * (cellH + gap);

        // Cover-fit: center crop
        const srcRatio = bm.width / bm.height;
        const cellRatio = cellW / cellH;
        let sx = 0, sy = 0, sw = bm.width, sh = bm.height;
        if (srcRatio > cellRatio) {
          sw = Math.round(bm.height * cellRatio);
          sx = Math.round((bm.width - sw) / 2);
        } else {
          sh = Math.round(bm.width / cellRatio);
          sy = Math.round((bm.height - sh) / 2);
        }

        ctx.drawImage(bm, sx, sy, sw, sh, x, y, cellW, cellH);
        bm.close();
        idx++;
      }
    }

    const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(blob);
    setResultUrl(URL.createObjectURL(blob));
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "listing-photo-grid.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    previews.forEach((p) => p && URL.revokeObjectURL(p));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImages(new Array(config.count).fill(null));
    setPreviews(new Array(config.count).fill(null));
    setResultUrl(null);
    setResultBlob(null);
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
              Listing Photo Grid Maker
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Create clean, professional photo grids for your listings. Perfect for social media teasers, MLS hero images, and marketing materials.
            </p>
          </div>

          {/* Layout Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Grid Layout
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(GRID_CONFIGS) as GridLayout[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    layout === l
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 text-gray-600 hover:border-primary/40"
                  }`}
                >
                  {l} ({GRID_CONFIGS[l].count} photos)
                </button>
              ))}
            </div>
          </div>

          {/* Gap Slider */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Border Gap: {gap}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={gap}
              onChange={(e) => {
                setGap(Number(e.target.value));
                setResultUrl(null);
              }}
              className="w-full max-w-xs accent-primary"
            />
          </div>

          {/* Drop Zones Grid */}
          <div
            className="grid gap-3 mb-8"
            style={{
              gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
              gridTemplateRows: `repeat(${config.rows}, 1fr)`,
            }}
          >
            {Array.from({ length: config.count }).map((_, i) => (
              <div
                key={i}
                onClick={() => fileInputRefs.current[i]?.click()}
                className="relative aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors bg-gray-50 flex items-center justify-center"
              >
                {previews[i] ? (
                  <img
                    src={previews[i]!}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <p className="text-sm text-gray-500">Photo {i + 1}</p>
                  </div>
                )}
                <input
                  ref={(el) => { fileInputRefs.current[i] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelect(i, file);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!resultUrl ? (
              <button
                onClick={handleGenerate}
                disabled={!allFilled}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {allFilled
                  ? "Generate Grid"
                  : `Add ${config.count - images.filter(Boolean).length} More Photo${config.count - images.filter(Boolean).length !== 1 ? "s" : ""}`}
              </button>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 bg-success text-white font-bold rounded-lg hover:bg-success-dark transition-colors text-lg"
                >
                  Download Grid
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Start Over
                </button>
              </>
            )}
          </div>

          {/* Result Preview */}
          {resultUrl && (
            <div className="mt-8 rounded-xl overflow-hidden border border-border-light shadow-lg">
              <img src={resultUrl} alt="Generated photo grid" className="w-full" />
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Why Use a Photo Grid for Listings?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A well-designed photo grid lets potential buyers see the highlights of a property at a glance. Instead of scrolling through dozens of photos, a single grid image showcases the best rooms — exterior, kitchen, bathroom, and a key living area. Photo grids are perfect for Instagram posts, Facebook ads, email campaigns, and MLS teaser images that grab attention and generate inquiries.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link
              href="/social-media-photo-formatter"
              className="text-primary font-semibold hover:underline"
            >
              Need vertical photos for Instagram Stories? Try our 9:16 Social Canvas Formatter &rarr;
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
