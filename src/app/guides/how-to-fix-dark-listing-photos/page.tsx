import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Fix Dark Listing Photos | Free Browser Tool Guide 2026",
  description:
    "Step-by-step guide to fixing dark interiors, overexposed windows, and flat listing photos using free browser tools. No Photoshop required.",
};

export default function GuideFixDarkPhotos() {
  return (
    <article className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>Guides</span>
          <span className="mx-2">/</span>
          <span className="text-slate-dark">How to Fix Dark Listing Photos</span>
        </nav>

        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-midnight leading-tight">
          How to Fix Dark Listing Photos (Free, No Photoshop)
        </h1>

        <p className="text-gray-500 mt-3">Updated March 2026 · 6 min read</p>

        {/* Quick solution */}
        <div className="bg-primary-light rounded-lg p-6 mt-8">
          <p className="font-semibold text-midnight">
            Quick Fix: Upload your dark photos now and enhance them in seconds.
          </p>
          <p className="text-gray-600 mt-1">
            Our{" "}
            <Link href="/photo-enhancer" className="text-primary font-semibold underline">
              Photo Enhancer
            </Link>{" "}
            has one-click presets like &ldquo;Brighten Interior&rdquo; that fix the most common issues. Supports batch processing up to 50 photos.
          </p>
        </div>

        {/* Why photos come out dark */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          Why Listing Photos Come Out Dark
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Even modern smartphone cameras struggle with the high contrast range in real estate interiors. The most common causes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li><strong>Window blow-out</strong> — The camera exposes for bright windows, making the room appear dark</li>
          <li><strong>Mixed lighting</strong> — Warm ceiling lights + cool daylight creates uneven color and dark shadows</li>
          <li><strong>No flash / no lighting setup</strong> — Natural light alone rarely illuminates an entire room evenly</li>
          <li><strong>Tight spaces</strong> — Bathrooms, closets, and hallways with limited light sources</li>
          <li><strong>Overcast days</strong> — Less natural light coming through windows means darker interiors</li>
        </ul>

        {/* Fixes */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          How to Fix Each Problem
        </h2>

        {/* Fix 1 */}
        <h3 className="font-heading font-semibold text-lg mt-8 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
          Dark Interiors (Most Common)
        </h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          This is the #1 complaint from real estate agents. The room looked fine in person, but the photo is noticeably dark.
        </p>
        <div className="bg-ash rounded-lg p-4 text-sm">
          <p className="font-semibold text-midnight mb-2">Fix with Photo Enhancer:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Increase <strong>Brightness</strong> to +15 to +25</li>
            <li>Increase <strong>Exposure</strong> to +10 to +20</li>
            <li>Bump <strong>Contrast</strong> to +5 to +15 (adds depth)</li>
            <li>Or use the <strong>&ldquo;Brighten Interior&rdquo;</strong> preset for a one-click fix</li>
          </ul>
        </div>

        {/* Fix 2 */}
        <h3 className="font-heading font-semibold text-lg mt-8 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
          Flat, Washed-Out Photos
        </h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          Photos that look gray and lifeless usually lack contrast and color saturation.
        </p>
        <div className="bg-ash rounded-lg p-4 text-sm">
          <p className="font-semibold text-midnight mb-2">Fix with Photo Enhancer:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Increase <strong>Contrast</strong> to +15 to +25</li>
            <li>Increase <strong>Saturation</strong> to +10 to +20</li>
            <li>Add a touch of <strong>Sharpen</strong> at +15 to +25</li>
            <li>Or use the <strong>&ldquo;Vivid &amp; Punchy&rdquo;</strong> preset</li>
          </ul>
        </div>

        {/* Fix 3 */}
        <h3 className="font-heading font-semibold text-lg mt-8 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
          Cold, Uninviting Color Temperature
        </h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          Photos with a blue or cool tone feel sterile. Warm tones make spaces feel inviting and livable.
        </p>
        <div className="bg-ash rounded-lg p-4 text-sm">
          <p className="font-semibold text-midnight mb-2">Fix with Photo Enhancer:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Increase <strong>Warmth</strong> to +10 to +20</li>
            <li>Slight <strong>Brightness</strong> bump at +5 to +10</li>
            <li>Or use the <strong>&ldquo;Warm &amp; Inviting&rdquo;</strong> preset</li>
          </ul>
        </div>

        {/* Fix 4 */}
        <h3 className="font-heading font-semibold text-lg mt-8 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
          Blurry or Soft Photos
        </h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          Camera shake or autofocus issues lead to soft-looking photos. While you can&apos;t fix true motion blur, mild softness can be improved.
        </p>
        <div className="bg-ash rounded-lg p-4 text-sm">
          <p className="font-semibold text-midnight mb-2">Fix with Photo Enhancer:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Increase <strong>Sharpen</strong> to +30 to +50</li>
            <li>Add <strong>Contrast</strong> at +10 (perceived sharpness)</li>
            <li>For very blurry photos, reshoot — sharpening can&apos;t recover lost detail</li>
          </ul>
        </div>

        {/* Fix 5 */}
        <h3 className="font-heading font-semibold text-lg mt-8 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">5</span>
          Overcast or Dull Exterior Skies
        </h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          Gray skies make even beautiful properties look unappealing. This is a separate problem from interior darkness.
        </p>
        <div className="bg-ash rounded-lg p-4 text-sm">
          <p className="font-semibold text-midnight mb-2">Fix with Sky Replacement Tool:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Use our <Link href="/sky-replacement" className="text-primary underline">Sky Brightener</Link> to lighten overcast skies</li>
            <li>&ldquo;Brighten Sky&rdquo; mode is MLS-safe — it enhances without replacing</li>
            <li>For social media, try the &ldquo;Clear Blue&rdquo; or &ldquo;Golden Hour&rdquo; modes</li>
          </ul>
        </div>

        {/* Prevention */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          Shooting Tips to Prevent Dark Photos
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li><strong>Turn on every light</strong> — Ceiling lights, lamps, under-cabinet lights, even closet lights</li>
          <li><strong>Open all blinds and curtains</strong> — Maximize natural light from every window</li>
          <li><strong>Shoot during the day</strong> — 10am-2pm provides the most even natural light</li>
          <li><strong>Use HDR mode</strong> — Most smartphones have this built in; it balances highlights and shadows</li>
          <li><strong>Tap to expose for the room</strong> — On iPhone, tap the darkest area to force brighter exposure</li>
          <li><strong>Use a tripod</strong> — Eliminates camera shake in low-light situations</li>
          <li><strong>Shoot wide</strong> — Use the 0.5x lens on iPhone for a wider field of view that captures more light</li>
        </ul>

        {/* MLS compliance */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          MLS Compliance: What Editing Is Allowed?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Adjusting brightness, contrast, exposure, and color temperature is <strong>universally accepted</strong> by MLS systems. These are the same adjustments any camera makes automatically. What&apos;s not allowed: removing structural elements, changing room sizes, or adding objects that don&apos;t exist.
        </p>
        <p className="text-gray-600 leading-relaxed">
          A simple test: &ldquo;If an edit would require physical renovation to achieve in real life, it shouldn&apos;t be in an MLS listing photo.&rdquo; Brightness/contrast adjustments pass this test easily.
        </p>

        {/* Related Tools */}
        <div className="bg-ash rounded-lg p-6 mt-10">
          <h3 className="font-semibold text-midnight mb-3">Related Tools</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/photo-enhancer" className="text-primary hover:underline font-medium">
                Photo Enhancer
              </Link>
              <span className="text-gray-500 text-sm"> — Brightness, contrast, exposure, saturation, warmth &amp; sharpen</span>
            </li>
            <li>
              <Link href="/sky-replacement" className="text-primary hover:underline font-medium">
                Sky Replacement &amp; Brightener
              </Link>
              <span className="text-gray-500 text-sm"> — Fix overcast exterior skies</span>
            </li>
            <li>
              <Link href="/batch-image-compressor" className="text-primary hover:underline font-medium">
                Batch Image Compressor
              </Link>
              <span className="text-gray-500 text-sm"> — Compress enhanced photos under MLS file size limits</span>
            </li>
            <li>
              <Link href="/mls-photo-resizer" className="text-primary hover:underline font-medium">
                MLS Photo Resizer
              </Link>
              <span className="text-gray-500 text-sm"> — Resize to meet MLS dimension requirements</span>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
