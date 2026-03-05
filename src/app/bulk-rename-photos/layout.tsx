import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Bulk Rename Photos | SEO-Friendly Photo Renaming",
  description:
    "Rename listing photos with SEO-friendly file names based on the property address. Boost search visibility with descriptive, keyword-rich photo names. 100% free.",
  openGraph: {
    title: "Free Bulk Rename Photos | SEO-Friendly Photo Renaming",
    description:
      "Rename listing photos to SEO-friendly file names like 123-Main-Street-01.jpg. Free, browser-based bulk renaming for real estate.",
  },
};

export default function BulkRenamePhotosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
