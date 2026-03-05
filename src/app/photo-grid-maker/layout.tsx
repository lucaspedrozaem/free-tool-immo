import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Photo Grid Maker | Create Listing Collages Online",
  description:
    "Create clean 2x2, 3x1, or 2x1 photo grids for real estate listings. Free browser-based collage maker - perfect for social media, MLS, and marketing. No signup required.",
};

export default function PhotoGridMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
