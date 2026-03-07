"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SchemaMarkup } from "@/components/SchemaMarkup";

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    );
  }

  return (
    <body className="min-h-screen flex flex-col bg-ash text-midnight antialiased">
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MLS Photo Tools",
          url: "https://mlsphototools.com",
          description:
            "Free browser-based photo formatting utilities for real estate professionals.",
        }}
      />
      <Navbar />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </body>
  );
}
