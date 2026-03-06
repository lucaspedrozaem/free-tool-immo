import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - MLS Photo Tools",
  description:
    "Privacy policy for MLSPhotoTools.com. All photo processing happens locally in your browser - your files never leave your device.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-midnight leading-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-400">Last updated: March 6, 2026</p>

        <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              Who We Are
            </h2>
            <p>
              MLSPhotoTools.com is operated by <strong>GENAIEXPERT SAS</strong>,
              a company registered in France (SIREN 981 869 480), located at
              270 Chemin des Pr&eacute;s, 06270 Villeneuve-Loubet, France.
            </p>
            <p className="mt-2">
              For any privacy-related questions, contact us at{" "}
              <a
                href="mailto:support@mlsphototools.com"
                className="text-primary font-medium hover:underline"
              >
                support@mlsphototools.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              The Short Version
            </h2>
            <p>
              <strong>Your photos never leave your device.</strong> Every tool on
              MLSPhotoTools.com processes images entirely in your browser using
              HTML5 Canvas. We do not upload, store, transmit, or have access to
              your photos, logos, headshots, QR codes, or any other files you use
              with our tools.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              What Data We Collect
            </h2>
            <h3 className="font-semibold text-midnight mt-4 mb-1">
              Information you provide
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Contact form:</strong> If you contact us via the{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact page
                </Link>
                , we receive the name, email, and message you provide. This is
                sent through your own email client - we do not collect it on a
                server.
              </li>
            </ul>

            <h3 className="font-semibold text-midnight mt-4 mb-1">
              Information collected automatically
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Analytics:</strong> We may use privacy-respecting
                analytics (such as Plausible or similar) to understand how our
                site is used. These tools do not use cookies and do not collect
                personally identifiable information.
              </li>
              <li>
                <strong>Server logs:</strong> Our hosting provider may
                automatically log IP addresses, browser type, and pages visited
                for security and operational purposes. These logs are retained
                for a limited period and are not used for tracking.
              </li>
            </ul>

            <h3 className="font-semibold text-midnight mt-4 mb-1">
              Information we do NOT collect
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Photos, images, or any files you process with our tools</li>
              <li>Text you enter into tool forms (agent name, phone, address, etc.)</li>
              <li>Passwords or payment information (we have no accounts or payments)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              Cookies
            </h2>
            <p>
              MLSPhotoTools.com does not set tracking cookies or use third-party
              advertising cookies. If we use analytics, we use cookie-free
              solutions. Your browser may store standard technical data (such as
              cached assets) which is controlled by your browser settings.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              How We Use Your Data
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to your contact inquiries</li>
              <li>To understand aggregate site usage and improve our tools</li>
              <li>To maintain site security and prevent abuse</li>
            </ul>
            <p className="mt-2">
              We do not sell, rent, or share your personal data with third
              parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              Third-Party Services
            </h2>
            <p>
              Our site may use the following third-party services:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>Hosting provider:</strong> For serving the website.
                Subject to their own privacy policy.
              </li>
              <li>
                <strong>CDN / font services:</strong> We may load fonts or icons
                from external CDNs. These services may receive your IP address
                as part of the HTTP request.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              Your Rights (GDPR)
            </h2>
            <p>
              As we are based in the European Union, you have the following
              rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Right to access any personal data we hold about you</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
              <li>Right to lodge a complaint with the CNIL (French data protection authority)</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:support@mlsphototools.com"
                className="text-primary font-medium hover:underline"
              >
                support@mlsphototools.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              Data Retention
            </h2>
            <p>
              Since we do not collect photos or tool input data, there is
              nothing to retain. Contact inquiries are kept only as long as
              needed to respond and resolve issues.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              Children&apos;s Privacy
            </h2>
            <p>
              Our services are not directed at children under 16. We do not
              knowingly collect personal data from children.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Changes will
              be posted on this page with an updated date. Continued use of the
              site after changes constitutes acceptance of the revised policy.
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
