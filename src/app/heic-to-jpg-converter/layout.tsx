import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free HEIC to JPG Converter | Convert iPhone Photos Online",
  description:
    "Convert HEIC files from iPhones to JPG instantly. Free browser-based tool for real estate agents - batch convert listing photos, strip EXIF data, and resize. No upload required.",
};

export default function HeicToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
