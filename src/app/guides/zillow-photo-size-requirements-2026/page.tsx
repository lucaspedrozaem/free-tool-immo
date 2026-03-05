import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zillow Photo Size Requirements 2026 | Complete Guide",
  description:
    "Official Zillow photo size requirements for 2026. Learn the exact dimensions, file sizes, and formats Zillow accepts for listing photos.",
};

export default function GuideZillowRequirements() {
  return (
    <article className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>{" "}
          &rarr; Guides &rarr; Zillow Photo Size Requirements 2026
        </nav>

        <div className="text-center mb-8">
            <Image
              src="/illustrations/guide-zillow-requirements.jpg"
              alt=""
              width={700}
              height={394}
              className="mx-auto rounded-2xl"
              priority
            />
          </div>
          

        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-midnight leading-tight">
          Zillow Photo Size Requirements 2026: Everything You Need to Know
        </h1>
        <p className="mt-4 text-gray-500">
          Updated March 2026 &middot; 6 min read
        </p>

        <div className="mt-8 space-y-8">
          <div className="bg-primary-light rounded-lg p-6">
            <p className="font-semibold text-primary mb-2">Quick Solution:</p>
            <p className="text-slate-dark">
              Use our{" "}
              <Link
                href="/zillow-photo-formatter"
                className="text-primary font-semibold underline"
              >
                Free Zillow Photo Formatter
              </Link>{" "}
              to instantly format your photos for Zillow. No signup, 100% free.
            </p>
          </div>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Zillow&apos;s Official Photo Requirements
            </h2>
            <div className="bg-white rounded-lg border border-border-light p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Recommended Dimensions</p>
                  <p className="font-semibold text-lg">1920 x 1080 pixels</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Aspect Ratio</p>
                  <p className="font-semibold text-lg">16:9 (Landscape)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Maximum File Size</p>
                  <p className="font-semibold text-lg">5 MB per photo</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Accepted Formats</p>
                  <p className="font-semibold text-lg">JPG, PNG</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Minimum Dimensions</p>
                  <p className="font-semibold text-lg">1024 x 768 pixels</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Photos per Listing</p>
                  <p className="font-semibold text-lg">Up to 200 photos</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Why Your Zillow Photos Get Rejected
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Zillow&apos;s system automatically checks every uploaded photo
              against their requirements. Common rejection reasons include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Photos taken in portrait (vertical) orientation instead of landscape</li>
              <li>iPhone HEIC files that Zillow cannot process</li>
              <li>High-resolution camera photos exceeding the 5MB file size limit</li>
              <li>Photos with dimensions smaller than the 1024x768 minimum</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">
              How to Format Photos for Zillow in 3 Steps
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </span>
                <div>
                  <h3 className="font-semibold">Upload Your Listing Photos</h3>
                  <p className="text-gray-600">
                    Drop up to 50 photos into our{" "}
                    <Link href="/zillow-photo-formatter" className="text-primary underline">
                      Zillow Photo Formatter
                    </Link>
                    . Works with JPG, PNG, and HEIC files.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </span>
                <div>
                  <h3 className="font-semibold">Select &ldquo;Zillow&rdquo; Preset</h3>
                  <p className="text-gray-600">
                    The tool automatically sets 1920x1080 dimensions, compresses under 5MB, and converts to JPG format.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </span>
                <div>
                  <h3 className="font-semibold">Download Formatted Photos</h3>
                  <p className="text-gray-600">
                    Download all formatted photos as a ZIP file. Everything processes in your browser &mdash; photos never leave your device.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Zillow Photo Best Practices
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Use landscape orientation for all listing photos</li>
              <li>Lead with your best exterior shot as the primary photo</li>
              <li>Include photos of every room and major feature</li>
              <li>Strip GPS/EXIF data to protect seller privacy</li>
              <li>Use SEO-friendly file names (e.g., 123-Main-St-Living-Room.jpg)</li>
              <li>Upload the maximum number of photos to increase engagement and view time</li>
            </ul>
          </section>

          <div className="bg-ash rounded-lg p-6">
            <h3 className="font-heading font-bold text-lg mb-2">Related Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/zillow-photo-formatter" className="text-primary font-semibold hover:underline">
                  Zillow Photo Formatter
                </Link>{" "}
                &mdash; Format photos specifically for Zillow
              </li>
              <li>
                <Link href="/mls-photo-resizer" className="text-primary font-semibold hover:underline">
                  MLS Photo Resizer
                </Link>{" "}
                &mdash; Resize for any MLS system
              </li>
              <li>
                <Link href="/remove-exif-data" className="text-primary font-semibold hover:underline">
                  EXIF Data Remover
                </Link>{" "}
                &mdash; Protect seller privacy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
