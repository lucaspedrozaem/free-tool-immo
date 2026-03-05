"use client";
import Image from "next/image";

import { useState, useCallback, useRef } from "react";
import { PhotoDropzone } from "@/components/PhotoDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import type {
  ProcessedImage,
  ProcessingProgress,
} from "@/lib/image-processing";

type AppState = "upload" | "configure" | "processing" | "done";
type QrPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const faqItems = [
  {
    question: "What QR code image format should I upload?",
    answer:
      "Upload any standard QR code image as PNG, JPG, or SVG. You can generate a free QR code from sites like qr-code-generator.com that links to your listing page, website, virtual tour, or contact card.",
  },
  {
    question: "Can I control the QR code size and position?",
    answer:
      "Yes! Choose from 4 corner positions (bottom-right, bottom-left, top-right, top-left), adjust the size from small to large, and control the opacity. A white background pad ensures readability on any photo.",
  },
  {
    question: "Will the QR code look good on dark and light photos?",
    answer:
      "Yes. The tool automatically adds a white background pad behind the QR code, ensuring it's scannable regardless of the photo's colors.",
  },
  {
    question: "Can I batch-apply to multiple photos?",
    answer:
      "Yes! Upload up to 50 listing photos and the QR code is applied to all of them at once. Download everything as a ZIP file.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All processing happens locally in your browser using HTML5 Canvas. Your listing photos never leave your device.",
  },
];

async function applyQrCode(
  file: File,
  qrBitmap: ImageBitmap,
  config: {
    position: QrPosition;
    sizePercent: number;
    opacity: number;
    padding: number;
  }
): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(bitmap, 0, 0);

  const qrSize = Math.round(Math.min(bitmap.width, bitmap.height) * (config.sizePercent / 100));
  const margin = Math.round(bitmap.width * 0.025);
  const pad = config.padding;

  let x: number, y: number;
  switch (config.position) {
    case "top-left":
      x = margin;
      y = margin;
      break;
    case "top-right":
      x = bitmap.width - margin - qrSize - pad * 2;
      y = margin;
      break;
    case "bottom-left":
      x = margin;
      y = bitmap.height - margin - qrSize - pad * 2;
      break;
    case "bottom-right":
    default:
      x = bitmap.width - margin - qrSize - pad * 2;
      y = bitmap.height - margin - qrSize - pad * 2;
      break;
  }

  // White background pad
  ctx.globalAlpha = config.opacity;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, qrSize + pad * 2, qrSize + pad * 2);

  // QR code
  ctx.drawImage(qrBitmap, x + pad, y + pad, qrSize, qrSize);
  ctx.globalAlpha = 1;

  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  const baseName = file.name.replace(/\.[^.]+$/, "");

  return {
    originalName: file.name,
    newName: `${baseName}-qr.jpg`,
    blob,
    width: canvas.width,
    height: canvas.height,
    originalSize: file.size,
    newSize: blob.size,
  };
}

export default function BulkQrCodePage() {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0, total: 0, currentFile: "", stage: "Adding QR",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);

  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [position, setPosition] = useState<QrPosition>("bottom-right");
  const [sizePercent, setSizePercent] = useState(12);
  const [opacity, setOpacity] = useState(1);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  };

  const handleProcess = async () => {
    if (!qrFile) return;
    setState("processing");

    const qrBitmap = await createImageBitmap(qrFile);
    const pad = Math.max(4, Math.round(sizePercent * 0.8));
    const processed: ProcessedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      setProgress({
        current: i + 1, total: files.length, currentFile: files[i].name, stage: "Adding QR",
      });
      const result = await applyQrCode(files[i], qrBitmap, {
        position, sizePercent, opacity, padding: pad,
      });
      processed.push(result);
    }

    qrBitmap.close();
    setResults(processed);
    setState("done");
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setState("upload");
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {state === "upload" && (
            <div className="text-center">
              <div className="text-center mb-6">
                <Image
                  src="/illustrations/tool-qr-code.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                Bulk QR Code on Photos
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Add your QR code to every listing photo in bulk. Link to your website, listing page, or virtual tour. Batch apply to 50+ photos.
              </p>
              <div className="mt-8">
                <PhotoDropzone onFiles={handleFiles} />
              </div>
            </div>
          )}

          {state === "configure" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-2xl">
                  {files.length} Photo{files.length !== 1 ? "s" : ""} Ready
                </h2>
                <button onClick={handleReset} className="text-sm text-gray-500 hover:text-primary">
                  Start Over
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Upload + Settings */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                    QR Code Image
                  </h3>

                  <input
                    ref={qrInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    className="hidden"
                  />

                  {qrPreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={qrPreview}
                        alt="QR Code"
                        className="w-24 h-24 rounded-lg object-contain border border-gray-200 bg-white p-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{qrFile?.name}</p>
                        <button
                          onClick={() => { setQrFile(null); setQrPreview(null); }}
                          className="text-xs text-gray-400 hover:text-red-500 mt-1"
                        >
                          Remove & upload different
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => qrInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 text-sm text-gray-400 hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      + Upload your QR code image (PNG/JPG)
                    </button>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["top-left", "top-right", "bottom-left", "bottom-right"] as QrPosition[]).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setPosition(pos)}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors capitalize ${
                            position === pos
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-200 text-gray-600 hover:border-primary/40"
                          }`}
                        >
                          {pos.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Size: {sizePercent}%
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={sizePercent}
                      onChange={(e) => setSizePercent(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Opacity: {Math.round(opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.3"
                      max="1"
                      step="0.05"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">
                    Preview
                  </h3>
                  <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                    {files[0]?.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(files[0])}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {qrPreview && (
                      <div
                        className="absolute"
                        style={{
                          width: `${sizePercent}%`,
                          opacity,
                          ...(position.includes("top") ? { top: "3%" } : { bottom: "3%" }),
                          ...(position.includes("left") ? { left: "3%" } : { right: "3%" }),
                        }}
                      >
                        <div className="bg-white p-1 rounded shadow-sm">
                          <img src={qrPreview} alt="QR" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleProcess}
                  disabled={!qrFile}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add QR to {files.length} Photo{files.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          )}

          {state === "processing" && <ProgressBar progress={progress} />}
          {state === "done" && <ResultsPanel images={results} onReset={handleReset} />}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Why Add a QR Code to Listing Photos?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              QR codes on listing photos make it effortless for potential buyers to access more information. Link to your property listing page, virtual tour, contact card, or website. When agents share photos on social media, email, or print materials, every viewer can scan the code instantly — turning passive scrollers into active leads.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/agent-branding-bar" className="text-primary font-semibold hover:underline">
              Want to add your name and phone too? Try our Agent Branding Bar &rarr;
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
