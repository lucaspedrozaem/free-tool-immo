import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Resize Photos for MLS | Complete Guide 2026",
  description:
    "Step-by-step guide to resizing listing photos for any MLS system. Learn the exact dimensions, file sizes, and formats every MLS requires.",
};

export default function GuideResizeForMLS() {
  return (
    <article className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>{" "}
          &rarr;{" "}
          <Link href="/guides/how-to-resize-photos-for-mls" className="hover:text-primary">
            Guides
          </Link>{" "}
          &rarr; How to Resize Photos for MLS
        </nav>

        <div className="text-center mb-8">
            <Image
              src="/illustrations/guide-mls-resize.jpg"
              alt=""
              width={700}
              height={394}
              className="mx-auto rounded-2xl"
              priority
            />
          </div>
          

        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-midnight leading-tight">
          How to Resize Photos for the MLS: The Complete 2026 Guide
        </h1>
        <p className="mt-4 text-gray-500">
          Updated March 2026 &middot; 8 min read
        </p>

        <div className="mt-8 prose prose-lg max-w-none">
          <div className="bg-primary-light rounded-lg p-6 mb-8">
            <p className="font-semibold text-primary mb-2">Quick Solution:</p>
            <p className="text-slate-dark">
              Use our{" "}
              <Link
                href="/mls-photo-resizer"
                className="text-primary font-semibold underline"
              >
                Free MLS Photo Resizer
              </Link>{" "}
              to instantly batch resize your listing photos to meet any MLS
              requirement. No signup required.
            </p>
          </div>

          <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
            Why MLS Systems Reject Your Photos
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every MLS system has specific requirements for listing photos. If
            your images don&apos;t meet these requirements, they get rejected,
            costing you time and potentially delaying your listing from going
            live. The most common reasons for rejection are:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
            <li>
              <strong>File size too large:</strong> Most MLS systems cap photos
              at 5MB or 10MB
            </li>
            <li>
              <strong>Wrong dimensions:</strong> Many require specific aspect
              ratios like 4:3 or 16:9
            </li>
            <li>
              <strong>Wrong format:</strong> iPhone HEIC files are not accepted
              by most MLS platforms
            </li>
            <li>
              <strong>Too many pixels:</strong> Some older systems have maximum
              resolution limits
            </li>
          </ul>

          <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
            Standard MLS Photo Requirements
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-border-light rounded-lg overflow-hidden">
              <thead className="bg-ash">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Platform</th>
                  <th className="text-left px-4 py-3 font-semibold">Recommended Size</th>
                  <th className="text-left px-4 py-3 font-semibold">Max File Size</th>
                  <th className="text-left px-4 py-3 font-semibold">Formats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                <tr>
                  <td className="px-4 py-3">Most MLS Systems</td>
                  <td className="px-4 py-3">2048 x 1536 (4:3)</td>
                  <td className="px-4 py-3">5 MB</td>
                  <td className="px-4 py-3">JPG, PNG</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Zillow</td>
                  <td className="px-4 py-3">1920 x 1080 (16:9)</td>
                  <td className="px-4 py-3">5 MB</td>
                  <td className="px-4 py-3">JPG, PNG</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Realtor.com</td>
                  <td className="px-4 py-3">2048 x 1536 (4:3)</td>
                  <td className="px-4 py-3">10 MB</td>
                  <td className="px-4 py-3">JPG, PNG</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Redfin</td>
                  <td className="px-4 py-3">1920 x 1080 (16:9)</td>
                  <td className="px-4 py-3">5 MB</td>
                  <td className="px-4 py-3">JPG, PNG</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
            How to Resize Your Listing Photos (3 Easy Steps)
          </h2>
          <div className="space-y-4 mb-6">
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </span>
              <div>
                <h3 className="font-semibold">Upload Your Photos</h3>
                <p className="text-gray-600">
                  Drag and drop up to 50 photos into our{" "}
                  <Link
                    href="/mls-photo-resizer"
                    className="text-primary underline"
                  >
                    MLS Photo Resizer
                  </Link>
                  . Supports JPG, PNG, WebP, and iPhone HEIC files.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </span>
              <div>
                <h3 className="font-semibold">Select Your MLS Preset</h3>
                <p className="text-gray-600">
                  Choose from pre-built presets for your MLS system, Zillow,
                  Realtor.com, or enter custom dimensions. The tool
                  automatically handles compression and format conversion.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </span>
              <div>
                <h3 className="font-semibold">Download Your Formatted Photos</h3>
                <p className="text-gray-600">
                  All photos are processed instantly in your browser and
                  downloaded as a single ZIP file. Your photos never leave your
                  computer.
                </p>
              </div>
            </div>
          </div>

          <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
            Tips for Better MLS Photos
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
            <li>
              Always shoot in landscape orientation (horizontal) for MLS
              compatibility
            </li>
            <li>
              Use the highest resolution your camera supports, then resize down
              for MLS upload
            </li>
            <li>
              Strip EXIF/GPS data before uploading to protect seller privacy
            </li>
            <li>
              Name your files with the property address for SEO (e.g.,
              123-Main-St-01.jpg)
            </li>
            <li>
              Upload the maximum number of photos your MLS allows to increase
              engagement
            </li>
          </ul>

          <div className="bg-ash rounded-lg p-6 mt-8">
            <h3 className="font-heading font-bold text-lg mb-2">
              Related Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mls-photo-resizer"
                  className="text-primary font-semibold hover:underline"
                >
                  Free MLS Photo Resizer
                </Link>{" "}
                &mdash; Batch resize for any MLS system
              </li>
              <li>
                <Link
                  href="/batch-image-compressor"
                  className="text-primary font-semibold hover:underline"
                >
                  Batch Image Compressor
                </Link>{" "}
                &mdash; Compress photos under 5MB
              </li>
              <li>
                <Link
                  href="/remove-exif-data"
                  className="text-primary font-semibold hover:underline"
                >
                  EXIF Data Remover
                </Link>{" "}
                &mdash; Strip GPS and metadata for privacy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
