import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free MLS Photo Resizer | Batch Resize Real Estate Images Online",
  description:
    "100% free batch image resizer for real estate. Instantly resize photos to meet exact MLS, Zillow, and Realtor.com size requirements without losing quality.",
};

export default function MlsPhotoResizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
