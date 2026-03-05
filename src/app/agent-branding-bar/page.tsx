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
type BarPosition = "bottom" | "top";
type BarStyle = "dark" | "light" | "brand";

const faqItems = [
  {
    question: "What information can I put on the branding bar?",
    answer:
      "You can add your name, phone number, email, brokerage name, website URL, a profile photo (headshot), and a QR code. All fields except agent name are optional.",
  },
  {
    question: "Can I add my headshot or logo?",
    answer:
      "Yes! You can upload a profile photo that appears as a circle on the left side of the branding bar. You can also upload a QR code image that appears on the right side, perfect for linking to your website or listing page.",
  },
  {
    question: "Will this affect MLS compliance?",
    answer:
      "Adding agent branding to listing photos is a standard real estate marketing practice. However, some MLS systems have rules about branding on uploaded photos. We recommend using branded photos for social media and marketing, and clean photos for MLS uploads.",
  },
  {
    question: "Can I batch-apply the branding bar?",
    answer:
      "Yes! Upload up to 50 listing photos and the branding bar is applied to all of them at once. Download everything as a ZIP file.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. All branding is applied locally in your browser using HTML5 Canvas. Your listing photos and personal information never leave your device.",
  },
];

function drawCircleImage(
  ctx: OffscreenCanvasRenderingContext2D,
  img: ImageBitmap,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
}

