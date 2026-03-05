import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free 9:16 Social Media Photo Formatter | Instagram Stories & TikTok",
  description:
    "Convert horizontal listing photos to vertical 9:16 format for Instagram Stories, TikTok, and Reels. Blurred background fill — no cropping. Free for real estate agents.",
};

export default function SocialMediaFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
