export interface ProcessingOptions {
  resize?: { width: number; height: number; maintainAspect?: boolean };
  compress?: { maxSizeMB: number; quality: number };
  stripExif?: boolean;
  watermark?: {
    text?: string;
    logoUrl?: string;
    position: "bottom-right" | "bottom-left" | "center" | "top-right";
    opacity: number;
    fontSize?: number;
  };
  rename?: { prefix: string; startIndex: number };
  format?: "jpeg" | "png" | "webp";
}

export interface ProcessedImage {
  originalName: string;
  newName: string;
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  newSize: number;
}

export interface ProcessingProgress {
  current: number;
  total: number;
  currentFile: string;
  stage: string;
}

function stripExifFromArrayBuffer(buffer: ArrayBuffer): ArrayBuffer {
  const view = new DataView(buffer);
  if (view.getUint16(0) !== 0xffd8) return buffer;

  const pieces: ArrayBuffer[] = [];
  pieces.push(buffer.slice(0, 2));
  let offset = 2;

  while (offset < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint16(offset);
    if (marker === 0xffd9) break;
    if (marker === 0xffda) {
      pieces.push(buffer.slice(offset));
      break;
    }
    const segmentLength = view.getUint16(offset + 2);
    const isExif =
      marker === 0xffe1 ||
      marker === 0xffe2 ||
      marker === 0xffe3 ||
      marker === 0xffe4 ||
      marker === 0xffe5 ||
      marker === 0xffe6 ||
      marker === 0xffe7;
    if (!isExif) {
      pieces.push(buffer.slice(offset, offset + 2 + segmentLength));
    }
    offset += 2 + segmentLength;
  }

  const totalLength = pieces.reduce((sum, p) => sum + p.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const piece of pieces) {
    result.set(new Uint8Array(piece), pos);
    pos += piece.byteLength;
  }
  return result.buffer;
}

export async function processImage(
  file: File,
  options: ProcessingOptions,
  index: number
): Promise<ProcessedImage> {
  let imageSource: string | Blob = file;

  // Handle HEIC conversion
  if (
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif") ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  ) {
    try {
      const heic2any = (await import("heic2any")).default;
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.92,
      });
      imageSource = Array.isArray(converted) ? converted[0] : converted;
    } catch {
      throw new Error(`Failed to convert HEIC file: ${file.name}`);
    }
  }

  const bitmap = await createImageBitmap(
    imageSource instanceof Blob ? imageSource : file
  );

  let targetWidth = bitmap.width;
  let targetHeight = bitmap.height;

  if (options.resize) {
    if (options.resize.maintainAspect !== false) {
      const ratio = Math.min(
        options.resize.width / bitmap.width,
        options.resize.height / bitmap.height
      );
      if (ratio < 1) {
        targetWidth = Math.round(bitmap.width * ratio);
        targetHeight = Math.round(bitmap.height * ratio);
      }
    } else {
      targetWidth = options.resize.width;
      targetHeight = options.resize.height;
    }
  }

  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  // Watermark
  if (options.watermark?.text) {
    const wm = options.watermark;
    const wmText = wm.text!;
    const fontSize = wm.fontSize || Math.max(16, Math.round(targetWidth / 30));
    ctx.globalAlpha = wm.opacity;
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 2;

    const metrics = ctx.measureText(wmText);
    let x: number, y: number;

    switch (wm.position) {
      case "bottom-right":
        x = targetWidth - metrics.width - 20;
        y = targetHeight - 20;
        break;
      case "bottom-left":
        x = 20;
        y = targetHeight - 20;
        break;
      case "top-right":
        x = targetWidth - metrics.width - 20;
        y = fontSize + 20;
        break;
      case "center":
      default:
        x = (targetWidth - metrics.width) / 2;
        y = targetHeight / 2;
        break;
    }

    ctx.strokeText(wmText, x, y);
    ctx.fillText(wmText, x, y);
    ctx.globalAlpha = 1;
  }

  // Export with quality/format
  const format = options.format || "jpeg";
  const mimeType = `image/${format}`;
  let quality = options.compress?.quality ?? 0.92;

  let blob = await canvas.convertToBlob({ type: mimeType, quality });

  // If max size specified, progressively reduce quality
  if (options.compress?.maxSizeMB) {
    const maxBytes = options.compress.maxSizeMB * 1024 * 1024;
    let attempts = 0;
    while (blob.size > maxBytes && quality > 0.1 && attempts < 10) {
      quality -= 0.08;
      blob = await canvas.convertToBlob({ type: mimeType, quality });
      attempts++;
    }
  }

  // Strip EXIF data if requested
  if (options.stripExif) {
    const arrayBuffer = await blob.arrayBuffer();
    const stripped = stripExifFromArrayBuffer(arrayBuffer);
    blob = new Blob([stripped], { type: blob.type });
  }

  // Determine filename
  let newName: string;
  if (options.rename) {
    const ext = format === "jpeg" ? "jpg" : format;
    const num = String(index + options.rename.startIndex).padStart(2, "0");
    const prefix = options.rename.prefix
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
    newName = `${prefix}-${num}.${ext}`;
  } else {
    const ext = format === "jpeg" ? "jpg" : format;
    const baseName = file.name.replace(/\.[^.]+$/, "");
    newName = `${baseName}.${ext}`;
  }

  return {
    originalName: file.name,
    newName,
    blob,
    width: targetWidth,
    height: targetHeight,
    originalSize: file.size,
    newSize: blob.size,
  };
}

export async function processImages(
  files: File[],
  options: ProcessingOptions,
  onProgress: (progress: ProcessingProgress) => void
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = [];

  for (let i = 0; i < files.length; i++) {
    onProgress({
      current: i + 1,
      total: files.length,
      currentFile: files[i].name,
      stage: "Processing",
    });

    const result = await processImage(files[i], options, i);
    results.push(result);
  }

  return results;
}

export async function downloadAsZip(
  images: ProcessedImage[],
  zipName: string = "listing-photos"
): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const { saveAs } = await import("file-saver");

  const zip = new JSZip();
  for (const img of images) {
    zip.file(img.newName, img.blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${zipName}.zip`);
}

export async function downloadSingleImage(image: ProcessedImage): Promise<void> {
  const { saveAs } = await import("file-saver");
  saveAs(image.blob, image.newName);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
