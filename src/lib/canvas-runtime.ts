export type RuntimeCanvas = OffscreenCanvas | HTMLCanvasElement;
export type RuntimeCanvas2DContext =
  | OffscreenCanvasRenderingContext2D
  | CanvasRenderingContext2D;

export interface DecodedCanvasImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

const BROWSER_GUIDANCE =
  "Use an up-to-date browser like Chrome, Edge, Firefox, or Safari, and ensure hardware acceleration is enabled.";

function withFileContext(message: string, fileName?: string): string {
  return fileName ? `${message} (file: ${fileName}).` : `${message}.`;
}

export function createRuntimeCanvas(width: number, height: number): RuntimeCanvas {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  throw new Error(
    `Unable to create a canvas in this environment. ${BROWSER_GUIDANCE}`
  );
}

export function getRuntime2DContext(
  canvas: RuntimeCanvas,
  fileName?: string
): RuntimeCanvas2DContext {
  const ctx = canvas.getContext("2d") as RuntimeCanvas2DContext | null;
  if (!ctx) {
    throw new Error(
      `${withFileContext(
        "Unable to get a 2D rendering context",
        fileName
      )} ${BROWSER_GUIDANCE}`
    );
  }
  return ctx;
}

export async function decodeImageWithFallback(
  input: Blob,
  fileName = "unknown file"
): Promise<DecodedCanvasImage> {
  if (typeof createImageBitmap !== "undefined") {
    try {
      const bitmap = await createImageBitmap(input);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      // Fall through to HTMLImageElement decode path.
    }
  }

  if (typeof Image !== "undefined" && typeof document !== "undefined") {
    const objectUrl = URL.createObjectURL(input);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Image element failed to load."));
        img.src = objectUrl;
      });

      return {
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        close: () => URL.revokeObjectURL(objectUrl),
      };
    } catch {
      URL.revokeObjectURL(objectUrl);
    }
  }

  throw new Error(
    `${withFileContext(
      "Could not decode image data",
      fileName
    )} ${BROWSER_GUIDANCE}`
  );
}

export async function runtimeCanvasToBlob(
  canvas: RuntimeCanvas,
  options: ImageEncodeOptions = {}
): Promise<Blob> {
  if (typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob(options);
  }

  const htmlCanvas = canvas as HTMLCanvasElement;
  const blob = await new Promise<Blob | null>((resolve) => {
    htmlCanvas.toBlob(resolve, options.type, options.quality);
  });

  if (!blob) {
    throw new Error(
      `Unable to export processed image from canvas. ${BROWSER_GUIDANCE}`
    );
  }

  return blob;
}
