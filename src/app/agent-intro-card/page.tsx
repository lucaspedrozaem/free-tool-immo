"use client";

import { useState, useRef } from "react";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import Image from "next/image";
import {
  createRuntimeCanvas,
  decodeImageWithFallback,
  getRuntime2DContext,
  runtimeCanvasToBlob,
} from "@/lib/canvas-runtime";
type CardStyle = "dark" | "light" | "brand";

const faqItems = [
  {
    question: "What is an agent intro/outro card?",
    answer:
      "An intro/outro card is a professional contact slide used at the beginning or end of listing photo slideshows, virtual tours, and video walkthroughs. It displays your headshot, name, phone, brokerage, and website - so viewers always know how to contact you.",
  },
  {
    question: "What sizes are available?",
    answer:
      "Cards are generated at 1920x1080 (16:9 landscape) - perfect for video intros, slideshows, MLS photo sets, and social media. The high resolution ensures crisp quality on any screen.",
  },
  {
    question: "Can I add my headshot and brokerage logo?",
    answer:
      "Yes! Upload a headshot photo that appears on the right side of the card, and optionally a brokerage logo that appears at the bottom left. Both are optional - the card looks professional with or without them.",
  },
  {
    question: "Can I customize the colors?",
    answer:
      "Yes! Choose between dark, light, or custom brand color backgrounds. You can also set an accent color for your phone number and decorative elements to match your personal branding.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. The card is generated entirely in your browser using HTML5 Canvas. Your headshot, logo, and personal information never leave your device.",
  },
];

