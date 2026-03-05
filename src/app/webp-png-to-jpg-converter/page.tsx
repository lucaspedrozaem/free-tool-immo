"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

export default function WebpPngToJpgConverterPage() {
  const [quality, setQuality] = useState(0.92);
  const [stripExif, setStripExif] = useState(true);
  const [enableResize, setEnableResize] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(2048);
  const [resizeHeight, setResizeHeight] = useState(1536);

  return (
    <ToolPageLayout
      title="WebP & PNG to JPG Converter"
      subtitle="Batch convert WebP, PNG, and AVIF images to universally compatible JPG format. 100% free, runs in your browser."
      description="Most MLS systems and listing platforms require JPG format for photo uploads. If your photographer delivers WebP or PNG files, or your phone saves in a newer format, this tool instantly converts them to standard JPG — no cloud upload, no account, no limits. Designed for real estate professionals who need fast, reliable format conversion."
      whyTitle="Why Convert to JPG for Real Estate Listings?"
      whyContent="JPG (JPEG) is the universal standard for real estate listing photos. While WebP and PNG are great formats, most MLS systems, Zillow, Realtor.com, and other listing platforms require or prefer JPG. WebP files are commonly downloaded from websites or delivered by virtual tour software, and PNG files often come from screenshots or graphic design tools. Converting to JPG ensures your listing photos are accepted everywhere, every time."
      howTitle="How to Convert WebP & PNG to JPG"
      howSteps={[
        "Upload your WebP, PNG, or AVIF photos — drag and drop or click to browse. Batch convert up to 50 images at once.",
        "Adjust quality settings — set JPG quality, optionally strip EXIF data for privacy, and resize if needed.",
        "Download your JPGs — get all converted photos in one click as a ZIP file, ready for MLS upload.",
      ]}
      complianceNote="This tool performs format conversion and optional utility edits (resizing, EXIF removal) entirely in your browser. No image data is uploaded to any server. Format conversion is a standard utility operation, not a material alteration of listing photos."
      internalLink={{
        text: "Need to convert HEIC files from iPhones? Try our free HEIC to JPG Converter",
        href: "/heic-to-jpg-converter",
      }}
      faqItems={[
        {
          question: "Why does my MLS reject WebP files?",
          answer:
            "Most MLS systems were built to accept JPG and sometimes PNG files. WebP is a newer format developed by Google that isn't universally supported by older platforms. Converting to JPG ensures compatibility with virtually every MLS, listing platform, and email client.",
        },
        {
          question: "Does converting from PNG to JPG reduce quality?",
          answer:
            "PNG is a lossless format, so converting to JPG (lossy) will introduce a very small quality reduction. At 92% quality, the difference is virtually imperceptible for real estate photos. The benefit is a dramatically smaller file size — often 5-10x smaller.",
        },
        {
          question: "Can I convert multiple files at once?",
          answer:
            "Yes! This tool supports batch conversion of up to 50 images at once. Simply drag and drop all your files, configure your settings, and download everything as a ZIP file.",
        },
        {
          question: "What formats can I convert from?",
          answer:
            "This tool converts WebP, PNG, and AVIF files to JPG. For HEIC files from iPhones, use our dedicated HEIC to JPG Converter which handles Apple's proprietary format.",
        },
        {
          question: "Are my photos uploaded to a server?",
          answer:
            "No. All conversion happens locally in your browser using client-side JavaScript. Your photos never leave your device, ensuring complete privacy for unreleased listings.",
        },
        {
          question: "What about transparency in PNG files?",
          answer:
            "JPG does not support transparency. Any transparent areas in your PNG files will be converted to white background. This is typically desired for real estate photos which rarely use transparency.",
        },
      ]}
      acceptFormats={{
        "image/webp": [".webp"],
        "image/png": [".png"],
        "image/avif": [".avif"],
        "image/jpeg": [".jpg", ".jpeg"],
      }}
      dropzoneDescription="Drag & drop WebP, PNG, or AVIF photos here, or click to browse"
      renderConfig={(files, onProcess) => (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              JPG Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={Math.round(quality * 100)}
              onChange={(e) => setQuality(Number(e.target.value) / 100)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={stripExif}
              onChange={(e) => setStripExif(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <div>
              <span className="text-sm font-semibold text-gray-700">
                Strip EXIF data
              </span>
              <p className="text-xs text-gray-500">
                Remove GPS location, camera info, and other metadata for privacy
              </p>
            </div>
          </label>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableResize}
                onChange={(e) => setEnableResize(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-semibold text-gray-700">
                Resize photos
              </span>
            </label>

            {enableResize && (
              <div className="mt-3 flex items-center gap-3 pl-7">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={resizeWidth}
                    onChange={(e) => setResizeWidth(Number(e.target.value))}
                    min={100}
                    max={10000}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <span className="text-gray-400 mt-5">&times;</span>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={resizeHeight}
                    onChange={(e) => setResizeHeight(Number(e.target.value))}
                    min={100}
                    max={10000}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              const options: ProcessingOptions = {
                format: "jpeg",
                compress: { maxSizeMB: 20, quality },
                stripExif,
                ...(enableResize && {
                  resize: {
                    width: resizeWidth,
                    height: resizeHeight,
                    maintainAspect: true,
                  },
                }),
              };
              onProcess(options);
            }}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg"
          >
            Convert {files.length} Photo{files.length !== 1 ? "s" : ""} to JPG
          </button>
        </div>
      )}
    />
  );
}
