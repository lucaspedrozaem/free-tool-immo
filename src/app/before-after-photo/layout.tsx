import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Before & After Photo Comparison | MLS Photo Tools",
  description:
    "Create side-by-side or split before/after comparison images for renovations, staging, and listing improvements. Free, browser-based, no upload.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
