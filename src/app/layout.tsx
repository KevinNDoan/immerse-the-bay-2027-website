import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Immerse the Bay 2027",
  description: "Immerse the Bay 2027. More details coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
