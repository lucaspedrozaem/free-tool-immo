"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

const MLS_PRESETS: Record<string, { width: number; height: number } | null> = {
  "standard-mls": { width: 1920, height: 1080 },
  "mls-4-3": { width: 2048, height: 1536 },
  zillow: { width: 1920, height: 1080 },
  "realtor-com": { width: 2048, height: 1536 },
  custom: null,
};

const PRESET_LABELS: Record<string, string> = {
  "standard-mls": "Standard MLS (1920x1080)",
  "mls-4-3": "MLS 4:3 (2048x1536)",
  zillow: "Zillow (1920x1080)",
  "realtor-com": "Realtor.com (2048x1536)",
  custom: "Custom",
};

export default function MlsPhotoResizerPage() {
  const [preset, setPreset] = useState("standard-mls");
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [compressBelow5MB, setCompressBelow5MB] = useState(true);
  const [stripExif, setStripExif] = useState(true);

  return (
    <ToolPageLayout
      illustration="/illustrations/tool-mls-resizer.jpg"
      title="Resize Photos for MLS in Seconds"
      subtitle="Instantly batch resize listing photos to meet exact MLS, Zillow, and Realtor.com size requirements. 100% free, runs in your browser."
      description="Every MLS and listing portal has specific photo size requirements, and uploading images that don't meet them leads to rejected uploads, cropped photos, or degraded quality. Our free MLS photo resizer lets you batch resize dozens of listing photos at once to the exact dimensions required by your MLS, Zillow, Realtor.com, and other platforms. Choose a preset or enter custom dimensions, optionally compress to stay under file size limits, and download your perfectly formatted photos in seconds. Everything runs locally in your browser - your photos are never uploaded to any server."
      whyTitle="Stop Getting MLS Photo Rejections"
      whyContent="Nothing slows down a listing launch like rejected MLS photos. Each MLS board has its own specific pixel dimensions and file size limits, and photos that don't meet these requirements are automatically rejected or aggressively compressed - resulting in blurry, pixelated listing images that make properties look worse than they are. Our free resizer ensures every photo meets the exact requirements the first time, so you can upload with confidence and keep your listings looking professional."
      howTitle="How to Resize Photos for MLS"
      howSteps={[
        "Upload your listing photos (drag & drop or click to browse).",
        "Select your MLS preset or enter custom dimensions.",
        "Download your perfectly sized photos ready for upload.",
      ]}
      complianceNote="Resizing photos to meet MLS dimension and file-size requirements is a standard, non-deceptive operation that does not alter the content of the image. This tool is fully compliant with California's AB-1886 (effective January 1, 2025), which requires disclosure of materially deceptive image alterations in real estate listings. Resizing and compression are explicitly excluded from disclosure requirements as they do not change what is depicted in the photograph."
      internalLink={{
        text: "Need to strip location data? Try our free EXIF Data Remover",
        href: "/remove-exif-data",
      }}
      faqItems={[
        {
          question: "What are the standard MLS photo size requirements?",
          answer:
            "Most MLS boards require photos to be at least 1920x1080 pixels (16:9 aspect ratio) or 2048x1536 pixels (4:3 aspect ratio). Maximum file sizes typically range from 5MB to 10MB per photo. Some boards also require JPEG format specifically. Our presets cover the most common requirements, but check with your local MLS board for their exact specifications.",
        },
        {
          question: "What is the difference between 4:3 and 16:9 aspect ratios for listing photos?",
          answer:
            "The 16:9 ratio (widescreen) is the most common for online listing displays and matches the format used by Zillow, Redfin, and most modern MLS systems. The 4:3 ratio is a more traditional format that some MLS boards still require, and is closer to the native aspect ratio of many smartphone cameras. If your MLS accepts both, 16:9 generally looks better on listing detail pages because it fills more of the screen.",
        },
        {
          question: "What is the maximum file size for MLS photos?",
          answer:
            "Most MLS boards set a maximum file size between 5MB and 10MB per photo. Zillow and Realtor.com both accept files up to 10MB but recommend keeping them under 5MB for faster loading. Our tool includes a 'Compress below 5MB' option that intelligently reduces file size while preserving visual quality, ensuring your photos meet virtually every MLS file size requirement.",
        },
      ]}
      renderConfig={(files, onProcess) => {
        const handleProcess = () => {
          const dimensions =
            preset === "custom"
              ? { width: customWidth, height: customHeight }
              : MLS_PRESETS[preset]!;

          const options: ProcessingOptions = {
            resize: {
              width: dimensions.width,
              height: dimensions.height,
              maintainAspect: true,
            },
            format: "jpeg",
          };

          if (compressBelow5MB) {
            options.compress = { maxSizeMB: 5, quality: 0.92 };
          }

          if (stripExif) {
            options.stripExif = true;
          }

          onProcess(options);
        };

        return (
          <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
            {/* MLS Preset */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                MLS Preset
              </label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {Object.entries(PRESET_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom dimensions */}
            {preset === "custom" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) =>
                      setCustomWidth(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min={1}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) =>
                      setCustomHeight(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    min={1}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            )}

            {/* Selected dimensions info */}
            {preset !== "custom" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                Output dimensions:{" "}
                <span className="font-semibold">
                  {MLS_PRESETS[preset]!.width} &times;{" "}
                  {MLS_PRESETS[preset]!.height}
                </span>{" "}
                pixels (aspect ratio maintained)
              </div>
            )}

            {/* Compress below 5MB */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Compress below 5MB
                </span>
                <p className="text-sm text-gray-500">
                  Reduce file size to meet MLS upload limits
                </p>
              </div>
              <input
                type="checkbox"
                checked={compressBelow5MB}
                onChange={(e) => setCompressBelow5MB(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
            </label>

            {/* Strip EXIF */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Strip EXIF Data
                </span>
                <p className="text-sm text-gray-500">
                  Remove GPS coordinates and camera metadata for privacy
                </p>
              </div>
              <input
                type="checkbox"
                checked={stripExif}
                onChange={(e) => setStripExif(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
            </label>

            {/* Process Button */}
            <button
              onClick={handleProcess}
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Resize {files.length} Photo{files.length !== 1 ? "s" : ""}
            </button>
          </div>
        );
      }}
    />
  );
}
