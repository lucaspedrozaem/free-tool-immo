import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Privacy Blur Tool | Blur Parts of Listing Photos Online",
  description:
    "Blur license plates, faces, security pads, and personal items in real estate photos. Free browser-based privacy tool — paint to blur. No Photoshop needed, no upload required.",
};

export default function BlurPhotoPrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
