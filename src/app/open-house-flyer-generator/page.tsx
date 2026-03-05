"use client";

import { useState, useRef } from "react";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";

const faqItems = [
  {
    question: "What size is the flyer?",
    answer:
      "The flyer is generated at 2550x3300 pixels, which is equivalent to 8.5x11 inches at 300 DPI — perfect for printing at home or at a print shop.",
  },
  {
    question: "Can I use this for Just Listed or Price Reduced flyers?",
    answer:
      "Yes! The flyer headline is customizable — use 'Open House', 'Just Listed', 'Price Reduced', or any text you want. The clean design works for any listing announcement.",
  },
  {
    question: "Do I need Canva or Photoshop?",
    answer:
      "No! This tool generates a complete, professional flyer right in your browser. No design skills needed, no accounts to create, and no software to install.",
  },
  {
    question: "Can I download it as a PDF?",
    answer:
      "The flyer downloads as a high-resolution JPG image (300 DPI equivalent). You can print it directly or insert it into a PDF using any free PDF tool. JPG format ensures maximum compatibility.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. The entire flyer is generated locally in your browser using HTML5 Canvas. Your listing photos and information never leave your device.",
  },
];

export default function OpenHouseFlyerGeneratorPage() {
  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);
  const [headline, setHeadline] = useState("OPEN HOUSE");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhotoSelect = (index: number, file: File) => {
    const url = URL.createObjectURL(file);
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    setPreviews((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!);
      next[index] = url;
      return next;
    });
    setResultUrl(null);
  };

  const hasMainPhoto = photos[0] !== null;

  const handleGenerate = async () => {
    if (!hasMainPhoto || !address) return;
    setGenerating(true);

    const W = 2550;
    const H = 3300;
    const canvas = new OffscreenCanvas(W, H);
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Header bar
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, W, 200);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 80px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(headline.toUpperCase(), W / 2, 135);

    // Main photo
    const mainBitmap = await createImageBitmap(photos[0]!);
    const mainH = 1400;
    const mainY = 230;
    // Cover-fit
    const mainRatio = mainBitmap.width / mainBitmap.height;
    const targetRatio = W / mainH;
    let sx = 0, sy = 0, sw = mainBitmap.width, sh = mainBitmap.height;
    if (mainRatio > targetRatio) {
      sw = Math.round(mainBitmap.height * targetRatio);
      sx = Math.round((mainBitmap.width - sw) / 2);
    } else {
      sh = Math.round(mainBitmap.width / targetRatio);
      sy = Math.round((mainBitmap.height - sh) / 2);
    }
    ctx.drawImage(mainBitmap, sx, sy, sw, sh, 60, mainY, W - 120, mainH);
    mainBitmap.close();

    // Small photos row
    const smallPhotos = photos.slice(1).filter(Boolean) as File[];
    if (smallPhotos.length > 0) {
      const smallY = mainY + mainH + 20;
      const smallH = 500;
      const gap = 20;
      const totalGap = (smallPhotos.length - 1) * gap;
      const smallW = (W - 120 - totalGap) / smallPhotos.length;

      for (let i = 0; i < smallPhotos.length; i++) {
        const bm = await createImageBitmap(smallPhotos[i]);
        const sr = bm.width / bm.height;
        const tr = smallW / smallH;
        let ssx = 0, ssy = 0, ssw = bm.width, ssh = bm.height;
        if (sr > tr) {
          ssw = Math.round(bm.height * tr);
          ssx = Math.round((bm.width - ssw) / 2);
        } else {
          ssh = Math.round(bm.width / tr);
          ssy = Math.round((bm.height - ssh) / 2);
        }
        ctx.drawImage(bm, ssx, ssy, ssw, ssh, 60 + i * (smallW + gap), smallY, smallW, smallH);
        bm.close();
      }
    }

    // Info section
    const infoY = 2200;
    ctx.fillStyle = "#0F172A";
    ctx.textAlign = "center";
    ctx.font = "bold 72px Inter, sans-serif";
    ctx.fillText(address, W / 2, infoY);

    if (price) {
      ctx.fillStyle = "#2563EB";
      ctx.font = "bold 64px Inter, sans-serif";
      ctx.fillText(price, W / 2, infoY + 90);
    }

    if (details) {
      ctx.fillStyle = "#64748B";
      ctx.font = "36px Inter, sans-serif";
      // Word wrap
      const words = details.split(" ");
      let line = "";
      let lineY = infoY + 170;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > W - 200 && line) {
          ctx.fillText(line.trim(), W / 2, lineY);
          line = word + " ";
          lineY += 50;
        } else {
          line = test;
        }
      }
      if (line.trim()) ctx.fillText(line.trim(), W / 2, lineY);
    }

    // Agent footer
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, H - 280, W, 280);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    if (agentName) {
      ctx.font = "bold 48px Inter, sans-serif";
      ctx.fillText(agentName, W / 2, H - 180);
    }
    const contactLine = [agentPhone, brokerage].filter(Boolean).join("  |  ");
    if (contactLine) {
      ctx.font = "32px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillText(contactLine, W / 2, H - 110);
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
    a.download = `open-house-flyer-${address.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}.jpg`;
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

              {/* Main photo */}
              <div
                onClick={() => fileInputRefs.current[0]?.click()}
                className="relative aspect-[16/10] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors bg-gray-50 flex items-center justify-center"
              >
                {previews[0] ? (
                  <img src={previews[0]} alt="Main photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <p className="text-sm text-gray-500 font-medium">Main Exterior Photo *</p>
                  </div>
                )}
                <input
                  ref={(el) => { fileInputRefs.current[0] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePhotoSelect(0, e.target.files[0])}
                />
              </div>

              {/* Small photos */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    onClick={() => fileInputRefs.current[i]?.click()}
                    className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors bg-gray-50 flex items-center justify-center"
                  >
                    {previews[i] ? (
                      <img src={previews[i]!} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-6 h-6 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <p className="text-xs text-gray-400 mt-1">Optional</p>
                      </div>
                    )}
                    <input
                      ref={(el) => { fileInputRefs.current[i] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handlePhotoSelect(i, e.target.files[0])}
                    />
                  </div>
                ))}
              </div>
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
                  onChange={(e) => setHeadline(e.target.value)}
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
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street, Anytown, CA"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="$549,000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Details (beds, baths, sqft, etc.)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="4 Bed | 3 Bath | 2,400 sqft | 2-Car Garage | Updated Kitchen | Saturday 1-4 PM"
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <hr className="border-gray-200" />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
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
                    onChange={(e) => setAgentPhone(e.target.value)}
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
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 bg-success text-white font-bold rounded-lg hover:bg-success-dark transition-colors text-lg"
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
              Every open house needs a professional flyer — but designing one shouldn&apos;t take 30 minutes in Canva. This tool generates a clean, print-ready listing flyer in seconds. Just upload your best photos, type the address and price, and download a beautiful 8.5x11 flyer ready for printing. No account needed, no templates to browse, no design skills required.
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
