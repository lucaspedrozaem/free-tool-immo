"use client";

import { useState, useCallback, useRef } from "react";
import { FAQSection } from "@/components/FAQSection";
import { Icon } from "@iconify/react";
import Link from "next/link";
import type { ProcessedImage } from "@/lib/image-processing";
import { downloadAsZip } from "@/lib/image-processing";

interface PhotoItem {
  file: File;
  id: string;
  previewUrl: string;
}

const faqItems = [
  {
    question: "Why does photo order matter for MLS?",
    answer:
      "The first photo is the hero image buyers see in search results. Studies show listings with a strong exterior lead photo get 50%+ more clicks. After that, the sequence should tell a story: exterior → entryway → living areas → kitchen → bedrooms → bathrooms → backyard.",
  },
  {
    question: "How do I reorder photos?",
    answer:
      "Simply drag any photo and drop it into its new position. The numbered badges update automatically. When you're happy with the order, click Download to get a ZIP with files renamed in sequence.",
  },
  {
    question: "What naming format is used?",
    answer:
      "Files are named with your chosen prefix followed by a two-digit sequence number, e.g., 123-Main-St-01.jpg, 123-Main-St-02.jpg, etc. This ensures they sort correctly when uploaded to any MLS system.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All reordering and renaming happens locally in your browser. Your listing photos never leave your device.",
  },
];

export default function ListingPhotoReorderPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [prefix, setPrefix] = useState("listing");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    const items: PhotoItem[] = Array.from(fileList).map((file, i) => ({
      file,
      id: `${file.name}-${i}-${Date.now()}`,
      previewUrl: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...items]);
  }, []);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    setPhotos((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, moved);
      return updated;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleRemove = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDownload = async () => {
    if (photos.length === 0) return;
    setDownloading(true);

    const processed: ProcessedImage[] = await Promise.all(
      photos.map(async (photo, i) => {
        const num = String(i + 1).padStart(2, "0");
        const ext = photo.file.name.match(/\.[^.]+$/)?.[0] || ".jpg";
        const blob = new Blob([await photo.file.arrayBuffer()], { type: photo.file.type });
        return {
          originalName: photo.file.name,
          newName: `${prefix}-${num}${ext}`,
          blob,
          width: 0,
          height: 0,
          originalSize: photo.file.size,
          newSize: photo.file.size,
        };
      })
    );

    await downloadAsZip(processed, `${prefix}-photos`);
    setDownloading(false);
  };

  const handleReset = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPhotos([]);
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
              Listing Photo Reorder
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Drag and drop to set the perfect photo sequence for your MLS listing. Rename in order, download as ZIP.
            </p>
          </div>

          {/* Upload area */}
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
            {photos.length === 0 ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-primary/50 transition-colors group"
              >
                <Icon icon="ph:cloud-arrow-up" className="w-12 h-12 mx-auto text-gray-300 group-hover:text-primary transition-colors" />
                <p className="mt-3 text-gray-500 group-hover:text-primary font-medium">
                  Click to upload listing photos
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG, WebP, HEIC · up to 50 photos
                </p>
              </button>
            ) : (
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-xl">
                  {photos.length} Photo{photos.length !== 1 ? "s" : ""} — Drag to Reorder
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    + Add More
                  </button>
                  <button onClick={handleReset} className="text-sm text-gray-500 hover:text-primary">
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Photo grid */}
          {photos.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                      dragOverIndex === index
                        ? "border-primary scale-105 shadow-lg"
                        : dragIndex === index
                          ? "border-primary/40 opacity-50"
                          : "border-gray-200 hover:border-primary/30"
                    }`}
                  >
                    <img
                      src={photo.previewUrl}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover"
                      draggable={false}
                    />
                    {/* Sequence badge */}
                    <div className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-primary text-white" : "bg-black/60 text-white"
                    }`}>
                      {index + 1}
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(index)}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                    >
                      ×
                    </button>
                    {/* Filename */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-0.5">
                      <p className="text-[10px] text-white truncate">{photo.file.name}</p>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-1.5 left-9 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        HERO
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Naming prefix */}
              <div className="bg-white rounded-xl shadow-md p-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      File Name Prefix
                    </label>
                    <input
                      type="text"
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value.replace(/[^a-zA-Z0-9-_]/g, "-"))}
                      placeholder="123-Main-St"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-400 pt-5">
                    Preview: <span className="font-mono text-gray-600">{prefix}-01.jpg</span>
                  </div>
                </div>
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-60"
              >
                {downloading ? "Preparing ZIP..." : `Download ${photos.length} Photos as ZIP`}
              </button>
            </>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Get Your Listing Photo Sequence Right the First Time
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The order of your listing photos matters more than most agents realize. The hero image (photo #1) is what appears in MLS search results, Zillow, and Realtor.com — it determines whether a buyer clicks through or scrolls past. After the hero shot, photos should flow naturally: exterior → entryway → main living areas → kitchen → bedrooms → bathrooms → backyard. This tool lets you visually arrange your photos in the perfect order, then downloads them as a sequentially-named ZIP ready for MLS upload.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/bulk-rename-photos" className="text-primary font-semibold hover:underline">
              Need custom naming patterns? Try our Bulk Rename Photos tool &rarr;
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
