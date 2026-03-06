import type { ProcessedImage, ProcessingProgress } from "@/lib/image-processing";

interface RunImagePipelineArgs {
  files: File[];
  stage: string;
  onProgress: (progress: ProcessingProgress) => void;
  processor: (file: File, index: number) => Promise<ProcessedImage>;
}

export async function runImagePipeline({
  files,
  stage,
  onProgress,
  processor,
}: RunImagePipelineArgs): Promise<ProcessedImage[]> {
  const processed: ProcessedImage[] = [];

  for (let i = 0; i < files.length; i++) {
    onProgress({
      current: i + 1,
      total: files.length,
      currentFile: files[i].name,
      stage,
    });

    processed.push(await processor(files[i], i));
  }

  return processed;
}
