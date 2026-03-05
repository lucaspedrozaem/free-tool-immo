"use client";

import type { ProcessedImage } from "@/lib/image-processing";
import {
  formatFileSize,
  downloadAsZip,
  downloadSingleImage,
} from "@/lib/image-processing";

interface ResultsPanelProps {
  images: ProcessedImage[];
  onReset: () => void;
  zipName?: string;
}

export function ResultsPanel({
  images,
  onReset,
  zipName = "listing-photos",
}: ResultsPanelProps) {
  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalNew = images.reduce((sum, img) => sum + img.newSize, 0);
  const savedPercent = Math.round((1 - totalNew / totalOriginal) * 100);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-8">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-heading font-bold text-slate-dark">
          All Done!
        </h2>
        <p className="text-gray-500 mt-1">
          {images.length} photo{images.length !== 1 ? "s" : ""} processed
          successfully
        </p>
        {savedPercent > 0 && (
          <p className="text-sm text-success-dark mt-1">
            Saved {savedPercent}% ({formatFileSize(totalOriginal - totalNew)}{" "}
            reduced)
          </p>
        )}
      </div>

      {/* Image list */}
      <div className="max-h-64 overflow-y-auto mb-6 space-y-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-2 bg-ash rounded-lg text-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{img.newName}</p>
              <p className="text-gray-400 text-xs">
                {img.width}x{img.height} &middot; {formatFileSize(img.newSize)}
              </p>
            </div>
            <button
              onClick={() => downloadSingleImage(img)}
              className="text-primary hover:text-primary-dark ml-3 text-xs font-medium py-1 px-2"
            >
              Download
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => downloadAsZip(images, zipName)}
          className="flex-1 bg-success hover:bg-success-dark text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download All as ZIP
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-white border border-border text-slate-dark font-semibold py-3 px-6 rounded-md hover:bg-ash transition-colors"
        >
          Process Another Listing
        </button>
      </div>
    </div>
  );
}
