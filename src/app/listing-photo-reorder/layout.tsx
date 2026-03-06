import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing Photo Reorder & Sequence | MLS Photo Tools",
  description:
    "Drag-and-drop reorder your listing photos before MLS upload. Set the perfect sequence, rename by order, and download as a ZIP. Free, browser-based.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
