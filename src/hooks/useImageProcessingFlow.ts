"use client";

import { useCallback, useState } from "react";
import type {
  ProcessedImage,
  ProcessingOptions,
  ProcessingProgress,
} from "@/lib/image-processing";
import { processImages } from "@/lib/image-processing";

export type ProcessingFlowState = "upload" | "configure" | "processing" | "done";

const DEFAULT_PROGRESS: ProcessingProgress = {
  current: 0,
  total: 0,
  currentFile: "",
  stage: "Processing",
};

interface UseImageProcessingFlowOptions {
  initialStage?: string;
}

export function useImageProcessingFlow({
  initialStage = "Processing",
}: UseImageProcessingFlowOptions = {}) {
  const [state, setState] = useState<ProcessingFlowState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProcessingProgress>({
    ...DEFAULT_PROGRESS,
    stage: initialStage,
  });

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      setFiles(newFiles);
      setResults([]);
      setErrorMessage(null);
      setProgress({ ...DEFAULT_PROGRESS, stage: initialStage });
      setState("configure");
    },
    [initialStage]
  );

  const runProcessing = useCallback(
    async (
      processor: (
        files: File[],
        onProgress: (next: ProcessingProgress) => void
      ) => Promise<ProcessedImage[]>
    ) => {
      setErrorMessage(null);
      setState("processing");

      try {
        const processed = await processor(files, setProgress);
        setResults(processed);
        setState("done");
      } catch (error) {
        console.error("Image processing flow failed:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while processing your images."
        );
        setState("configure");
      }
    },
    [files]
  );

  const runWithOptions = useCallback(
    async (options: ProcessingOptions) => {
      await runProcessing((currentFiles, onProgress) =>
        processImages(currentFiles, options, onProgress)
      );
    },
    [runProcessing]
  );

  const reset = useCallback(() => {
    setFiles([]);
    setResults([]);
    setErrorMessage(null);
    setProgress({ ...DEFAULT_PROGRESS, stage: initialStage });
    setState("upload");
  }, [initialStage]);

  return {
    state,
    files,
    progress,
    results,
    errorMessage,
    setProgress,
    handleFiles,
    runProcessing,
    runWithOptions,
    reset,
  };
}
