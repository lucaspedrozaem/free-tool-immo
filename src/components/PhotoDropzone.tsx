"use client";

import { useCallback, useId } from "react";
import { useDropzone } from "react-dropzone";

interface PhotoDropzoneProps {
  onFiles: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  compact?: boolean;
  description?: string;
}

export function PhotoDropzone({
  onFiles,
  maxFiles = 50,
  accept,
  compact = false,
  description,
}: PhotoDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFiles(acceptedFiles.slice(0, maxFiles));
    },
    [onFiles, maxFiles]
  );
  const dropzoneId = useId();

  const defaultAccept = accept ?? {
    "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: defaultAccept,
    maxFiles,
  });

  const instructions = compact
    ? description || `or click to browse (up to ${maxFiles} files)`
    : description || "Supports JPG, PNG, WebP, and iPhone HEIC files";

  const keyboardInstructions =
    "Press Enter or Space to open the file picker, or drag and drop files.";

  const rootProps = getRootProps({
    role: "button",
    "aria-label": `Photo upload dropzone. ${instructions}`,
    "aria-describedby": `${dropzoneId}-instructions ${dropzoneId}-keyboard`,
  });

  if (compact) {
    return (
      <div
        {...rootProps}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 bg-white"
        }`}
      >
        <input {...getInputProps()} aria-label="Upload listing photos" />
        <p id={`${dropzoneId}-instructions`} className="sr-only">
          {instructions}
        </p>
        <p id={`${dropzoneId}-keyboard`} className="sr-only">
          {keyboardInstructions}
        </p>
        <div className="flex flex-col items-center gap-3">
          <svg
            className={`w-10 h-10 ${isDragActive ? "text-primary" : "text-border"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>
            <p className="font-semibold text-slate-dark">
              {isDragActive ? "Drop photos here" : "Drag & drop photos here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">{instructions}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...rootProps}
      className={`border-2 border-dashed rounded-2xl p-6 sm:p-12 md:p-16 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.02] shadow-xl shadow-primary/10"
          : "border-border hover:border-primary/50 bg-white shadow-lg hover:shadow-xl"
      }`}
    >
      <input {...getInputProps()} aria-label="Upload listing photos" />
      <p id={`${dropzoneId}-instructions`} className="sr-only">
        {instructions}
      </p>
      <p id={`${dropzoneId}-keyboard`} className="sr-only">
        {keyboardInstructions}
      </p>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${isDragActive ? "bg-primary/10" : "bg-gray-100"}`}
        >
          <svg
            className={`w-8 h-8 ${isDragActive ? "text-primary" : "text-gray-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-dark">
            {isDragActive
              ? "Drop your listing photos here!"
              : "Drag & Drop up to 50 photos here"}
          </p>
          <p className="text-gray-500 mt-2">
            or <span className="text-primary font-medium underline">click to browse</span>
          </p>
          <p className="text-sm text-gray-400 mt-3">{instructions}</p>
        </div>
      </div>
    </div>
  );
}
