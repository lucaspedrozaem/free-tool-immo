import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Enhancer - Brightness, Contrast & Exposure | MLS Photo Tools",
  description:
    "Adjust brightness, contrast, exposure, saturation, and sharpness on listing photos. Batch enhance up to 50 photos at once. Free, browser-based, no upload.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
