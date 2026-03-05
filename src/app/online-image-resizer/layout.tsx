import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Image Resizer | Batch Resize Photos Online",
  description:
    "Resize multiple images to any dimension instantly. Free online batch image resizer — set custom width, height, and output format. Runs in your browser with no uploads required.",
};

export default function OnlineImageResizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
