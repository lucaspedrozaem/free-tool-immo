"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

export default function BatchImageCompressorPage() {
  const [maxSizeMB, setMaxSizeMB] = useState(5);
  const [quality, setQuality] = useState(0.85);
  const [stripExif, setStripExif] = useState(true);

  return (
    <ToolPageLayout
      illustration="/illustrations/tool-compressor.jpg"
      title="Compress Real Estate Photos in Bulk"
      subtitle="Reduce listing photo file sizes to meet MLS upload limits - without visible quality loss."
      description="Our free batch image compressor is built for real estate professionals who need to quickly reduce photo file sizes for MLS, Zillow, Realtor.com, and other listing platforms. All compression happens locally in your browser - your photos are never uploaded to any server, keeping unreleased listings completely private."
      whyTitle="Stop Getting MLS Photo Rejections Due to File Size"
      whyContent="Most MLS systems enforce strict file size limits - typically 5MB or less per photo. High-resolution DSLR and drone photos regularly exceed these limits, forcing agents to manually compress each image one by one. Our batch compressor lets you drag in an entire shoot and compress every photo to your target size in seconds, so you can get listings live faster without the tedious back-and-forth of rejected uploads."
      howTitle="How to Compress Your Listing Photos"
      howSteps={[
        "Upload your listing photos by dragging them into the dropzone or clicking to browse.",
        "Set your target file size, quality level, and whether to strip EXIF metadata.",
        "Click Compress and download all your optimized photos - ready for MLS upload.",
      ]}
      internalLink={{
        text: "Need to resize photos to specific MLS dimensions? Try our MLS Photo Resizer",
        href: "/mls-photo-resizer",
      }}
      faqItems={[
        {
          question: "What quality setting should I use for listing photos?",
          answer:
            "For most MLS uploads, a quality of 0.80-0.90 provides an excellent balance between file size and visual quality. At 0.85 (the default), compression artifacts are virtually invisible in listing photos. Only drop below 0.70 if you need extremely small files.",
        },
        {
          question: "How does the compression work?",
          answer:
            "Our compressor re-encodes your photos as optimized JPEGs using your browser's built-in canvas API. It iteratively adjusts quality to hit your target file size while preserving as much visual detail as possible. No data is sent to any server - everything runs locally on your device.",
        },
        {
          question: "What is the maximum file size for MLS photo uploads?",
          answer:
            "Most MLS systems cap individual photo uploads at 5MB, though some allow up to 10MB. Zillow and Realtor.com typically accept up to 20MB but recommend keeping photos under 5MB for faster load times. Our default 5MB target works for virtually all platforms.",
        },
      ]}
      renderConfig={(files, onProcess) => {
        const handleCompress = () => {
          const options: ProcessingOptions = {
            compress: { maxSizeMB: maxSizeMB, quality },
            stripExif,
            format: "jpeg",
          };
          onProcess(options);
        };

        return (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            {/* Target File Size */}
            <div>
              <label className="block font-semibold text-slate-dark mb-2">
                Target File Size
              </label>
              <select
                value={maxSizeMB}
                onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                className="w-full border border-border rounded px-3 py-2 text-sm"
              >
                <option value={1}>1 MB</option>
                <option value={2}>2 MB</option>
                <option value={3}>3 MB</option>
                <option value={5}>5 MB</option>
                <option value={10}>10 MB</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Photos already under this size will be left unchanged.
              </p>
            </div>

            {/* Quality Slider */}
            <div>
              <label className="block font-semibold text-slate-dark mb-2">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>

            {/* Strip EXIF Toggle */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-dark">
                    Strip EXIF Data
                  </span>
                  <p className="text-sm text-gray-500">
                    Remove GPS, camera info, and other metadata for privacy
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

            {/* Compress Button */}
            <button
              onClick={handleCompress}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-4 px-8 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
              Compress {files.length} Photo{files.length !== 1 ? "s" : ""}
            </button>
          </div>
        );
      }}
    />
  );
}
