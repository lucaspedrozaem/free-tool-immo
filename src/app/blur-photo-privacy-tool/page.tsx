"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import NextImage from "next/image";
const faqItems = [
  {
    question: "What should I blur in listing photos?",
    answer:
      "Common items to blur include: license plates on cars in driveways, faces of neighbors or passersby, security keypads and alarm codes, personal family photos on walls, computer screens with sensitive info, mail with visible addresses, and any identifiable personal items that could compromise privacy.",
  },
  {
    question: "Is this compliant with fair housing and privacy laws?",
    answer:
      "Blurring personal items and security features is a standard privacy practice recommended by real estate associations. It protects sellers' privacy without altering the property's appearance. This is a utility edit, not a material alteration of the listing.",
  },
  {
    question: "Can I undo a blur stroke?",
    answer:
      "Yes! Use the Undo button to step back through your blur strokes one at a time. You can undo all the way back to the original image.",
  },
  {
    question: "Does this use AI to detect faces?",
    answer:
      "No. This is a simple manual brush tool — you paint over the areas you want to blur. This gives you full control over exactly what gets blurred. No AI, no cloud processing, no privacy concerns.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All blurring happens locally in your browser using HTML5 Canvas. Your listing photos never leave your device, ensuring complete privacy.",
  },
];

export default function BlurPhotoPrivacyPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [blurIntensity, setBlurIntensity] = useState(20);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const initCanvas = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Scale to fit within max dimensions while preserving ratio
      const maxW = 1200;
      const maxH = 800;
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      setImageLoaded(true);
    };
    img.src = url;
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      initCanvas(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      initCanvas(file);
    }
  };

  const applyBlur = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const r = brushSize;

    // Get the region to blur
    const sx = Math.max(0, Math.round(x - r));
    const sy = Math.max(0, Math.round(y - r));
    const sw = Math.min(canvas.width - sx, r * 2);
    const sh = Math.min(canvas.height - sy, r * 2);
    if (sw <= 0 || sh <= 0) return;

    // Pixelate effect (more reliable than CSS blur in OffscreenCanvas)
    const pixelSize = Math.max(2, Math.round(blurIntensity / 2));
    const imgData = ctx.getImageData(sx, sy, sw, sh);
    const data = imgData.data;

    for (let py = 0; py < sh; py += pixelSize) {
      for (let px = 0; px < sw; px += pixelSize) {
        // Check if pixel is within brush circle
        const dx = px - r;
        const dy = py - r;
        if (dx * dx + dy * dy > r * r) continue;

        // Average the pixel block
        let totalR = 0, totalG = 0, totalB = 0, count = 0;
        for (let by = 0; by < pixelSize && py + by < sh; by++) {
          for (let bx = 0; bx < pixelSize && px + bx < sw; bx++) {
            const idx = ((py + by) * sw + (px + bx)) * 4;
            totalR += data[idx];
            totalG += data[idx + 1];
            totalB += data[idx + 2];
            count++;
          }
        }
        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);

        for (let by = 0; by < pixelSize && py + by < sh; by++) {
          for (let bx = 0; bx < pixelSize && px + bx < sw; bx++) {
            const idx = ((py + by) * sw + (px + bx)) * 4;
            data[idx] = avgR;
            data[idx + 1] = avgG;
            data[idx + 2] = avgB;
          }
        }
      }
    }

    ctx.putImageData(imgData, sx, sy);
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    applyBlur(x, y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    applyBlur(x, y);
  };

  const handleEnd = () => {
    if (isDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")!;
      setHistory((prev) => [
        ...prev,
        ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height),
      ]);
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (history.length <= 1 || !canvasRef.current) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.putImageData(newHistory[newHistory.length - 1], 0, 0);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const baseName = imageFile?.name.replace(/\.[^.]+$/, "") || "photo";
      a.download = `${baseName}-blurred.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/jpeg", 0.92);
  };

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(null);
    setImageUrl(null);
    setImageLoaded(false);
    setHistory([]);
    imgRef.current = null;
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-center mb-6">
                <NextImage
                  src="/illustrations/tool-blur-privacy.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
              Privacy Blur Tool for Listing Photos
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Paint over license plates, faces, security pads, and personal items to blur them out. No Photoshop needed — free and runs in your browser.
            </p>
          </div>

          {!imageLoaded ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => document.getElementById("blur-file-input")?.click()}
            >
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 3 3 0 013.862 3.05A3 3 0 0118 19.5H6.75z" />
              </svg>
              <p className="text-lg text-gray-600 mb-2">Drop a listing photo here, or click to browse</p>
              <p className="text-sm text-gray-400">Supports JPG, PNG, WebP</p>
              <input
                id="blur-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div>
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">Brush:</label>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-24 accent-primary"
                  />
                  <span className="text-xs text-gray-500 w-8">{brushSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">Intensity:</label>
                  <input
                    type="range"
                    min="6"
                    max="40"
                    value={blurIntensity}
                    onChange={(e) => setBlurIntensity(Number(e.target.value))}
                    className="w-24 accent-primary"
                  />
                  <span className="text-xs text-gray-500 w-8">{blurIntensity}</span>
                </div>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={handleUndo}
                    disabled={history.length <= 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    Undo
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-1.5 bg-success text-white rounded-md text-sm font-bold hover:bg-success-dark transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    New Photo
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="bg-gray-100 rounded-xl p-2 flex items-center justify-center overflow-auto">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleStart}
                  onMouseMove={handleMove}
                  onMouseUp={handleEnd}
                  onMouseLeave={handleEnd}
                  onTouchStart={handleStart}
                  onTouchMove={handleMove}
                  onTouchEnd={handleEnd}
                  className="max-w-full cursor-crosshair rounded-lg shadow-sm"
                  style={{ touchAction: "none" }}
                />
              </div>

              <p className="text-center text-sm text-gray-500 mt-3">
                Paint over areas you want to blur. Use the brush size slider to adjust coverage.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Protect Privacy in Your Listing Photos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Real estate photos often capture sensitive details that should be obscured before publishing: license plates, faces of neighbors, security keypads, alarm codes, personal photos on walls, and computer screens. Rather than re-shooting or spending time in Photoshop, this tool lets you quickly paint over sensitive areas with a pixelation brush — right in your browser. No software to install, no account required, and your photos never leave your device.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/remove-exif-data" className="text-primary font-semibold hover:underline">
              Also need to strip GPS data from photos? Try our free EXIF Remover &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-2xl text-center mb-8">
            Frequently Asked Questions
          </h2>
          <FAQSection items={faqItems} />
        </div>
      </section>
    </>
  );
}
