import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free EXIF Data Remover | Strip GPS & Metadata from Photos",
  description:
    "Remove GPS coordinates, camera info, and metadata from real estate listing photos to protect seller and tenant privacy. 100% free, runs in your browser.",
  openGraph: {
    title: "Free EXIF Data Remover | Strip GPS & Metadata from Photos",
    description:
      "Protect seller and tenant privacy by stripping GPS coordinates and metadata from listing photos. Free, browser-based, no upload required.",
  },
};

export default function RemoveExifDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
