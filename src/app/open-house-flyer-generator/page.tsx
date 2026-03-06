"use client";

import { useState, useRef, useCallback } from "react";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
const faqItems = [
  {
    question: "What size is the flyer?",
    answer:
      "The flyer is generated at 2550x3300 pixels, which is equivalent to 8.5x11 inches at 300 DPI - perfect for printing at home or at a print shop.",
  },
  {
    question: "Can I use this for Just Listed or Price Reduced flyers?",
    answer:
      "Yes! The flyer headline is customizable - use 'Open House', 'Just Listed', 'Price Reduced', or any text you want. The clean design works for any listing announcement.",
  },
  {
    question: "Can I upload multiple photos at once?",
    answer:
      "Yes! Upload all your photos at once, then drag and drop to reorder them. The first photo is used as the large hero image, and up to 3 additional photos appear in a row below it.",
  },
  {
    question: "Can I customize the colors?",
    answer:
      "Yes! Choose a primary accent color that matches your branding. The header, price, and decorative elements will use your selected color.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. The entire flyer is generated locally in your browser using HTML5 Canvas. Your listing photos and information never leave your device.",
  },
];

export default function OpenHouseFlyerGeneratorPage() {
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [headline, setHeadline] = useState("OPEN HOUSE");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [accentColor, setAccentColor] = useState("#0165bf");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  const handleBulkUpload = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const newEntries = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newEntries]);
    setResultUrl(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleBulkUpload(e.dataTransfer.files);
      }
    },
    [handleBulkUpload]
  );

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
    setResultUrl(null);
  };

  // Drag-and-drop reorder
  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndexRef.current === null || dragIndexRef.current === index) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndexRef.current!, 1);
      next.splice(index, 0, moved);
      dragIndexRef.current = index;
      return next;
    });
    setResultUrl(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
  };

  const hasMainPhoto = photos.length > 0;

  // Cover-fit helper
  function coverFit(
    ctx: OffscreenCanvasRenderingContext2D,
    bm: ImageBitmap,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ) {
    const srcRatio = bm.width / bm.height;
    const dstRatio = dw / dh;
    let sx = 0, sy = 0, sw = bm.width, sh = bm.height;
    if (srcRatio > dstRatio) {
      sw = Math.round(bm.height * dstRatio);
      sx = Math.round((bm.width - sw) / 2);
    } else {
      sh = Math.round(bm.width / dstRatio);
      sy = Math.round((bm.height - sh) / 2);
    }
    ctx.drawImage(bm, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  const handleGenerate = async () => {
    if (!hasMainPhoto || !address) return;
    setGenerating(true);

    const W = 2550;
    const H = 3300;
    const canvas = new OffscreenCanvas(W, H);
    const ctx = canvas.getContext("2d")!;
    const pad = 80;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Accent header bar
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, W, 220);

    // Headline
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 80px 'DM Sans', Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(headline.toUpperCase(), W / 2, 110);

    // Main photo with rounded corners effect (just draw with small inset)
    const mainBitmap = await createImageBitmap(photos[0].file);
    const mainY = 260;
    const mainH = 1350;
    const mainW = W - pad * 2;
    coverFit(ctx, mainBitmap, pad, mainY, mainW, mainH);
    mainBitmap.close();

    // Accent line under main photo
    ctx.fillStyle = accentColor;
    ctx.fillRect(pad, mainY + mainH, mainW, 8);

    // Secondary photos row
    const secondaryPhotos = photos.slice(1, 4);
    const smallY = mainY + mainH + 28;
    if (secondaryPhotos.length > 0) {
      const smallH = 450;
      const gapSize = 20;
      const totalGap = (secondaryPhotos.length - 1) * gapSize;
      const smallW = (mainW - totalGap) / secondaryPhotos.length;

      for (let i = 0; i < secondaryPhotos.length; i++) {
        const bm = await createImageBitmap(secondaryPhotos[i].file);
        coverFit(ctx, bm, pad + i * (smallW + gapSize), smallY, smallW, smallH);
        bm.close();
      }
    }

    // Info section
    const infoY = secondaryPhotos.length > 0 ? smallY + 480 : smallY + 30;

    // Address
    ctx.fillStyle = "#0F172A";
    ctx.textAlign = "center";
    ctx.font = "bold 68px 'DM Sans', Inter, sans-serif";
    ctx.fillText(address, W / 2, infoY);

    // Price with accent color
    if (price) {
      ctx.fillStyle = accentColor;
      ctx.font = "bold 64px 'DM Sans', Inter, sans-serif";
      ctx.fillText(price, W / 2, infoY + 90);
    }

    // Details
    if (details) {
      ctx.fillStyle = "#64748B";
      ctx.font = "36px 'DM Sans', Inter, sans-serif";
      const words = details.split(" ");
      let line = "";
      let lineY = infoY + 170;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > W - 240 && line) {
          ctx.fillText(line.trim(), W / 2, lineY);
          line = word + " ";
          lineY += 50;
        } else {
          line = test;
        }
      }
      if (line.trim()) ctx.fillText(line.trim(), W / 2, lineY);
    }

    // Agent footer bar with accent color
    const footerH = 260;
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, H - footerH, W, footerH);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    if (agentName) {
      ctx.font = "bold 48px 'DM Sans', Inter, sans-serif";
      ctx.fillText(agentName, W / 2, H - footerH + 90);
    }
    const contactLine = [agentPhone, brokerage].filter(Boolean).join("  |  ");
    if (contactLine) {
      ctx.font = "32px 'DM Sans', Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(contactLine, W / 2, H - footerH + 160);
    }

    const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(blob);
    setResultUrl(URL.createObjectURL(blob));
    setGenerating(false);
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flyer-${address.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-center mb-6">
                <Image
                  src="/illustrations/tool-flyer.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
              Open House Flyer Generator
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Create a professional, print-ready listing flyer in 30 seconds. Upload photos, type your details, download and print. No Canva needed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Photos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                Listing Photos
              </h3>

              {/* Upload zone */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors bg-gray-50/50"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Icon icon="ph:plus-circle" className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  Click or drag & drop photos
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  First photo = hero, next 3 = secondary row
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleBulkUpload(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Photo strip - drag to reorder */}
              {photos.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-gray-500">
                      Drag to reorder - first = hero
                    </p>
                    <button
                      onClick={() => {
                        photos.forEach((p) => URL.revokeObjectURL(p.preview));
                        setPhotos([]);
                        setResultUrl(null);
                      }}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {photos.map((photo, i) => (
                      <div
                        key={photo.preview}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragEnd={handleDragEnd}
                        className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                          i === 0
                            ? "border-primary ring-2 ring-primary/20"
                            : i < 4
                              ? "border-primary/30"
                              : "border-gray-200 opacity-40"
                        }`}
                      >
                        <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-0.5 left-0.5 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                          {i === 0 ? "Hero" : i < 4 ? i + 1 : ""}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(i);
                          }}
                          className="absolute top-0.5 right-0.5 bg-black/60 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center hover:bg-red-500"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Flyer preview area */}
              {photos.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                  {/* Mini preview of layout */}
                  <div style={{ backgroundColor: accentColor }} className="h-8 flex items-center justify-center">
                    <span className="text-white text-xs font-bold tracking-wider">{headline}</span>
                  </div>
                  <div className="p-2">
                    <div className="aspect-[16/10] overflow-hidden rounded bg-gray-100 mb-1">
                      <img src={photos[0].preview} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                    {photos.length > 1 && (
                      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(photos.length - 1, 3)}, 1fr)` }}>
                        {photos.slice(1, 4).map((p, i) => (
                          <div key={i} className="aspect-[4/3] overflow-hidden rounded bg-gray-100">
                            <img src={p.preview} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="px-2 py-1.5 text-center">
                    <p className="text-xs font-bold text-gray-800 truncate">{address || "Property Address"}</p>
                    {price && <p className="text-[10px] font-bold" style={{ color: accentColor }}>{price}</p>}
                  </div>
                  <div style={{ backgroundColor: accentColor }} className="h-6 flex items-center justify-center">
                    <span className="text-white text-[9px]">{agentName || "Agent Name"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                Listing Details
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Headline</label>
                <select
                  value={headline}
                  onChange={(e) => { setHeadline(e.target.value); setResultUrl(null); }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option>OPEN HOUSE</option>
                  <option>JUST LISTED</option>
                  <option>PRICE REDUCED</option>
                  <option>FOR SALE</option>
                  <option>NEW LISTING</option>
                  <option>COMING SOON</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Property Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setResultUrl(null); }}
                  placeholder="123 Main Street, Anytown, CA"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); setResultUrl(null); }}
                  placeholder="$549,000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Details (beds, baths, sqft, etc.)</label>
                <textarea
                  value={details}
                  onChange={(e) => { setDetails(e.target.value); setResultUrl(null); }}
                  placeholder="4 Bed | 3 Bath | 2,400 sqft | 2-Car Garage | Updated Kitchen | Saturday 1-4 PM"
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Accent color picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => { setAccentColor(e.target.value); setResultUrl(null); }}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <div className="flex gap-1.5">
                    {["#0165bf", "#0F172A", "#059669", "#DC2626", "#7C3AED", "#D97706"].map((c) => (
                      <button
                        key={c}
                        onClick={() => { setAccentColor(c); setResultUrl(null); }}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          accentColor === c ? "border-gray-800 scale-110" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => { setAgentName(e.target.value); setResultUrl(null); }}
                  placeholder="Jane Smith, Realtor"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={agentPhone}
                    onChange={(e) => { setAgentPhone(e.target.value); setResultUrl(null); }}
                    placeholder="(555) 123-4567"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Brokerage</label>
                  <input
                    type="text"
                    value={brokerage}
                    onChange={(e) => { setBrokerage(e.target.value); setResultUrl(null); }}
                    placeholder="Keller Williams"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8">
            {!resultUrl ? (
              <button
                onClick={handleGenerate}
                disabled={!hasMainPhoto || !address || generating}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating ? "Generating..." : "Generate Flyer"}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 bg-success text-white font-bold rounded-lg hover:bg-success-dark transition-colors text-base sm:text-lg"
                >
                  Download Flyer (Print-Ready JPG)
                </button>
                <button
                  onClick={() => {
                    setResultUrl(null);
                    setResultBlob(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Result Preview */}
          {resultUrl && (
            <div className="mt-8 rounded-xl overflow-hidden border border-border-light shadow-lg max-w-md mx-auto">
              <img src={resultUrl} alt="Generated flyer" className="w-full" />
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Create Open House Flyers Without Canva
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Every open house needs a professional flyer - but designing one shouldn&apos;t take 30 minutes in Canva. This tool generates a clean, print-ready listing flyer in seconds. Upload all your photos at once, drag to reorder, customize colors, and download a beautiful 8.5x11 flyer ready for printing.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/listing-status-overlays" className="text-primary font-semibold hover:underline">
              Need Just Listed or Just Sold overlays for social media? Try our Status Ribbon tool &rarr;
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