export default function AgentIntroCardPage() {
  const [agentName, setAgentName] = useState("");
  const [tagline, setTagline] = useState("FOR MORE INFORMATION CONTACT");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [brokerageName, setBrokerageName] = useState("");
  const [cardStyle, setCardStyle] = useState<CardStyle>("dark");
  const [bgColor, setBgColor] = useState("#0F172A");
  const [accentColor, setAccentColor] = useState("#E91E8C");

  // Headshot
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null);
  const headshotRef = useRef<HTMLInputElement>(null);

  // Brokerage logo
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleHeadshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeadshotFile(file);
    setHeadshotPreview(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const getBgColor = () => {
    if (cardStyle === "dark") return "#0F172A";
    if (cardStyle === "light") return "#F8FAFC";
    return bgColor;
  };

  const getTextColor = () => {
    return cardStyle === "light" ? "#0F172A" : "#FFFFFF";
  };

  const getSubTextColor = () => {
    return cardStyle === "light" ? "#64748B" : "rgba(255,255,255,0.7)";
  };

  const handleGenerate = async () => {
    if (!agentName) return;
    setGenerating(true);

    const W = 1920;
    const H = 1080;
    const canvas = createRuntimeCanvas(W, H);
    const ctx = getRuntime2DContext(canvas);

    const bg = getBgColor();
    const textCol = getTextColor();
    const subCol = getSubTextColor();

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Headshot on the right side
    if (headshotFile) {
      const headshotImage = await decodeImageWithFallback(headshotFile, headshotFile.name);
      // Draw headshot on right ~40% of card, bottom-aligned
      const hsW = Math.round(W * 0.38);
      const hsH = H;
      const hsX = W - hsW;

      // Cover-fit bottom-aligned
      const srcRatio = headshotImage.width / headshotImage.height;
      const dstRatio = hsW / hsH;
      let sx = 0, sy = 0, sw = headshotImage.width, sh = headshotImage.height;
      if (srcRatio > dstRatio) {
        sw = Math.round(headshotImage.height * dstRatio);
        sx = Math.round((headshotImage.width - sw) / 2);
      } else {
        sh = Math.round(headshotImage.width / dstRatio);
        sy = 0; // top-aligned to show face
      }
      ctx.drawImage(headshotImage.source, sx, sy, sw, sh, hsX, 0, hsW, hsH);

      // Subtle gradient fade from bg into headshot
      const grad = ctx.createLinearGradient(hsX - 100, 0, hsX + 80, 0);
      grad.addColorStop(0, bg);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(hsX - 100, 0, 200, H);

      headshotImage.close();
    }

    // Left side content
    const leftPad = 120;
    const contentMaxW = W * 0.55;

    // Tagline
    ctx.fillStyle = subCol;
    ctx.font = `500 28px 'DM Sans', Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "3px";
    ctx.fillText(tagline.toUpperCase(), leftPad, 280);
    ctx.letterSpacing = "0px";

    // Agent name
    ctx.fillStyle = textCol;
    ctx.font = `bold 56px 'DM Sans', Inter, sans-serif`;
    ctx.fillText(agentName.toUpperCase(), leftPad, 360);

    // Phone in accent color (big)
    if (phone) {
      ctx.fillStyle = accentColor;
      ctx.font = `bold 52px 'DM Sans', Inter, sans-serif`;
      ctx.fillText(phone, leftPad, 445);
    }

    // Email
    let infoY = 530;
    if (email) {
      ctx.fillStyle = subCol;
      ctx.font = `28px 'DM Sans', Inter, sans-serif`;
      ctx.fillText(email, leftPad, infoY);
      infoY += 45;
    }

    // Website
    if (website) {
      ctx.fillStyle = subCol;
      ctx.font = `28px 'DM Sans', Inter, sans-serif`;
      ctx.fillText(website, leftPad, infoY);
    }

    // Brokerage section (bottom left)
    if (logoFile) {
      const logoImage = await decodeImageWithFallback(logoFile, logoFile.name);
      const logoMaxH = 120;
      const logoMaxW = 400;
      const scale = Math.min(logoMaxW / logoImage.width, logoMaxH / logoImage.height);
      const lw = Math.round(logoImage.width * scale);
      const lh = Math.round(logoImage.height * scale);
      ctx.drawImage(logoImage.source, leftPad, H - 60 - lh, lw, lh);

      if (brokerageName) {
        ctx.fillStyle = subCol;
        ctx.font = `22px 'DM Sans', Inter, sans-serif`;
        ctx.fillText(brokerageName, leftPad + lw + 20, H - 60 - lh / 2 + 4);
      }
      logoImage.close();
    } else if (brokerageName) {
      ctx.fillStyle = textCol;
      ctx.font = `bold 48px 'DM Sans', Inter, sans-serif`;
      ctx.fillText(brokerageName, leftPad, H - 140);
      if (website && !email) {
        // Already shown above
      }
    }

    // Accent line
    ctx.fillStyle = accentColor;
    ctx.fillRect(leftPad, H - 50, 200, 4);

    const blob = await runtimeCanvasToBlob(canvas, { type: "image/jpeg", quality: 0.95 });
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
    a.download = `agent-card-${agentName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}.jpg`;
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
                  src="/illustrations/tool-intro-card.jpg"
                  alt=""
                  width={320}
                  height={240}
                  className="mx-auto rounded-2xl"
                  priority
                />
              </div>
              
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
              Agent Intro / Outro Card
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Create a professional contact card for listing slideshows, video intros, and social media. Your headshot, details, and branding - in one stunning card.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Agent Details */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                  Your Details
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => { setTagline(e.target.value); setResultUrl(null); }}
                    placeholder="FOR MORE INFORMATION CONTACT"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name *</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => { setAgentName(e.target.value); setResultUrl(null); }}
                    placeholder="James Holvander"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setResultUrl(null); }}
                    placeholder="0411 330 208"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setResultUrl(null); }}
                    placeholder="james@meridienrealty.com.au"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => { setWebsite(e.target.value); setResultUrl(null); }}
                    placeholder="meridienrealty.com.au"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Brokerage Name</label>
                  <input
                    type="text"
                    value={brokerageName}
                    onChange={(e) => { setBrokerageName(e.target.value); setResultUrl(null); }}
                    placeholder="Meridien"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Headshot + Logo uploads */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Headshot Photo</label>
                    <input ref={headshotRef} type="file" accept="image/*" onChange={handleHeadshotUpload} className="hidden" />
                    {headshotPreview ? (
                      <div className="flex items-center gap-2">
                        <img src={headshotPreview} alt="Headshot" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                        <button onClick={() => { setHeadshotFile(null); setHeadshotPreview(null); setResultUrl(null); }} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                      </div>
                    ) : (
                      <button onClick={() => headshotRef.current?.click()} className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-xs text-gray-400 hover:border-primary/40 hover:text-primary transition-colors">
                        + Upload headshot
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brokerage Logo</label>
                    <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    {logoPreview ? (
                      <div className="flex items-center gap-2">
                        <img src={logoPreview} alt="Logo" className="w-14 h-14 rounded-lg object-contain border border-gray-200 bg-white p-1" />
                        <button onClick={() => { setLogoFile(null); setLogoPreview(null); setResultUrl(null); }} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                      </div>
                    ) : (
                      <button onClick={() => logoRef.current?.click()} className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-xs text-gray-400 hover:border-primary/40 hover:text-primary transition-colors">
                        + Upload logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Style + Preview */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                  Card Style
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background</label>
                  <div className="flex gap-2">
                    {(["dark", "light", "brand"] as CardStyle[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setCardStyle(s); setResultUrl(null); }}
                        className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors capitalize ${
                          cardStyle === s
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-600 hover:border-primary/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {cardStyle === "brand" && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700">Background:</label>
                    <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setResultUrl(null); }} className="w-10 h-10 rounded cursor-pointer border border-gray-300" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color (phone, decorations)</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={accentColor} onChange={(e) => { setAccentColor(e.target.value); setResultUrl(null); }} className="w-10 h-10 rounded cursor-pointer border border-gray-300" />
                    <div className="flex gap-1.5">
                      {["#E91E8C", "#FFD700", "#0165bf", "#10B981", "#DC2626", "#FFFFFF"].map((c) => (
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

                {/* Live Preview */}
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                  <div
                    className="aspect-[16/9] rounded-lg overflow-hidden relative"
                    style={{ backgroundColor: getBgColor() }}
                  >
                    {/* Headshot right side */}
                    {headshotPreview && (
                      <>
                        <img
                          src={headshotPreview}
                          alt=""
                          className="absolute right-0 top-0 h-full w-[38%] object-cover object-top"
                        />
                        <div
                          className="absolute right-[28%] top-0 h-full w-[15%]"
                          style={{ background: `linear-gradient(to right, ${getBgColor()}, transparent)` }}
                        />
                      </>
                    )}
                    {/* Text content */}
                    <div className="absolute left-[7%] top-[22%] max-w-[55%]">
                      <p className="text-[8px] tracking-widest" style={{ color: getSubTextColor() }}>
                        {tagline || "FOR MORE INFORMATION CONTACT"}
                      </p>
                      <p className="text-sm font-bold mt-1" style={{ color: getTextColor() }}>
                        {agentName ? agentName.toUpperCase() : "AGENT NAME"}
                      </p>
                      {(phone || true) && (
                        <p className="text-sm font-bold mt-0.5" style={{ color: accentColor }}>
                          {phone || "0411 330 208"}
                        </p>
                      )}
                      {email && (
                        <p className="text-[7px] mt-1" style={{ color: getSubTextColor() }}>{email}</p>
                      )}
                      {website && (
                        <p className="text-[7px]" style={{ color: getSubTextColor() }}>{website}</p>
                      )}
                    </div>
                    {/* Brokerage bottom left */}
                    <div className="absolute left-[7%] bottom-[8%]">
                      {logoPreview ? (
                        <img src={logoPreview} alt="" className="h-6 object-contain" />
                      ) : brokerageName ? (
                        <p className="text-xs font-bold" style={{ color: getTextColor() }}>{brokerageName}</p>
                      ) : null}
                    </div>
                    {/* Accent line */}
                    <div className="absolute left-[7%] bottom-[5%] w-[12%] h-0.5" style={{ backgroundColor: accentColor }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate */}
          <div className="mt-8">
            {!resultUrl ? (
              <button
                onClick={handleGenerate}
                disabled={!agentName || generating}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating ? "Generating..." : "Generate Card"}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 bg-success text-white font-bold rounded-lg hover:bg-success-dark transition-colors text-base sm:text-lg"
                >
                  Download Card (1920x1080 JPG)
                </button>
                <button
                  onClick={() => { setResultUrl(null); setResultBlob(null); }}
                  className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {resultUrl && (
            <div className="mt-8 rounded-xl overflow-hidden border border-border-light shadow-lg">
              <img src={resultUrl} alt="Generated card" className="w-full" />
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Professional Agent Cards for Every Listing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Use your agent intro card as the first or last slide in a listing photo slideshow, the opening frame of a virtual tour video, or a standalone social media post. The card includes your headshot, contact information, and brokerage branding - everything a potential buyer needs to reach you. Customize the colors to match your personal brand and generate a high-resolution 1920x1080 image ready for any platform.
            </p>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <Link href="/agent-branding-bar" className="text-primary font-semibold hover:underline">
              Need a branding bar on every photo instead? Try our Agent Branding Bar &rarr;
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
