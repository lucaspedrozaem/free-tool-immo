"use client";

import type { ProcessingProgress } from "@/lib/image-processing";

interface ProgressBarProps {
  progress: ProcessingProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const percentage = Math.round((progress.current / progress.total) * 100);

  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <svg className="w-16 h-16 animate-spin text-primary/20" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              strokeLinecap="round"
              d="M12 2a10 10 0 0 1 10 10"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-dark">
          {progress.stage} {progress.current} of {progress.total} photos...
        </p>
        <p className="text-sm text-gray-500 mt-1 truncate max-w-md mx-auto">
          {progress.currentFile}
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">{percentage}% complete</p>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Processing locally on your device. Your photos never leave your browser.
      </div>
    </div>
  );
}
