"use client";

import { useState, useRef, useCallback } from "react";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
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
      "The 2x2 grid is the most popular for listing teasers - it lets you showcase the exterior, kitchen, bathroom, and a key feature room in a single image. The 3x1 horizontal strip is great for Facebook posts and email headers.",
  },
  {
    question: "Can I adjust the border width?",
    answer:
      "Yes! Use the gap slider to adjust the white border between photos from 0px (no border) to 20px. Most agents prefer 4-8px for a clean, professional look.",
  },
  {
    question: "Can I reorder photos after uploading?",
    answer:
      "Yes! Simply drag and drop photos to rearrange them in the grid. Upload all your photos at once, then drag them into your preferred order.",
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
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  const config = GRID_CONFIGS[layout];

  const handleBulkUpload = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const newEntries = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newEntries]);
    setResultUrl(null);
    setResultBlob(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleBulkUpload(e.dataTransfer.files);
      }
    },
    [handleBulkUpload]
  );

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
    setResultUrl(null);
  };

  // Drag-and-drop reorder
  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndexRef.current === null || dragIndexRef.current === index) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndexRef.current!, 1);
      next.splice(index, 0, moved);
      dragIndexRef.current = index;
      return next;
    });
    setResultUrl(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
  };

  const usedImages = images.slice(0, config.count);
  const allFilled = usedImages.length >= config.count;

  const handleGenerate = async () => {
    if (!allFilled) return;

    const bitmaps = await Promise.all(
      usedImages.map((entry) => createImageBitmap(entry.file))
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
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImages([]);
    setResultUrl(null);
    setResultBlob(null);
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-center mb-6">
                <Image
                  src="/illustrations/tool-photo-grid.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
              Listing Photo Grid Maker
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Create clean, professional photo grids for your listings. Upload all photos at once, drag to reorder, then generate.
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
                  onClick={() => {
                    setLayout(l);
                    setResultUrl(null);
                  }}
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
          <div className="mb-6">
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

          {/* Upload Zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6 text-center cursor-pointer hover:border-primary transition-colors bg-gray-50/50"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Icon icon="heroicons:plus" className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600">
              Click or drag & drop to upload photos
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Upload all photos at once - reorder below by dragging
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleBulkUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Photo Strip - drag to reorder */}
          {images.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">
                  {images.length} photo{images.length !== 1 ? "s" : ""} uploaded
                  {images.length > config.count && (
                    <span className="text-gray-400 font-normal"> - first {config.count} will be used</span>
                  )}
                </p>
                <button onClick={handleReset} className="text-xs text-gray-400 hover:text-red-500">
                  Clear All
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <div
                    key={img.preview}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragEnd={handleDragEnd}
                    className={`relative flex-shrink-0 w-24 h-18 rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                      i < config.count ? "border-primary/40" : "border-gray-200 opacity-50"
                    }`}
                  >
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-0.5 left-1 bg-black/60 text-white text-[10px] font-bold px-1 rounded">
                      {i + 1}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center hover:bg-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid Preview */}
          {usedImages.length > 0 && (
            <div
              className="grid gap-1 mb-8 max-w-2xl mx-auto"
              style={{
                gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                gap: `${Math.max(2, gap / 2)}px`,
              }}
            >
              {Array.from({ length: config.count }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-md overflow-hidden bg-gray-100"
                >
                  {usedImages[i] ? (
                    <img
                      src={usedImages[i].preview}
                      alt={`Slot ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                      {i + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

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
                  : `Add ${config.count - usedImages.length} More Photo${config.count - usedImages.length !== 1 ? "s" : ""}`}
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
                  onClick={() => {
                    setResultUrl(null);
                    setResultBlob(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
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
              A well-designed photo grid lets potential buyers see the highlights of a property at a glance. Instead of scrolling through dozens of photos, a single grid image showcases the best rooms - exterior, kitchen, bathroom, and a key living area. Photo grids are perfect for Instagram posts, Facebook ads, email campaigns, and MLS teaser images that grab attention and generate inquiries.
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
