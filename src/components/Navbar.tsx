"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const toolCategories = [
  {
    label: "Convert",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    tools: [
      { name: "HEIC to JPG Converter", href: "/heic-to-jpg-converter" },
      { name: "WebP/PNG to JPG Converter", href: "/webp-png-to-jpg-converter" },
    ],
  },
  {
    label: "Resize & Crop",
    icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
    tools: [
      { name: "MLS Photo Resizer", href: "/mls-photo-resizer" },
      { name: "Zillow Photo Formatter", href: "/zillow-photo-formatter" },
      { name: "Online Image Resizer", href: "/online-image-resizer" },
      { name: "Batch Aspect Ratio Cropper", href: "/batch-aspect-ratio-cropper" },
      { name: "Batch Image Compressor", href: "/batch-image-compressor" },
    ],
  },
  {
    label: "Privacy",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    tools: [
      { name: "Remove EXIF Data", href: "/remove-exif-data" },
      { name: "Privacy Blur Tool", href: "/blur-photo-privacy-tool" },
      { name: "Bulk Rename Photos", href: "/bulk-rename-photos" },
    ],
  },
  {
    label: "Brand & Market",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    tools: [
      { name: "Batch Watermark Photos", href: "/batch-watermark-photos" },
      { name: "Agent Branding Bar", href: "/agent-branding-bar" },
      { name: "Status Overlays", href: "/listing-status-overlays" },
      { name: "Photo Grid Maker", href: "/photo-grid-maker" },
      { name: "9:16 Social Formatter", href: "/social-media-photo-formatter" },
      { name: "Open House Flyer Maker", href: "/open-house-flyer-generator" },
    ],
  },
];

export function Navbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-border-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo — bigger */}
          <Link href="/" className="flex items-center gap-0">
            <Image
              src="/logo.png"
              alt="MLS Photo Tools"
              width={72}
              height={72}
              className="rounded-lg"
            />
            <span className="font-heading font-bold text-2xl text-midnight">
              MLS<span className="bg-gradient-to-r from-primary to-primary-end bg-clip-text text-transparent">Photo</span>Tools
            </span>
          </Link>

          {/* Desktop Nav — each category as its own dropdown */}
          <div className="hidden lg:flex items-center gap-1">
            {toolCategories.map((category) => (
              <div
                key={category.label}
                className="relative"
                onMouseEnter={() => setOpenCategory(category.label)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-dark hover:text-primary transition-colors rounded-lg hover:bg-primary-light/50">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={category.icon}
                    />
                  </svg>
                  {category.label}
                  <svg
                    className={`w-3 h-3 text-gray-400 transition-transform ${openCategory === category.label ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openCategory === category.label && (
                  <div className="absolute top-full left-0 pt-1 z-50 min-w-[220px]">
                  <div className="bg-white rounded-xl shadow-xl border border-border-light py-2">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="block px-4 py-2 text-sm text-slate-dark hover:bg-primary-light hover:text-primary transition-colors"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/guides/how-to-resize-photos-for-mls"
              className="px-3 py-2 text-sm font-medium text-slate-dark hover:text-primary transition-colors rounded-lg hover:bg-primary-light/50"
            >
              Guides
            </Link>

            <div className="ml-2 bg-gradient-to-r from-primary to-primary-end text-white text-xs font-bold px-3 py-1.5 rounded-full">
              100% Free
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setMobileSection(null);
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu — accordion by category */}
        {mobileOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-1">
              {toolCategories.map((category) => (
                <div key={category.label}>
                  <button
                    onClick={() =>
                      setMobileSection(
                        mobileSection === category.label ? null : category.label
                      )
                    }
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-slate-dark hover:bg-primary-light rounded-md"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
                      </svg>
                      {category.label}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        mobileSection === category.label ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileSection === category.label && (
                    <div className="pl-9 space-y-0.5 mt-0.5 mb-1">
                      {category.tools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="block px-3 py-2 text-sm text-slate-dark hover:bg-primary-light rounded-md"
                          onClick={() => setMobileOpen(false)}
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/guides/how-to-resize-photos-for-mls"
                className="block px-3 py-2.5 text-sm font-semibold text-slate-dark hover:bg-primary-light rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                Guides
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
