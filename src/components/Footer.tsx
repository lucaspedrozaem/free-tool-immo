import Link from "next/link";
import Image from "next/image";

const toolLinks = [
  { name: "HEIC to JPG Converter", href: "/heic-to-jpg-converter" },
  { name: "Batch Image Compressor", href: "/batch-image-compressor" },
  { name: "Online Image Resizer", href: "/online-image-resizer" },
  { name: "Batch Watermark Photos", href: "/batch-watermark-photos" },
  { name: "MLS Photo Resizer", href: "/mls-photo-resizer" },
  { name: "Remove EXIF Data", href: "/remove-exif-data" },
  { name: "Zillow Photo Formatter", href: "/zillow-photo-formatter" },
  { name: "Bulk Rename Photos", href: "/bulk-rename-photos" },
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/logo.png"
                alt="MLS Photo Tools"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="font-heading font-bold text-xl">
                MLS<span className="text-primary">Photo</span>Tools
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

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Free Tools
            </h3>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
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

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Guides
            </h3>
            <ul className="space-y-2">
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

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
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
