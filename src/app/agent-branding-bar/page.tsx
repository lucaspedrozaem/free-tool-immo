"use client";

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
      "You can add your name, phone number, email, brokerage name, and website URL. The bar displays this contact info in a clean, professional layout at the bottom or top of each listing photo.",
  },
  {
    question: "Can I add my headshot or logo?",
    answer:
      "Logo upload is coming soon. Currently the tool supports text-based branding with your name, phone, and brokerage. This ensures the bar stays clean and legible on any photo.",
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

  // Agent name (left side)
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  ctx.textBaseline = "middle";
  const nameY = barY + barHeight * 0.38;
  ctx.fillText(config.agentName, padding, nameY);

  // Brokerage (below name)
  if (config.brokerage) {
    ctx.fillStyle = subTextColor;
    ctx.font = `${smallFontSize}px Inter, sans-serif`;
    ctx.fillText(config.brokerage, padding, barY + barHeight * 0.7);
  }

  // Phone & website (right side)
  ctx.textBaseline = "middle";
  const rightInfo = [config.phone, config.website].filter(Boolean);
  ctx.fillStyle = textColor;
  ctx.font = `${smallFontSize}px Inter, sans-serif`;
  rightInfo.forEach((text, i) => {
    const w = ctx.measureText(text).width;
    const x = bitmap.width - padding - w;
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
    width: bitmap.width,
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
  const [brandColor, setBrandColor] = useState("#2563EB");

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  }, []);

  const handleProcess = async () => {
    if (!agentName.trim()) return;
    setState("processing");
    const processed: ProcessedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({
        current: i + 1, total: files.length, currentFile: files[i].name, stage: "Branding",
      });
      const result = await applyBrandingBar(files[i], {
        agentName, phone, brokerage, website, position, style: barStyle, brandColor,
      });
      processed.push(result);
    }
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
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                Agent Branding Bar
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Add your name, phone, and brokerage to every listing photo in seconds. Professional branding bar — batch apply to 50+ photos.
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
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                    <div className="bg-gray-200 h-24 flex items-center justify-center text-xs text-gray-400">
                      Photo Preview
                    </div>
                    <div
                      className="px-3 py-2 flex items-center justify-between"
                      style={{
                        backgroundColor:
                          barStyle === "dark" ? "rgba(0,0,0,0.85)"
                          : barStyle === "light" ? "rgba(255,255,255,0.92)"
                          : brandColor,
                      }}
                    >
                      <div>
                        <p className={`text-sm font-bold ${barStyle === "light" ? "text-gray-800" : "text-white"}`}>
                          {agentName || "Your Name"}
                        </p>
                        <p className={`text-xs ${barStyle === "light" ? "text-gray-500" : "text-white/70"}`}>
                          {brokerage || "Your Brokerage"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${barStyle === "light" ? "text-gray-700" : "text-white"}`}>
                          {phone || "(555) 123-4567"}
                        </p>
                        <p className={`text-xs ${barStyle === "light" ? "text-gray-700" : "text-white"}`}>
                          {website || "www.yoursite.com"}
                        </p>
                      </div>
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
              Every listing photo you share on social media, email, or your website is a branding opportunity. Instead of manually adding your info in Canva or Photoshop, this tool lets you batch-apply a professional branding bar to all your listing photos at once. Your name, phone, brokerage, and website are displayed in a clean bar at the bottom of each photo — ensuring every viewer knows how to reach you.
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
