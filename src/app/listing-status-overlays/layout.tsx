import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Listing Status Overlays | Just Listed, Just Sold, Price Reduced",
  description:
    "Add Just Listed, Just Sold, Under Contract, and Price Reduced ribbons to listing photos. Free one-click overlays for real estate social media. Batch apply to 50+ photos.",
};

export default function ListingStatusOverlaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
