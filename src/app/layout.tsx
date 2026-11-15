import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

// The design system's typeface for all text (design-system.md, Type). The logo keeps its own lettering.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ZAP! Study in space",
  description:
    "ZAP! is a study tool for Meta Quest 3. Say a topic, throw it into space as a star, zap stars together, then step inside any of them.",
  openGraph: {
    title: "ZAP! Study in space",
    description: "Say it. Throw it. Zap it. Step inside.",
    images: ["/art/zap-icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#dadee3",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", bricolage.variable)}>
      <body>{children}</body>
    </html>
  );
}
