"use client";

import { useState, useMemo } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

function addressToPrefix(address: string): string {
  return address
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function BulkRenamePhotosPage() {
  const [address, setAddress] = useState("");
  const [startIndex, setStartIndex] = useState(1);
  const [stripExif, setStripExif] = useState(false);
  const [resizeEnabled, setResizeEnabled] = useState(false);

  const prefix = useMemo(() => addressToPrefix(address), [address]);

  return (
    <ToolPageLayout
      title="Bulk Rename Listing Photos for SEO"
      subtitle="Rename your real estate photos with SEO-friendly, address-based file names in seconds. Boost search visibility for every listing."
      description="Search engines use file names as a ranking signal when indexing images. Photos named IMG_4532.jpg tell Google nothing about the property, while 123-Main-Street-01.jpg clearly signals the listing address and helps your photos appear in image search results. Our free bulk rename tool converts generic camera file names into clean, keyword-rich, address-based names that improve your listing's SEO without any manual work."
      whyTitle="SEO-Optimized File Names for Maximum Visibility"
      whyContent="Most listing photos are uploaded with default camera names like IMG_4532.jpg or DSC_0091.jpg. These generic names are a missed SEO opportunity. Search engines use image file names as a relevance signal, and descriptive names like 123-Main-Street-Living-Room-01.jpg help your listing photos rank in Google Image Search. By renaming your photos with the property address, you create keyword-rich file names that drive organic traffic to your listings. This simple step takes seconds with our bulk rename tool and can meaningfully improve your search visibility."
      howTitle="How to Bulk Rename Photos"
      howSteps={[
        "Upload your listing photos (drag & drop or click to browse).",
        "Type the property address to generate SEO-friendly file names.",
        "Download your renamed photos, ready for MLS and portal upload.",
      ]}
      internalLink={{
        text: "Need to add watermarks? Try our Batch Watermark Photos tool",
        href: "/batch-watermark-photos",
      }}
      faqItems={[
        {
          question: "Why should I rename listing photos?",
          answer:
            "Search engines like Google use image file names as a ranking signal when indexing content. A photo named 123-Main-Street-01.jpg is far more relevant to a property search than IMG_4532.jpg. Renaming listing photos with the property address and descriptive keywords helps your listings appear in Google Image Search, drives organic traffic, and looks more professional to buyers and agents who download your photos.",
        },
        {
          question: "Does the file name actually affect SEO?",
          answer:
            "Yes. Google has confirmed that image file names are used as a relevance signal for image search rankings. While file names alone won't catapult you to the top of search results, they are one of many on-page SEO factors that contribute to visibility. Combined with descriptive alt text and proper page context, keyword-rich file names help search engines understand what your images depict and match them to relevant queries.",
        },
        {
          question: "What characters are supported in file names?",
          answer:
            "Our tool generates file names using letters, numbers, and hyphens only. Special characters like apostrophes, commas, and periods (except the file extension) are automatically stripped to ensure maximum compatibility across all operating systems, MLS platforms, and listing portals. Spaces are converted to hyphens for clean, URL-friendly file names.",
        },
      ]}
      renderConfig={(files, onProcess) => (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Property address input */}
          <div>
            <label className="block font-semibold text-slate-dark mb-2">
              Property Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street"
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Rename preview */}
          <div>
            <h4 className="font-semibold text-sm text-slate-dark mb-2">
              File Name Preview
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1.5">
              {(prefix ? [prefix] : ["123-Main-Street"]).map((p) =>
                Array.from({ length: Math.min(files.length, 3) }, (_, i) => (
                  <p key={i} className="text-sm font-mono text-gray-700">
                    {p}-{String(startIndex + i).padStart(2, "0")}.jpg
                  </p>
                ))
              )}
              {files.length > 3 && (
                <p className="text-sm text-gray-400 italic">
                  ...and {files.length - 3} more
                </p>
              )}
              {!prefix && (
                <p className="text-xs text-gray-400 mt-1">
                  Type an address above to see your file names
                </p>
              )}
            </div>
          </div>

          {/* Starting number */}
          <div>
            <label className="block font-semibold text-slate-dark mb-2">
              Starting Number
            </label>
            <input
              type="number"
              min={1}
              value={startIndex}
              onChange={(e) =>
                setStartIndex(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-24 border border-border rounded-md px-3 py-2.5 text-sm bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Optional toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-dark">
                  Strip EXIF / GPS Data
                </span>
                <p className="text-sm text-gray-500">
                  Remove metadata for privacy
                </p>
              </div>
              <input
                type="checkbox"
                checked={stripExif}
                onChange={(e) => setStripExif(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-dark">
                  Resize photos
                </span>
                <p className="text-sm text-gray-500">
                  Resize to 1920x1080 for MLS compatibility
                </p>
              </div>
              <input
                type="checkbox"
                checked={resizeEnabled}
                onChange={(e) => setResizeEnabled(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
            </label>
          </div>

          {/* Process button */}
          <button
            disabled={!prefix}
            onClick={() => {
              const options: ProcessingOptions = {
                rename: {
                  prefix,
                  startIndex,
                },
                format: "jpeg",
              };
              if (stripExif) {
                options.stripExif = true;
              }
              if (resizeEnabled) {
                options.resize = {
                  width: 1920,
                  height: 1080,
                  maintainAspect: true,
                };
              }
              onProcess(options);
            }}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-4 px-8 rounded-md transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Rename {files.length} Photo{files.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}
    />
  );
}
