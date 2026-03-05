import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Agent Intro & Outro Card | Real Estate Contact Card Generator",
  description:
    "Create a professional agent intro/outro card for listing photos, videos, and social media. Add your headshot, contact details, brokerage, and brand colors. Free, no signup.",
};

export default function AgentIntroCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
