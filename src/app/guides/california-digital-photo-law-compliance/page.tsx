import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "California Digital Photo Law Compliance for Real Estate | 2025 Guide",
  description:
    "Understanding California's 2025 law requiring disclosure of digitally altered listing images. What real estate agents need to know about photo editing compliance.",
};

export default function GuideCALaw() {
  return (
    <article className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>{" "}
          &rarr; Guides &rarr; California Digital Photo Law Compliance
        </nav>

        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-midnight leading-tight">
          California&apos;s 2025 Digital Photo Law: What Real Estate Agents Need
          to Know
        </h1>
        <p className="mt-4 text-gray-500">
          Updated March 2026 &middot; 10 min read
        </p>

        <div className="mt-8 space-y-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="font-semibold text-yellow-800 mb-2">
              Important Disclaimer:
            </p>
            <p className="text-yellow-700 text-sm">
              This article provides general information and should not be
              considered legal advice. Consult with a qualified attorney for
              specific legal questions about compliance.
            </p>
          </div>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">
              What the Law Requires
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              California&apos;s 2025 digital alteration disclosure law requires
              real estate agents and brokers to disclose when listing
              photographs have been digitally altered in ways that change the
              appearance of a property. This includes virtual staging, sky
              replacement, object removal, and other AI-enhanced
              modifications.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">
              What Counts as a &ldquo;Digital Alteration&rdquo;?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-5">
                <h3 className="font-semibold text-red-800 mb-3">
                  Requires Disclosure
                </h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>&bull; Virtual staging (adding furniture digitally)</li>
                  <li>&bull; Sky replacement</li>
                  <li>&bull; Removing power lines, trash, or vehicles</li>
                  <li>&bull; AI-enhanced landscaping or lawn color</li>
                  <li>&bull; Changing wall colors or finishes</li>
                  <li>&bull; Removing structural defects</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-5">
                <h3 className="font-semibold text-green-800 mb-3">
                  Does NOT Require Disclosure
                </h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>&bull; Resizing photos for MLS upload</li>
                  <li>&bull; Compressing file size</li>
                  <li>&bull; Converting formats (HEIC to JPG)</li>
                  <li>&bull; Stripping EXIF/GPS metadata</li>
                  <li>&bull; Adding watermarks</li>
                  <li>&bull; Standard brightness/contrast adjustments</li>
                  <li>&bull; Cropping for aspect ratio</li>
                  <li>&bull; Renaming files</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Why MLS Photo Tools is Fully Compliant
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All tools on MLSPhotoTools.com perform utility operations only:
              resizing, compressing, format conversion, metadata stripping,
              watermarking, and renaming. These operations do not alter the
              visual appearance of the property and are not considered digital
              alterations under the California disclosure requirements.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our tools are designed specifically for the formatting operations
              that every MLS system requires. We do not offer virtual staging,
              object removal, sky replacement, or any AI-enhanced editing
              features that would trigger disclosure requirements.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-2xl mb-4">
              Best Practices for Compliance
            </h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-600">
              <li>
                <strong>Always disclose virtual staging</strong> in your listing
                description if you use any virtual staging service
              </li>
              <li>
                <strong>Use compliant photo tools</strong> that only perform
                utility formatting operations like resizing and compression
              </li>
              <li>
                <strong>Strip EXIF data</strong> before uploading to protect
                seller privacy while maintaining photo integrity
              </li>
              <li>
                <strong>Keep original unedited photos</strong> on file for at
                least the duration of the listing and any pending transactions
              </li>
              <li>
                <strong>Document your workflow</strong> so you can demonstrate
                compliance if questioned
              </li>
            </ol>
          </section>

          <div className="bg-ash rounded-lg p-6">
            <h3 className="font-heading font-bold text-lg mb-2">
              Compliant Photo Tools
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              All of these tools perform utility operations only and do not
              require digital alteration disclosure:
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mls-photo-resizer"
                  className="text-primary font-semibold hover:underline"
                >
                  MLS Photo Resizer
                </Link>{" "}
                &mdash; Resize to MLS requirements
              </li>
              <li>
                <Link
                  href="/batch-image-compressor"
                  className="text-primary font-semibold hover:underline"
                >
                  Batch Image Compressor
                </Link>{" "}
                &mdash; Compress under file size limits
              </li>
              <li>
                <Link
                  href="/remove-exif-data"
                  className="text-primary font-semibold hover:underline"
                >
                  EXIF Data Remover
                </Link>{" "}
                &mdash; Strip GPS data for privacy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
