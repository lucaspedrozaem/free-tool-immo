import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Agent Branding Bar | Add Logo & Contact Info to Listing Photos",
  description:
    "Add your headshot, logo, phone number, and brokerage to listing photos. One-click branding bar overlay for real estate agents. Batch apply to 50+ photos. Free, no signup.",
};

export default function AgentBrandingBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
