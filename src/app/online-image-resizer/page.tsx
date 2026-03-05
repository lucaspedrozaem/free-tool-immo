"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

export default function OnlineImageResizerPage() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState(0.92);

  return (
    <ToolPageLayout
      illustration="/illustrations/tool-image-resizer.jpg"
      title="Resize Photos to Any Dimension"
      subtitle="Batch resize images to exact pixel dimensions - perfect for web, social media, and listing platforms."
      description="Our free online image resizer lets you batch resize photos to any custom dimension. Whether you need MLS-compliant 1920x1080 photos, social media graphics, or web-optimized images, simply set your target dimensions and download perfectly sized photos in seconds. All processing happens in your browser - no uploads, no sign-ups, no limits."
      whyTitle="Perfectly Sized Photos Every Time"
      whyContent="Different platforms require different image dimensions. MLS systems want 1920x1080, Zillow prefers specific ratios, and social media platforms each have their own requirements. Instead of opening each photo in an editor and manually resizing, our batch resizer lets you set dimensions once and apply them to your entire photo set in one click. Save hours of tedious manual work on every listing."
      howTitle="How to Resize Your Photos"
      howSteps={[
        "Upload your photos by dragging them into the dropzone or clicking to browse.",
        "Set your target width and height, choose an output format, and adjust quality.",
        "Click Resize and download all your perfectly sized photos - ready to use anywhere.",
      ]}
      internalLink={{
        text: "Need to reduce file sizes for MLS uploads? Try our Batch Image Compressor",
        href: "/batch-image-compressor",
      }}
      faqItems={[
        {
          question: "What are the best dimensions for web and listing photos?",
          answer:
            "For MLS listings, 1920x1080 (16:9) or 2048x1536 (4:3) are the most common standards. For websites, 1920x1080 is ideal for hero images. Social media varies: Instagram prefers 1080x1080, Facebook cover photos are 820x312, and Twitter headers are 1500x500.",
        },
        {
          question: "Does resizing lose image quality?",
          answer:
            "Downsizing (making images smaller) generally preserves quality well. Upsizing (making images larger) can introduce blurriness since the browser must interpolate new pixels. For best results, start with the highest resolution source and resize down. Our quality slider lets you fine-tune the compression level of the output.",
        },
        {
          question: "What output formats are supported?",
          answer:
            "We support JPEG (best for photos, smallest file size), PNG (lossless, supports transparency), and WebP (modern format with excellent compression). JPEG is recommended for real estate listing photos. PNG is ideal for graphics with text or transparency. WebP offers the best compression but may not be supported by all MLS systems.",
        },
      ]}
      renderConfig={(files, onProcess) => {
        const handleResize = () => {
          const options: ProcessingOptions = {
            resize: { width, height, maintainAspect },
            format,
          };
          if (format === "jpeg" || format === "webp") {
            options.compress = { maxSizeMB: 50, quality };
          }
          onProcess(options);
        };

        return (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            {/* Dimensions */}
            <div>
              <label className="block font-semibold text-slate-dark mb-2">
                Target Dimensions (px)
              </label>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">
                    Width
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min={1}
                    className="w-full border border-border rounded px-3 py-2 text-sm"
                  />
                </div>
                <span className="text-gray-400 mt-5">x</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">
                    Height
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min={1}
                    className="w-full border border-border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Maintain Aspect Ratio Toggle */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-dark">
                    Maintain Aspect Ratio
                  </span>
                  <p className="text-sm text-gray-500">
                    Fit within dimensions without stretching or cropping
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
              </label>
            </div>

            {/* Output Format */}
            <div>
              <label className="block font-semibold text-slate-dark mb-2">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as "jpeg" | "png" | "webp")
                }
                className="w-full border border-border rounded px-3 py-2 text-sm"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            {/* Quality Slider (only for lossy formats) */}
            {(format === "jpeg" || format === "webp") && (
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
            )}

            {/* Resize Button */}
            <button
              onClick={handleResize}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-4 px-8 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
              Resize {files.length} Photo{files.length !== 1 ? "s" : ""}
            </button>
          </div>
        );
      }}
    />
  );
}
