import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Instagram for Realtors: Photo Sizes, Reels & Content Tips | 2026 Guide",
  description:
    "Complete guide to Instagram photo sizes, Reel formats, Story templates, and content strategy for real estate agents. Includes free formatting tools.",
};

export default function GuideInstagramForRealtors() {
  return (
    <article className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>Guides</span>
          <span className="mx-2">/</span>
          <span className="text-slate-dark">Instagram for Realtors</span>
        </nav>

        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-midnight leading-tight">
          Instagram for Realtors: Photo Sizes, Reels &amp; Content Strategy (2026)
        </h1>

        <p className="text-gray-500 mt-3">Updated March 2026 · 10 min read</p>

        {/* Quick solution */}
        <div className="bg-primary-light rounded-lg p-6 mt-8">
          <p className="font-semibold text-midnight">
            Quick Start: Need to format listing photos for Instagram right now?
          </p>
          <p className="text-gray-600 mt-1">
            Our{" "}
            <Link href="/social-media-photo-formatter" className="text-primary font-semibold underline">
              Social Media Formatter
            </Link>{" "}
            converts your listing photos to 9:16 Stories, 4:5 Feed, 1:1 Square, and 16:9 Cover formats in one click — with optional text overlays like &ldquo;Just Listed&rdquo; and &ldquo;Just Sold.&rdquo;
          </p>
        </div>

        {/* Section: Why Instagram */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          Why Instagram Matters for Real Estate Agents
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Instagram is not about selling homes directly — it&apos;s about building your reputation as a local expert. Agents who consistently post see more referrals, stronger client relationships, and better name recognition. As one experienced agent on Reddit put it: &ldquo;Social media doesn&apos;t convert to sales, it converts to reputation.&rdquo;
        </p>
        <p className="text-gray-600 leading-relaxed">
          That said, the platform&apos;s algorithm favors specific formats and content types. Understanding these mechanics means your content gets seen by more people without paying for ads.
        </p>

        {/* Section: Photo Sizes */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          Instagram Photo &amp; Video Sizes for 2026
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border-light rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-ash text-left">
                <th className="px-4 py-3 font-semibold">Format</th>
                <th className="px-4 py-3 font-semibold">Dimensions</th>
                <th className="px-4 py-3 font-semibold">Aspect Ratio</th>
                <th className="px-4 py-3 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              <tr>
                <td className="px-4 py-3 font-medium">Stories / Reels</td>
                <td className="px-4 py-3">1080 × 1920 px</td>
                <td className="px-4 py-3">9:16</td>
                <td className="px-4 py-3">Listing walkthroughs, market updates, tips</td>
              </tr>
              <tr className="bg-primary-light/30">
                <td className="px-4 py-3 font-medium">Feed Post (recommended)</td>
                <td className="px-4 py-3">1080 × 1350 px</td>
                <td className="px-4 py-3">4:5</td>
                <td className="px-4 py-3">Just Listed/Sold posts, property highlights</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Square Post</td>
                <td className="px-4 py-3">1080 × 1080 px</td>
                <td className="px-4 py-3">1:1</td>
                <td className="px-4 py-3">Testimonials, quotes, agent headshots</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Carousel</td>
                <td className="px-4 py-3">1080 × 1350 px</td>
                <td className="px-4 py-3">4:5</td>
                <td className="px-4 py-3">Multi-photo listing tours, before/after</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          4:5 takes up the most screen real estate in the feed, making it the best format for engagement.
        </p>

        {/* Section: Reels */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          Reels: The Highest-Reach Format
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Instagram&apos;s algorithm pushes Reels to non-followers far more than static posts. For realtors, this means Reels are your best organic growth tool. You don&apos;t need professional production — authenticity wins.
        </p>
        <div className="bg-ash rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-midnight">Reel Ideas That Work for Agents:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Listing walkthrough</strong> — 15-30 second tour of a new listing with music</li>
            <li><strong>Neighborhood spotlight</strong> — Quick tour of local restaurants, parks, schools</li>
            <li><strong>&ldquo;Day in the life&rdquo;</strong> — Behind the scenes of showings, open houses, closings</li>
            <li><strong>Before/after renovation</strong> — Side-by-side using our <Link href="/before-after-photo" className="text-primary underline">comparison tool</Link></li>
            <li><strong>Market update</strong> — Quick 15-second stat share with text overlay</li>
            <li><strong>Just Sold celebration</strong> — Client testimonial or keys handoff moment</li>
          </ul>
        </div>
        <p className="text-gray-600 leading-relaxed mt-4">
          As one top-producing agent shared: &ldquo;Be authentic and have fun on social. If you&apos;re only posting work stuff, it&apos;s pretty boring. I&apos;m working more on Reels since those get pushed out more.&rdquo;
        </p>

        {/* Section: Content Calendar */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          Simple Content Calendar for Realtors
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border-light rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-ash text-left">
                <th className="px-4 py-3 font-semibold">Day</th>
                <th className="px-4 py-3 font-semibold">Content Type</th>
                <th className="px-4 py-3 font-semibold">Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              <tr><td className="px-4 py-3 font-medium">Monday</td><td className="px-4 py-3">Market stat or tip</td><td className="px-4 py-3">Story or Reel</td></tr>
              <tr><td className="px-4 py-3 font-medium">Wednesday</td><td className="px-4 py-3">Listing feature or Just Listed post</td><td className="px-4 py-3">4:5 Feed Post</td></tr>
              <tr><td className="px-4 py-3 font-medium">Friday</td><td className="px-4 py-3">Neighborhood spotlight or personal moment</td><td className="px-4 py-3">Reel</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 mt-3">
          Three posts per week is sustainable and effective. Consistency matters more than volume.
        </p>

        {/* Section: Formatting Tips */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          Formatting Listing Photos for Instagram
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
            <div>
              <p className="font-semibold text-midnight">Upload your listing photos</p>
              <p className="text-gray-600 text-sm">Use our <Link href="/social-media-photo-formatter" className="text-primary underline">Social Media Formatter</Link> — it handles all Instagram sizes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
            <div>
              <p className="font-semibold text-midnight">Choose your size (9:16, 4:5, 1:1, or 16:9)</p>
              <p className="text-gray-600 text-sm">For feed posts, 4:5 gets the most visibility. For Stories and Reels, use 9:16.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <div>
              <p className="font-semibold text-midnight">Add text overlay (optional)</p>
              <p className="text-gray-600 text-sm">Use presets like &ldquo;Just Listed&rdquo; or add a custom address and price. Text is rendered directly on the image.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
            <div>
              <p className="font-semibold text-midnight">Download and post</p>
              <p className="text-gray-600 text-sm">Images are optimized at 1080px width — the ideal resolution for Instagram without unnecessary file bloat.</p>
            </div>
          </div>
        </div>

        {/* Section: Common Mistakes */}
        <h2 className="font-heading font-bold text-2xl mt-10 mb-4">
          Common Instagram Mistakes Realtors Make
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li><strong>Only posting listings</strong> — Mix in personal content, neighborhood guides, and market insights</li>
          <li><strong>Low-quality iPhone photos</strong> — Use our <Link href="/photo-enhancer" className="text-primary underline">Photo Enhancer</Link> to fix brightness and contrast before posting</li>
          <li><strong>Wrong aspect ratio</strong> — Landscape photos get cropped awkwardly in the feed; use 4:5 vertical</li>
          <li><strong>No call to action</strong> — Every post should tell people what to do next (DM, link in bio, call)</li>
          <li><strong>Inconsistent posting</strong> — Three quality posts per week beats daily low-effort content</li>
        </ul>

        {/* Related Tools */}
        <div className="bg-ash rounded-lg p-6 mt-10">
          <h3 className="font-semibold text-midnight mb-3">Related Tools</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/social-media-photo-formatter" className="text-primary hover:underline font-medium">
                Social Media Formatter
              </Link>
              <span className="text-gray-500 text-sm"> — Format photos for Stories, Feed, Square, and Cover</span>
            </li>
            <li>
              <Link href="/listing-status-overlays" className="text-primary hover:underline font-medium">
                Listing Status Overlays
              </Link>
              <span className="text-gray-500 text-sm"> — Add Just Listed, Just Sold ribbons</span>
            </li>
            <li>
              <Link href="/photo-enhancer" className="text-primary hover:underline font-medium">
                Photo Enhancer
              </Link>
              <span className="text-gray-500 text-sm"> — Fix dark or flat listing photos</span>
            </li>
            <li>
              <Link href="/before-after-photo" className="text-primary hover:underline font-medium">
                Before &amp; After Photo
              </Link>
              <span className="text-gray-500 text-sm"> — Create comparison images for renovations</span>
            </li>
            <li>
              <Link href="/batch-watermark-photos" className="text-primary hover:underline font-medium">
                Batch Watermark Photos
              </Link>
              <span className="text-gray-500 text-sm"> — Add your branding to social photos</span>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
