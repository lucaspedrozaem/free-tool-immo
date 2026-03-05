import Link from "next/link";
import Image from "next/image";

const footerCategories = [
  {
    label: "Convert & Format",
    tools: [
      { name: "HEIC to JPG Converter", href: "/heic-to-jpg-converter" },
      { name: "WebP/PNG to JPG Converter", href: "/webp-png-to-jpg-converter" },
    ],
  },
  {
    label: "Resize & Crop",
    tools: [
      { name: "MLS Photo Resizer", href: "/mls-photo-resizer" },
      { name: "Zillow Photo Formatter", href: "/zillow-photo-formatter" },
      { name: "Online Image Resizer", href: "/online-image-resizer" },
      { name: "Batch Aspect Ratio Cropper", href: "/batch-aspect-ratio-cropper" },
      { name: "Batch Image Compressor", href: "/batch-image-compressor" },
    ],
  },
  {
    label: "Privacy & Cleanup",
    tools: [
      { name: "Remove EXIF Data", href: "/remove-exif-data" },
      { name: "Privacy Blur Tool", href: "/blur-photo-privacy-tool" },
      { name: "Bulk Rename Photos", href: "/bulk-rename-photos" },
    ],
  },
  {
    label: "Brand & Market",
    tools: [
      { name: "Batch Watermark Photos", href: "/batch-watermark-photos" },
      { name: "Agent Branding Bar", href: "/agent-branding-bar" },
      { name: "Status Overlays", href: "/listing-status-overlays" },
      { name: "Agent Intro/Outro Card", href: "/agent-intro-card" },
      { name: "Bulk QR Code on Photos", href: "/bulk-qr-code-photos" },
      { name: "Photo Grid Maker", href: "/photo-grid-maker" },
      { name: "9:16 Social Formatter", href: "/social-media-photo-formatter" },
      { name: "Open House Flyer Maker", href: "/open-house-flyer-generator" },
    ],
  },
];

const guideLinks = [
  {
    name: "How to Resize Photos for MLS",
    href: "/guides/how-to-resize-photos-for-mls",
  },
  {
    name: "Zillow Photo Requirements 2026",
    href: "/guides/zillow-photo-size-requirements-2026",
  },
  {
    name: "California Digital Photo Law",
    href: "/guides/california-digital-photo-law-compliance",
  },
  {
    name: "Best Watermark Apps",
    href: "/guides/best-real-estate-watermark-apps",
  },
];

export function Footer() {
  return (
    <footer className="bg-midnight text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-0 mb-3">
              <Image
                src="/logo.png"
                alt="MLS Photo Tools"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="font-heading font-bold text-xl">
                MLS<span className="bg-gradient-to-r from-primary to-primary-end bg-clip-text text-transparent">Photo</span>Tools
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The fastest, 100% free, browser-based photo formatting utilities
              for real estate professionals.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-success">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Your photos never leave your browser
            </div>
          </div>

          {/* Convert & Format + Resize & Crop */}
          <div>
            {footerCategories.slice(0, 2).map((category) => (
              <div key={category.label} className="mb-5 last:mb-0">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-2">
                  {category.label}
                </h3>
                <ul className="space-y-1.5">
                  {category.tools.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Privacy & Cleanup + Brand & Market */}
          <div>
            {footerCategories.slice(2, 4).map((category) => (
              <div key={category.label} className="mb-5 last:mb-0">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-2">
                  {category.label}
                </h3>
                <ul className="space-y-1.5">
                  {category.tools.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Guides */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-2">
              Guides
            </h3>
            <ul className="space-y-1.5">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-2">
              Company
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MLSPhotoTools.com. All rights
          reserved. All processing happens locally in your browser.
        </div>
      </div>
    </footer>
  );
}
