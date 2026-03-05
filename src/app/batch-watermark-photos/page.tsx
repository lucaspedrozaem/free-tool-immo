"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

const FONT_SIZE_MAP: Record<string, number> = {
  small: 16,
  medium: 24,
  large: 36,
};

export default function BatchWatermarkPhotosPage() {
  const [watermarkText, setWatermarkText] = useState("");
  const [position, setPosition] = useState<
    "bottom-right" | "bottom-left" | "center" | "top-right"
  >("bottom-right");
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [stripExif, setStripExif] = useState(false);

  return (
    <ToolPageLayout
      illustration="/illustrations/tool-watermark.jpg"
      title="Batch Watermark Real Estate Photos"
      subtitle="Protect your listing photography by adding custom watermarks to multiple images at once. 100% free, runs in your browser."
      description="Our free batch watermark tool lets real estate agents and photographers protect their listing images in seconds. Add your agency name, logo text, or copyright notice to dozens of property photos at once. Choose the perfect placement, opacity, and size so your watermark protects without distracting from the listing. Everything runs locally in your browser - your photos are never uploaded to any server."
      whyTitle="Protect Your Listing Photography Investment"
      whyContent="Professional real estate photography is a significant investment. Without watermarks, your listing photos can be stolen and reused by competitors, scraped by third-party sites, or shared without attribution. Adding a tasteful watermark to your property images ensures your brand stays attached to your work, deters unauthorized use, and helps potential clients find their way back to you. Batch processing saves you hours compared to watermarking photos one at a time in Photoshop or Canva."
      howTitle="How to Batch Watermark Your Photos"
      howSteps={[
        "Upload your real estate listing photos (up to 50 at once).",
        "Configure your watermark text, position, opacity, and font size.",
        "Click the Watermark button and download your protected images instantly.",
      ]}
      internalLink={{
        text: "Need to rename your photos too? Try our Bulk Rename Photos tool",
        href: "/bulk-rename-photos",
      }}
      faqItems={[
        {
          question: "What is the best watermark placement for real estate photos?",
          answer:
            "Bottom-right is the most popular placement for real estate watermarks because it is visible without covering key property details. For photos where the bottom-right contains important information (like a pool or patio), consider bottom-left or a semi-transparent center watermark. Avoid fully centered opaque watermarks, as they can obscure listing details and turn off potential buyers.",
        },
        {
          question: "Does adding a watermark reduce photo quality?",
          answer:
            "Our watermarking tool preserves the original image resolution and quality. The watermark is composited onto the image at the pixel level, so the only visual change is the watermark itself. The file size may increase very slightly due to the added text, but the difference is negligible. Your MLS and listing site uploads will look just as sharp as the originals.",
        },
        {
          question: "Can watermarks be removed from photos?",
          answer:
            "While no watermark is 100% tamper-proof, a well-placed watermark with moderate opacity significantly deters casual theft. Removing a watermark requires editing software and effort, which stops the vast majority of unauthorized use. For maximum protection, use a semi-transparent watermark placed over an important area of the image rather than in a plain corner that could be easily cropped.",
        },
      ]}
      renderConfig={(files, onProcess) => {
        const handleProcess = () => {
          const options: ProcessingOptions = {
            watermark: {
              text: watermarkText || "© Your Agency Name",
              position,
              opacity,
              fontSize: FONT_SIZE_MAP[fontSize],
            },
          };
          if (stripExif) {
            options.stripExif = true;
          }
          onProcess(options);
        };

        return (
          <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
            {/* Watermark Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="© Your Agency Name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Position
              </label>
              <select
                value={position}
                onChange={(e) =>
                  setPosition(
                    e.target.value as
                      | "bottom-right"
                      | "bottom-left"
                      | "center"
                      | "top-right"
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="center">Center</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Opacity: {opacity.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Subtle</span>
                <span>Bold</span>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Font Size
              </label>
              <select
                value={fontSize}
                onChange={(e) =>
                  setFontSize(e.target.value as "small" | "medium" | "large")
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Strip EXIF */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={stripExif}
                onChange={(e) => setStripExif(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-gray-700">
                Strip EXIF metadata (remove GPS location and camera data)
              </span>
            </label>

            {/* Process Button */}
            <button
              onClick={handleProcess}
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Watermark {files.length} Photo{files.length !== 1 ? "s" : ""}
            </button>
          </div>
        );
      }}
    />
  );
}
