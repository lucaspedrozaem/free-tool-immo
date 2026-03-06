import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sky Replacement & Brightener | MLS Photo Tools",
  description:
    "Brighten dull skies in listing photos or replace overcast skies with a clean blue gradient. Free, browser-based, no upload required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
