"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import type { ProcessingOptions } from "@/lib/image-processing";

export default function RemoveExifDataPage() {
  const [resizeEnabled, setResizeEnabled] = useState(false);

  return (
    <ToolPageLayout
      illustration="/illustrations/tool-remove-exif.jpg"
      title="Remove EXIF Data from Listing Photos"
      subtitle="Strip GPS coordinates, camera info, and hidden metadata from your real estate photos to protect seller and tenant privacy."
      description="EXIF data is embedded in every digital photo and can include the exact GPS coordinates where the photo was taken, the camera model, date and time, and even the software used to edit it. When you upload listing photos with EXIF data intact, you may inadvertently expose the property's exact location before the listing goes live, or reveal private details about the seller's daily routine. Our free EXIF remover strips all metadata in your browser - your photos never leave your device."
      whyTitle="Protect Seller and Tenant Privacy"
      whyContent="Every photo taken with a smartphone embeds GPS coordinates, timestamps, and device information into the file's EXIF data. When listing photos are shared online or uploaded to portals, this hidden metadata can expose the exact location of a property before it's publicly listed, compromise seller and tenant privacy, and even create security risks. Stripping EXIF data is a simple best practice that every real estate professional should adopt - and with this free tool, it takes seconds."
      howTitle="How to Strip EXIF Data"
      howSteps={[
        "Upload your listing photos (drag & drop or click to browse).",
        "Confirm the metadata to be removed and optionally enable resizing.",
        "Download your cleaned photos with all EXIF data stripped.",
      ]}
      complianceNote="Removing EXIF metadata is a privacy-preserving operation that does not alter the visual appearance of your photos. It is fully compliant with MLS guidelines and California's digital alteration disclosure requirements. In fact, stripping metadata is considered a best practice for protecting client privacy."
      internalLink={{
        text: "Need to resize photos for MLS too? Try our MLS Photo Resizer",
        href: "/mls-photo-resizer",
      }}
      faqItems={[
        {
          question: "What is EXIF data?",
          answer:
            "EXIF (Exchangeable Image File Format) data is metadata embedded in digital photos by cameras and smartphones. It includes information such as GPS coordinates, camera make and model, date and time the photo was taken, lens settings, and the software used to process the image. This data is invisible when viewing the photo but can be read by anyone with the right tools.",
        },
        {
          question:
            "Why should I remove GPS data from listing photos?",
          answer:
            "GPS coordinates in listing photos can reveal the exact location of a property before it is publicly listed, which can be a security concern for sellers and tenants. Removing GPS data protects privacy, prevents premature disclosure of property locations, and is considered a best practice by many real estate associations.",
        },
        {
          question: "Does removing EXIF data change the image quality?",
          answer:
            "No. Stripping EXIF data only removes the hidden metadata attached to the image file. The actual pixels of the photo remain completely untouched, so there is zero impact on image quality, resolution, or appearance.",
        },
      ]}
      renderConfig={(files, onProcess) => (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* EXIF removal summary */}
          <div>
            <h3 className="font-semibold text-slate-dark mb-3">
              Metadata to be Removed
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                    &times;
                  </span>
                  GPS coordinates
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                    &times;
                  </span>
                  Camera info (make, model, lens)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                    &times;
                  </span>
                  Date/time stamps
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                    &times;
                  </span>
                  Software info
                </li>
              </ul>
            </div>
          </div>

          {/* Optional resize toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-dark">
                  Also resize photos
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
            onClick={() => {
              const options: ProcessingOptions = {
                stripExif: true,
                format: "jpeg",
              };
              if (resizeEnabled) {
                options.resize = {
                  width: 1920,
                  height: 1080,
                  maintainAspect: true,
                };
              }
              onProcess(options);
            }}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-4 px-8 rounded-md transition-colors shadow-md hover:shadow-lg"
          >
            Strip EXIF from {files.length} Photo
            {files.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}
    />
  );
}
