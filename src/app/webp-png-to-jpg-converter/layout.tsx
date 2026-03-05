import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free WebP & PNG to JPG Converter | Batch Convert Images Online",
  description:
    "Convert WebP, PNG, and AVIF files to JPG instantly. Free browser-based batch converter for real estate agents - no upload, no signup. Convert listing photos for MLS compatibility.",
};

export default function WebpPngToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
