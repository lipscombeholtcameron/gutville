import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gutville · Food detective games",
  description: "A playful town of food discoveries for curious minds. Explore ultra-processed foods through an educational snakes and ladders adventure.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="antialiased">{children}</body>
    </html>
  );
}
