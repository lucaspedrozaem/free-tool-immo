"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

type Platform = "zillow" | "realtor" | "redfin" | "homes";

const platformConfigs: Record<
  Platform,
  { label: string; width: number; height: number; maxSizeMB: number; quality: number }
> = {
  zillow: {
    label: "Zillow",
    width: 1920,
    height: 1080,
    maxSizeMB: 5,
    quality: 0.92,
  },
  realtor: {
    label: "Realtor.com",
    width: 1920,
    height: 1080,
    maxSizeMB: 5,
    quality: 0.92,
  },
  redfin: {
    label: "Redfin",
    width: 1920,
    height: 1080,
    maxSizeMB: 5,
    quality: 0.90,
  },
  homes: {
    label: "Homes.com",
    width: 1920,
    height: 1080,
    maxSizeMB: 5,
    quality: 0.92,
  },
};

export default function ZillowPhotoFormatterPage() {
  const [platform, setPlatform] = useState<Platform>("zillow");
  const [stripExif, setStripExif] = useState(true);

  const config = platformConfigs[platform];

  return (
    <ToolPageLayout
      title="Format Photos for Zillow & Realtor.com"
      subtitle="Auto-resize and compress listing photos to meet platform-specific requirements. Never get a photo rejection again."
      description="Zillow, Realtor.com, Redfin, and Homes.com each have specific photo upload requirements including minimum dimensions, maximum file sizes, and preferred aspect ratios. Manually formatting photos for each platform wastes valuable time. Our free Zillow Photo Formatter automatically detects and applies the correct settings for your chosen platform, including resizing to the optimal dimensions, compressing below the file size limit, and stripping EXIF metadata for privacy."
      whyTitle="Never Get a Zillow Photo Rejection Again"
      whyContent="Photo rejections from listing portals are one of the most frustrating parts of uploading a new listing. Each platform has slightly different requirements, and a single oversized or incorrectly formatted photo can delay your listing going live. This tool eliminates the guesswork by applying platform-specific formatting rules automatically. Select your target platform, upload your photos, and download perfectly formatted images ready for upload."
      howTitle="How to Format Photos for Listing Portals"
      howSteps={[
        "Upload your listing photos (drag & drop or click to browse).",
        "Select your target platform (Zillow, Realtor.com, Redfin, or Homes.com).",
        "Download your formatted photos, ready to upload without rejections.",
      ]}
      internalLink={{
        text: "Need custom MLS dimensions? Try our MLS Photo Resizer",
        href: "/mls-photo-resizer",
      }}
      faqItems={[
        {
          question: "What are Zillow's photo requirements in 2026?",
          answer:
            "Zillow recommends photos at 1920x1080 pixels (16:9 aspect ratio) with a maximum file size of 5MB. Photos should be in JPEG format for optimal compatibility. Our formatter automatically applies these settings so your photos are accepted on the first upload.",
        },
        {
          question:
            "What are Realtor.com's photo size limits?",
          answer:
            "Realtor.com accepts photos up to 5MB in size with recommended dimensions of 1920x1080 pixels. Like Zillow, JPEG format is preferred. Photos that exceed the file size limit will be rejected during upload.",
        },
        {
          question:
            "What dimensions are recommended for listing portal photos?",
          answer:
            "Most major listing portals (Zillow, Realtor.com, Redfin, Homes.com) recommend 1920x1080 pixels at a 16:9 aspect ratio. This provides high-quality images that display well across desktop and mobile devices. Our tool automatically resizes to these dimensions while maintaining the correct aspect ratio.",
        },
      ]}
      renderConfig={(files, onProcess) => (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Platform selector */}
          <div>
            <label className="block font-semibold text-slate-dark mb-2">
              Target Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white"
            >
              <option value="zillow">Zillow</option>
              <option value="realtor">Realtor.com</option>
              <option value="redfin">Redfin</option>
              <option value="homes">Homes.com</option>
            </select>
          </div>

          {/* Auto-applied settings display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-blue-800 mb-2">
              {config.label} Settings (auto-applied)
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>
                Resize to: {config.width} &times; {config.height}px
              </li>
              <li>Compress under: {config.maxSizeMB}MB</li>
              <li>Quality: {Math.round(config.quality * 100)}%</li>
              <li>Format: JPEG</li>
            </ul>
          </div>

          {/* Strip EXIF toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-dark">
                  Strip EXIF / GPS Data
                </span>
                <p className="text-sm text-gray-500">
                  Remove metadata for privacy (recommended)
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

          {/* Process button */}
          <button
            onClick={() => {
              const options: ProcessingOptions = {
                resize: {
                  width: config.width,
                  height: config.height,
                  maintainAspect: true,
                },
                compress: {
                  maxSizeMB: config.maxSizeMB,
                  quality: config.quality,
                },
                stripExif,
                format: "jpeg",
              };
              onProcess(options);
            }}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-4 px-8 rounded-md transition-colors shadow-md hover:shadow-lg"
          >
            Format {files.length} Photo{files.length !== 1 ? "s" : ""} for{" "}
            {config.label}
          </button>
        </div>
      )}
    />
  );
}
