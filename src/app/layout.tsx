import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SchemaMarkup } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "MLS Photo Tools | Free Real Estate Photo Formatting Tools",
  description:
    "100% free batch image resizer, compressor, and formatter for real estate. Resize, compress, watermark, and rename listing photos instantly. Runs in your browser for ultimate privacy.",
  keywords:
    "MLS photo resizer, real estate image tools, batch resize photos, compress listing photos, HEIC to JPG, remove EXIF data, zillow photo formatter",
  openGraph: {
    title: "MLS Photo Tools | Free Real Estate Photo Formatting Tools",
    description:
      "Batch resize, compress, and watermark up to 50 real estate photos instantly. 100% free, runs in your browser.",
    url: "https://mlsphototools.com",
    siteName: "MLS Photo Tools",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ash text-midnight antialiased">
        <SchemaMarkup
          schema={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MLS Photo Tools",
            url: "https://mlsphototools.com",
            description:
              "Free browser-based photo formatting utilities for real estate professionals.",
          }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
