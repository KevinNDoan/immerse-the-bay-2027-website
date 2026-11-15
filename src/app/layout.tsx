import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

const bricolage = localFont({
  src: [
    { path: "../../assets/fonts/BricolageGrotesque-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../assets/fonts/BricolageGrotesque-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../assets/fonts/BricolageGrotesque-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../assets/fonts/BricolageGrotesque-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ZAP! Spatial knowledge for Meta Quest",
  description:
    "Speak, place and connect ideas around you, then step inside their worlds. ZAP! is a spatial knowledge space for Meta Quest, built at Immerse the Bay.",
  openGraph: {
    title: "ZAP! Small thought. Infinite worlds.",
    description: "A spatial knowledge space for Meta Quest. Voice, hands and immersive worlds become the interface.",
    images: ["/art/zap-icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#e0e7e4",
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
