"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

export default function HeicToJpgConverterPage() {
  const [quality, setQuality] = useState(0.92);
  const [stripExif, setStripExif] = useState(true);
  const [enableResize, setEnableResize] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(2048);
  const [resizeHeight, setResizeHeight] = useState(1536);

  return (
    <ToolPageLayout
      illustration="/illustrations/tool-heic-to-jpg.jpg"
      title="HEIC to JPG Converter"
      subtitle="Convert iPhone HEIC photos to universally compatible JPGs — right in your browser. No uploads, no accounts, 100% free."
      description="Our free HEIC to JPG converter is built specifically for real estate professionals who receive iPhone photos from clients, photographers, and colleagues. HEIC files are not supported by most MLS systems, listing platforms, or email clients. This tool converts them to standard JPG format instantly in your browser — no cloud upload, no file size limits, and no account required."
      whyTitle="Stop Dealing with HEIC Compatibility Issues"
      whyContent="Every real estate agent has been there: a client sends property photos from their iPhone, and the files are in HEIC format. Your MLS won't accept them. Your email client can't preview them. Your listing platform rejects them. You waste 15 minutes searching for a converter, uploading files to a sketchy website, and downloading them one by one. With this free tool, you drag and drop your HEIC files, choose your settings, and download perfectly converted JPGs — all without your photos ever leaving your computer."
      howTitle="How to Convert HEIC to JPG"
      howSteps={[
        "Upload your HEIC/HEIF photos — drag and drop or click to browse. Batch convert as many as you need.",
        "Choose your settings — adjust quality, strip EXIF data for privacy, and optionally resize to specific dimensions.",
        "Download your JPGs — get all your converted photos in one click, ready for MLS, email, or any listing platform.",
      ]}
      complianceNote="This tool performs format conversion and optional utility edits (resizing, EXIF removal) entirely in your browser. No image data is uploaded to any server. Adjusting quality or dimensions for MLS compatibility is a standard utility edit, not a material alteration of listing photos."
      internalLink={{
        text: "Need to remove EXIF location data from your listing photos? Try our free EXIF Remover",
        href: "/remove-exif-data",
      }}
      faqItems={[
        {
          question: "What is a HEIC file?",
          answer:
            "HEIC (High Efficiency Image Container) is an image format developed by the MPEG group. It uses the HEIF (High Efficiency Image Format) standard and HEVC compression to store photos at roughly half the file size of a JPG while maintaining the same quality. Apple adopted HEIC as the default photo format for iPhones starting with iOS 11.",
        },
        {
          question: "Why do iPhones save photos as HEIC instead of JPG?",
          answer:
            "Apple switched to HEIC because it saves significant storage space — a HEIC file is typically 40-50% smaller than an equivalent JPG. This means your iPhone can store roughly twice as many photos. However, HEIC is not universally supported outside of Apple's ecosystem, which creates compatibility problems when sharing photos.",
        },
        {
          question:
            "Will my MLS accept HEIC files?",
          answer:
            "Most MLS systems do not accept HEIC files. The majority require JPG (JPEG) format for listing photos. Some newer platforms may support PNG or WebP, but JPG remains the universal standard. Converting your HEIC photos to JPG ensures they will be accepted by virtually every MLS and listing platform.",
        },
        {
          question: "Does converting from HEIC to JPG reduce image quality?",
          answer:
            "There is a small quality reduction when converting from HEIC to JPG because JPG uses lossy compression. However, at the default quality setting of 92%, the difference is virtually imperceptible. For MLS and listing purposes, the converted JPGs will look identical to the originals.",
        },
        {
          question:
            "Are my photos uploaded to a server during conversion?",
          answer:
            "No. This tool runs entirely in your browser using client-side JavaScript. Your HEIC files are processed locally on your device and are never uploaded to any server. This ensures complete privacy and also means the tool works offline once the page is loaded.",
        },
        {
          question: "Can I convert HEIC files on Windows or Android?",
          answer:
            "Yes. This browser-based tool works on any device with a modern web browser — Windows, Mac, Android, Chromebook, or Linux. You do not need any special software or plugins installed. Simply open this page and drop your HEIC files.",
        },
      ]}
      acceptFormats={{
        "image/heic": [".heic"],
        "image/heif": [".heif"],
      }}
      dropzoneDescription="Drag & drop HEIC/HEIF photos here, or click to browse"
      renderConfig={(files, onProcess) => (
        <div className="space-y-6">
          {/* Quality slider */}
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

          {/* Strip EXIF */}
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

          {/* Resize toggle */}
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

          {/* Convert button */}
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
            Convert {files.length} Photo{files.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}
    />
  );
}
