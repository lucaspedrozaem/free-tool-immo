import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - MLS Photo Tools",
  description:
    "Terms of service for MLSPhotoTools.com. Free browser-based photo tools for real estate professionals.",
};

export default function TermsOfServicePage() {
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-midnight leading-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-400">Last updated: March 6, 2026</p>

        <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              1. About These Terms
            </h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
              MLSPhotoTools.com (&ldquo;the Site&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;), operated by <strong>GENAIEXPERT SAS</strong>,
              a company registered in France (SIREN 981 869 480), located at
              270 Chemin des Pr&eacute;s, 06270 Villeneuve-Loubet, France.
            </p>
            <p className="mt-2">
              By using the Site, you agree to these Terms. If you do not agree,
              please do not use the Site.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              2. Description of Service
            </h2>
            <p>
              MLSPhotoTools.com provides free, browser-based photo editing and
              formatting tools designed for real estate professionals. All image
              processing happens locally in your browser using HTML5 Canvas.
              <strong> Your files are never uploaded to our servers.</strong>
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              3. Free Service
            </h2>
            <p>
              All tools on the Site are provided free of charge with no account
              required. We reserve the right to modify, suspend, or discontinue
              any tool or feature at any time without notice.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              4. Your Content
            </h2>
            <p>
              You retain full ownership of all photos, images, and content you
              process using our tools. Since processing happens entirely in your
              browser, we never have access to your content.
            </p>
            <p className="mt-2">
              You are responsible for ensuring you have the right to use and
              modify any photos you process with our tools. Do not use our tools
              to process content you do not own or have permission to use.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              5. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                Use the Site for any unlawful purpose or in violation of any
                applicable laws or regulations
              </li>
              <li>
                Attempt to interfere with, disrupt, or overload the Site or its
                infrastructure
              </li>
              <li>
                Scrape, crawl, or use automated tools to access the Site in a
                manner that degrades service for others
              </li>
              <li>
                Reverse-engineer the Site for the purpose of building a
                competing service
              </li>
              <li>
                Use the tools to process illegal, defamatory, or infringing
                content
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              6. Intellectual Property
            </h2>
            <p>
              The Site&apos;s design, code, branding, and content (excluding
              user-provided content) are the property of GENAIEXPERT SAS and are
              protected by intellectual property laws. You may not copy,
              reproduce, or redistribute the Site or its code without our
              written permission.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              7. Disclaimer of Warranties
            </h2>
            <p>
              The Site and all tools are provided <strong>&ldquo;as is&rdquo;</strong> and{" "}
              <strong>&ldquo;as available&rdquo;</strong> without warranties of any kind,
              whether express or implied. We do not warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The tools will meet your specific requirements</li>
              <li>The tools will be uninterrupted, error-free, or secure</li>
              <li>
                Output images will meet the requirements of any particular MLS,
                platform, or service
              </li>
              <li>Results will be accurate or reliable in all cases</li>
            </ul>
            <p className="mt-2">
              You are responsible for verifying that output images meet the
              specific requirements of your MLS, brokerage, or publishing
              platform before uploading them.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, GENAIEXPERT SAS
              and its directors, employees, and agents shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages arising from your use of the Site, including but not
              limited to loss of data, loss of business, or inability to use the
              tools.
            </p>
            <p className="mt-2">
              Since the tools are provided free of charge and process data
              locally in your browser, our total liability for any claim arising
              from the use of the Site shall not exceed zero euros (&euro;0).
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              9. MLS and Platform Compliance
            </h2>
            <p>
              Our tools are designed to help format photos for common MLS and
              real estate platform requirements. However, MLS rules and platform
              guidelines vary and change frequently. We do not guarantee
              compliance with any specific MLS or platform. Always verify
              requirements with your MLS or platform directly.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              10. Third-Party Links
            </h2>
            <p>
              The Site may contain links to third-party websites or resources.
              We are not responsible for the content, availability, or practices
              of any third-party sites. Links do not imply endorsement.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              11. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Changes will be
              posted on this page with an updated date. Continued use of the
              Site after changes constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              12. Governing Law
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of France. Any disputes arising from these Terms or the use
              of the Site shall be subject to the exclusive jurisdiction of the
              courts of Nice, France.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              13. Contact
            </h2>
            <p>
              If you have questions about these Terms, contact us at{" "}
              <a
                href="mailto:support@mlsphototools.com"
                className="text-primary font-medium hover:underline"
              >
                support@mlsphototools.com
              </a>{" "}
              or via our{" "}
              <Link href="/contact" className="text-primary font-medium hover:underline">
                contact page
              </Link>.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              <strong>GENAIEXPERT SAS</strong> &middot; SIREN 981 869 480
              &middot; 270 Chemin des Pr&eacute;s, 06270 Villeneuve-Loubet,
              France
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
