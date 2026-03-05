import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Batch Watermark Photos | Add Watermarks to Real Estate Images",
  description:
    "Protect your real estate listing photos with custom watermarks. Batch watermark multiple property images at once with adjustable text, position, opacity, and font size. 100% free, runs in your browser.",
};

export default function BatchWatermarkPhotosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
