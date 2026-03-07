import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ShellWrapper } from "@/components/ShellWrapper";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <ShellWrapper>{children}</ShellWrapper>
    </html>
  );
}
