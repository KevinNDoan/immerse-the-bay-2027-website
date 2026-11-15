import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ZAP! Study in space",
  description:
    "ZAP! is a study tool for Meta Quest 3. Say a topic, throw it into space as a star, zap stars together, then step inside any of them.",
  openGraph: {
    title: "ZAP! Study in space",
    description: "Say it. Throw it. Zap it. Step inside.",
    images: ["/art/app_icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07050d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  );
}
