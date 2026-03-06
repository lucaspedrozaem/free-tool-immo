"use client";

import type { ProcessingProgress } from "@/lib/image-processing";
import { Icon } from "@iconify/react";

interface ProgressBarProps {
  progress: ProcessingProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const percentage = Math.round((progress.current / progress.total) * 100);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <Icon
            icon="lucide:loader-2"
            className="w-16 h-16 animate-spin text-primary"
          />
        </div>
        <p className="text-lg font-semibold text-slate-dark">
          {progress.stage} {progress.current} of {progress.total} photos...
        </p>
        <p className="text-sm text-gray-500 mt-1 truncate max-w-xs sm:max-w-md mx-auto">
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
        <Icon icon="lucide:lock" className="w-4 h-4" />
        Processing locally on your device. Your photos never leave your browser.
      </div>
    </div>
  );
}
