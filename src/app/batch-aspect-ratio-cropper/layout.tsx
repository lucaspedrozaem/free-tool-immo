import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Batch Aspect Ratio Cropper | Crop Photos for MLS & Instagram",
  description:
    "Batch crop photos to any aspect ratio - 4:3 for MLS, 1:1 for Instagram, 16:9 for presentations. Free browser-based tool for real estate professionals. No upload required.",
};

export default function BatchAspectRatioCropperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
