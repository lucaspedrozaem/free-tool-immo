import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Zillow Photo Formatter | Format Photos for Zillow & Realtor.com",
  description:
    "Format listing photos to meet Zillow, Realtor.com, Redfin, and Homes.com photo requirements. Auto-resize, compress under 5MB, and strip EXIF. 100% free.",
  openGraph: {
    title:
      "Free Zillow Photo Formatter | Format Photos for Zillow & Realtor.com",
    description:
      "Never get a photo rejection again. Auto-format listing photos for Zillow, Realtor.com, Redfin, and Homes.com. Free and browser-based.",
  },
};

export default function ZillowPhotoFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
