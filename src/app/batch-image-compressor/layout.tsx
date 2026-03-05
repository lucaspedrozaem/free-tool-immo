import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Batch Image Compressor | Compress Real Estate Photos Online",
  description:
    "Compress multiple listing photos under 5MB instantly. Free batch image compressor for real estate agents — meet MLS file size limits without losing quality. Runs in your browser.",
};

export default function BatchImageCompressorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
