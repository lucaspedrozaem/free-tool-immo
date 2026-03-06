"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@iconify/react";

const toolCategories = [
  {
    label: "Convert",
    icon: "ph:image-square",
    tools: [
      { name: "HEIC to JPG Converter", href: "/heic-to-jpg-converter" },
      { name: "WebP/PNG to JPG Converter", href: "/webp-png-to-jpg-converter" },
    ],
  },
  {
    label: "Resize & Crop",
    icon: "ph:resize",
    tools: [
      { name: "MLS Photo Resizer", href: "/mls-photo-resizer" },
      { name: "Zillow Photo Formatter", href: "/zillow-photo-formatter" },
      { name: "Online Image Resizer", href: "/online-image-resizer" },
      { name: "Batch Aspect Ratio Cropper", href: "/batch-aspect-ratio-cropper" },
      { name: "Batch Image Compressor", href: "/batch-image-compressor" },
      { name: "Photo Enhancer", href: "/photo-enhancer" },
    ],
  },
  {
    label: "Privacy",
    icon: "ph:shield-check",
    tools: [
      { name: "Remove EXIF Data", href: "/remove-exif-data" },
      { name: "Privacy Blur Tool", href: "/blur-photo-privacy-tool" },
      { name: "Bulk Rename Photos", href: "/bulk-rename-photos" },
    ],
  },
  {
    label: "Brand & Market",
    icon: "ph:megaphone-simple",
    tools: [
      { name: "Batch Watermark Photos", href: "/batch-watermark-photos" },
      { name: "Agent Branding Bar", href: "/agent-branding-bar" },
      { name: "Agent Intro/Outro Card", href: "/agent-intro-card" },
      { name: "Bulk QR Code on Photos", href: "/bulk-qr-code-photos" },
      { name: "Status Overlays", href: "/listing-status-overlays" },
      { name: "Photo Grid Maker", href: "/photo-grid-maker" },
      { name: "9:16 Social Formatter", href: "/social-media-photo-formatter" },
      { name: "Open House Flyer Maker", href: "/open-house-flyer-generator" },
      { name: "Before & After Photo", href: "/before-after-photo" },
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MLS Photo Tools"
              width={38}
              height={38}
              className="rounded-lg"
            />
            <span className="font-heading font-bold text-xl text-midnight leading-none -mt-1">
              MLS<span className="bg-gradient-to-r from-primary to-primary-end bg-clip-text text-transparent">Photo</span>Tools
            </span>
          </Link>

          {/* Desktop Nav - each category as its own dropdown */}
          <div className="hidden lg:flex items-center gap-1">
            {toolCategories.map((category) => (
              <div
                key={category.label}
                className="relative"
                onMouseEnter={() => setOpenCategory(category.label)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-dark hover:text-primary transition-colors rounded-lg hover:bg-primary-light/50">
                  <Icon icon={category.icon} className="w-4 h-4 text-primary" />
                  {category.label}
                  <Icon
                    icon="ph:caret-down"
                    className={`w-3 h-3 text-gray-400 transition-transform ${openCategory === category.label ? "rotate-180" : ""}`}
                  />
                </button>

                {openCategory === category.label && (
                  <div className="absolute top-full left-0 pt-1 z-50 min-w-[200px] max-w-[calc(100vw-2rem)]">
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
            className="lg:hidden p-2.5 -mr-1"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setMobileSection(null);
            }}
          >
            <Icon
              icon={mobileOpen ? "ph:x" : "ph:list"}
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Mobile menu - accordion by category */}
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
                      <Icon icon={category.icon} className="w-4 h-4 text-primary" />
                      {category.label}
                    </span>
                    <Icon
                      icon="ph:caret-down"
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        mobileSection === category.label ? "rotate-180" : ""
                      }`}
                    />
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
