import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Bulk QR Code on Photos | Add QR Code to Listing Photos",
  description:
    "Add a QR code to all your listing photos in bulk. Link to your website, listing page, or virtual tour. Position anywhere, adjust size and opacity. Free, no signup.",
};

export default function BulkQrCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
