"use client";

import Link from "next/link";
import { useState } from "react";

const tools = [
  { name: "HEIC to JPG Converter", href: "/heic-to-jpg-converter" },
  { name: "Batch Image Compressor", href: "/batch-image-compressor" },
  { name: "Online Image Resizer", href: "/online-image-resizer" },
  { name: "Batch Watermark Photos", href: "/batch-watermark-photos" },
  { name: "MLS Photo Resizer", href: "/mls-photo-resizer" },
  { name: "Remove EXIF Data", href: "/remove-exif-data" },
  { name: "Zillow Photo Formatter", href: "/zillow-photo-formatter" },
  { name: "Bulk Rename Photos", href: "/bulk-rename-photos" },
];

export function Navbar() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="font-heading font-bold text-xl text-midnight">
              MLSPhotoTools
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className="text-slate-dark hover:text-primary font-medium flex items-center gap-1 transition-colors">
                All Tools
                <svg
                  className={`w-4 h-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-border-light py-2 z-50">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block px-4 py-2 text-sm text-slate-dark hover:bg-primary-light hover:text-primary transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/guides/how-to-resize-photos-for-mls"
              className="text-slate-dark hover:text-primary font-medium transition-colors"
            >
              Guides
            </Link>
            <div className="bg-success/10 text-success-dark text-sm font-semibold px-3 py-1.5 rounded-full">
              100% Free Forever
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block px-3 py-2 text-sm text-slate-dark hover:bg-primary-light rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
              <Link
                href="/guides/how-to-resize-photos-for-mls"
                className="block px-3 py-2 text-sm font-medium text-slate-dark hover:bg-primary-light rounded-md"
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