async function applyBrandingBar(
  file: File,
  config: {
    agentName: string;
    phone: string;
    brokerage: string;
    website: string;
    position: BarPosition;
    style: BarStyle;
    brandColor: string;
    profileBitmap: ImageBitmap | null;
    qrBitmap: ImageBitmap | null;
  }
): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file);
  const barHeight = Math.max(60, Math.round(bitmap.height * 0.08));
  const totalH = bitmap.height + barHeight;

  const canvas = new OffscreenCanvas(bitmap.width, totalH);
  const ctx = canvas.getContext("2d")!;

  // Draw photo
  const photoY = config.position === "top" ? barHeight : 0;
  ctx.drawImage(bitmap, 0, photoY);

  // Draw bar background
  const barY = config.position === "top" ? 0 : bitmap.height;
  if (config.style === "dark") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  } else if (config.style === "light") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  } else {
    ctx.fillStyle = config.brandColor;
  }
  ctx.fillRect(0, barY, bitmap.width, barHeight);

  // Text styling
  const textColor = config.style === "light" ? "#1E293B" : "#FFFFFF";
  const subTextColor = config.style === "light" ? "#64748B" : "rgba(255,255,255,0.8)";
  const fontSize = Math.max(14, Math.round(barHeight * 0.32));
  const smallFontSize = Math.max(11, Math.round(barHeight * 0.22));
  const padding = Math.round(bitmap.width * 0.02);
  const avatarSize = Math.round(barHeight * 0.7);
  const avatarMargin = Math.round(barHeight * 0.15);

  // Profile photo (left side, circular)
  let textStartX = padding;
  if (config.profileBitmap) {
    const avatarX = padding;
    const avatarY = barY + avatarMargin;
    drawCircleImage(ctx, config.profileBitmap, avatarX, avatarY, avatarSize);
    textStartX = padding + avatarSize + Math.round(padding * 0.8);
  }

  // QR code (right side)
  let rightEdge = bitmap.width - padding;
  if (config.qrBitmap) {
    const qrSize = Math.round(barHeight * 0.75);
    const qrX = bitmap.width - padding - qrSize;
    const qrY = barY + Math.round((barHeight - qrSize) / 2);
    // White background for QR readability
    ctx.fillStyle = "#FFFFFF";
    const qrPad = Math.round(qrSize * 0.06);
    ctx.fillRect(qrX - qrPad, qrY - qrPad, qrSize + qrPad * 2, qrSize + qrPad * 2);
    ctx.drawImage(config.qrBitmap, qrX, qrY, qrSize, qrSize);
    rightEdge = qrX - padding;
  }

  // Agent name (left side, after avatar)
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px 'DM Sans', Inter, sans-serif`;
  ctx.textBaseline = "middle";
  const nameY = barY + barHeight * 0.38;
  ctx.fillText(config.agentName, textStartX, nameY);

  // Brokerage (below name)
  if (config.brokerage) {
    ctx.fillStyle = subTextColor;
    ctx.font = `${smallFontSize}px 'DM Sans', Inter, sans-serif`;
    ctx.fillText(config.brokerage, textStartX, barY + barHeight * 0.7);
  }

  // Phone & website (right side, before QR)
  ctx.textBaseline = "middle";
  const rightInfo = [config.phone, config.website].filter(Boolean);
  ctx.fillStyle = textColor;
  ctx.font = `${smallFontSize}px 'DM Sans', Inter, sans-serif`;
  rightInfo.forEach((text, i) => {
    const w = ctx.measureText(text).width;
    const x = rightEdge - w;
    const y = barY + barHeight * (rightInfo.length === 1 ? 0.5 : 0.35 + i * 0.3);
    ctx.fillText(text, x, y);
  });

  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  const baseName = file.name.replace(/\.[^.]+$/, "");

  return {
    originalName: file.name,
    newName: `${baseName}-branded.jpg`,
    blob,
    width: canvas.width,
    height: totalH,
    originalSize: file.size,
    newSize: blob.size,
  };
}

export default function AgentBrandingBarPage() {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0, total: 0, currentFile: "", stage: "Branding",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);

  // Config
  const [agentName, setAgentName] = useState("");
  const [phone, setPhone] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [website, setWebsite] = useState("");
  const [position, setPosition] = useState<BarPosition>("bottom");
  const [barStyle, setBarStyle] = useState<BarStyle>("dark");
  const [brandColor, setBrandColor] = useState("#0165bf");

  // Profile photo
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // QR code
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  };

  const handleProcess = async () => {
    if (!agentName.trim()) return;
    setState("processing");

    // Pre-load profile and QR bitmaps once
    let profileBitmap: ImageBitmap | null = null;
    let qrBitmap: ImageBitmap | null = null;
    if (profileFile) profileBitmap = await createImageBitmap(profileFile);
    if (qrFile) qrBitmap = await createImageBitmap(qrFile);

    const processed: ProcessedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({
        current: i + 1, total: files.length, currentFile: files[i].name, stage: "Branding",
      });
      const result = await applyBrandingBar(files[i], {
        agentName, phone, brokerage, website, position, style: barStyle, brandColor,
        profileBitmap, qrBitmap,
      });
      processed.push(result);
    }

    if (profileBitmap) profileBitmap.close();
    if (qrBitmap) qrBitmap.close();

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
                  src="/illustrations/tool-branding-bar.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                Agent Branding Bar
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Add your name, phone, brokerage, profile photo, and QR code to every listing photo in seconds. Professional branding bar - batch apply to 50+ photos.
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
                {/* Agent Info */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">
                    Your Information
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name *</label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="Jane Smith, Realtor"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Brokerage</label>
                    <input
                      type="text"
                      value={brokerage}
                      onChange={(e) => setBrokerage(e.target.value)}
                      placeholder="Keller Williams Realty"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="www.janesmith.com"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Profile Photo & QR Code */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profile Photo</label>
                      <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileUpload}
                        className="hidden"
                      />
                      {profilePreview ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={profilePreview}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                          />
                          <button
                            onClick={() => {
                              setProfileFile(null);
                              setProfilePreview(null);
                            }}
                            className="text-xs text-gray-400 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => profileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-xs text-gray-400 hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          + Upload headshot
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">QR Code</label>
                      <input
                        ref={qrInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleQrUpload}
                        className="hidden"
                      />
                      {qrPreview ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={qrPreview}
                            alt="QR Code"
                            className="w-12 h-12 rounded object-contain border border-gray-200 bg-white"
                          />
                          <button
                            onClick={() => {
                              setQrFile(null);
                              setQrPreview(null);
                            }}
                            className="text-xs text-gray-400 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => qrInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-xs text-gray-400 hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          + Upload QR code
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Style Options */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">
                    Bar Style
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                    <div className="flex gap-2">
                      {(["bottom", "top"] as BarPosition[]).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setPosition(pos)}
                          className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors capitalize ${
                            position === pos
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-200 text-gray-600 hover:border-primary/40"
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Color Theme</label>
                    <div className="flex gap-2">
                      {([
                        { style: "dark" as BarStyle, label: "Dark" },
                        { style: "light" as BarStyle, label: "Light" },
                        { style: "brand" as BarStyle, label: "Brand" },
                      ]).map(({ style, label }) => (
                        <button
                          key={style}
                          onClick={() => setBarStyle(style)}
                          className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            barStyle === style
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-200 text-gray-600 hover:border-primary/40"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {barStyle === "brand" && (
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Brand Color:</label>
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                    </div>
                  )}

                  {/* Preview */}
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      {position === "top" && (
                        <div
                          className="px-3 py-2 flex items-center justify-between"
                          style={{
                            backgroundColor:
                              barStyle === "dark" ? "rgba(0,0,0,0.85)"
                              : barStyle === "light" ? "rgba(255,255,255,0.92)"
                              : brandColor,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {profilePreview && (
                              <img src={profilePreview} alt="" className="w-8 h-8 rounded-full object-cover" />
                            )}
                            <div>
                              <p className={`text-sm font-bold ${barStyle === "light" ? "text-gray-800" : "text-white"}`}>
                                {agentName || "Your Name"}
                              </p>
                              <p className={`text-xs ${barStyle === "light" ? "text-gray-500" : "text-white/70"}`}>
                                {brokerage || "Your Brokerage"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className={`text-xs ${barStyle === "light" ? "text-gray-700" : "text-white"}`}>
                                {phone || "(555) 123-4567"}
                              </p>
                              <p className={`text-xs ${barStyle === "light" ? "text-gray-700" : "text-white"}`}>
                                {website || "www.yoursite.com"}
                              </p>
                            </div>
                            {qrPreview && (
                              <img src={qrPreview} alt="" className="w-8 h-8 rounded bg-white p-0.5 object-contain" />
                            )}
                          </div>
                        </div>
                      )}
                      <div className="bg-gray-200 h-24 flex items-center justify-center text-xs text-gray-400">
                        Photo Preview
                      </div>
                      {position === "bottom" && (
                        <div
                          className="px-3 py-2 flex items-center justify-between"
                          style={{
                            backgroundColor:
                              barStyle === "dark" ? "rgba(0,0,0,0.85)"
                              : barStyle === "light" ? "rgba(255,255,255,0.92)"
                              : brandColor,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {profilePreview && (
                              <img src={profilePreview} alt="" className="w-8 h-8 rounded-full object-cover" />
                            )}
                            <div>
                              <p className={`text-sm font-bold ${barStyle === "light" ? "text-gray-800" : "text-white"}`}>
                                {agentName || "Your Name"}
                              </p>
                              <p className={`text-xs ${barStyle === "light" ? "text-gray-500" : "text-white/70"}`}>
                                {brokerage || "Your Brokerage"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className={`text-xs ${barStyle === "light" ? "text-gray-700" : "text-white"}`}>
                                {phone || "(555) 123-4567"}
                              </p>
                              <p className={`text-xs ${barStyle === "light" ? "text-gray-700" : "text-white"}`}>
                                {website || "www.yoursite.com"}
                              </p>
                            </div>
                            {qrPreview && (
                              <img src={qrPreview} alt="" className="w-8 h-8 rounded bg-white p-0.5 object-contain" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleProcess}
                  disabled={!agentName.trim()}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Brand {files.length} Photo{files.length !== 1 ? "s" : ""}
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
              Brand Your Listing Photos in Seconds
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Every listing photo you share on social media, email, or your website is a branding opportunity. Instead of manually adding your info in Canva or Photoshop, this tool lets you batch-apply a professional branding bar to all your listing photos at once. Your name, phone, brokerage, profile photo, and QR code are displayed in a clean bar - ensuring every viewer knows how to reach you.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/batch-watermark-photos" className="text-primary font-semibold hover:underline">
              Need a text watermark instead? Try our Batch Watermark tool &rarr;
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
