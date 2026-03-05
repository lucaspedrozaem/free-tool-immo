import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Open House Flyer Generator | Real Estate Flyer Maker",
  description:
    "Create professional open house flyers in seconds. Upload listing photos, add address and price, download a print-ready flyer. Free for real estate agents - no Canva account needed.",
};

export default function OpenHouseFlyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
