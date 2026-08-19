import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "Pierre the Penguin — PFP Generator",
  description: "Dress up Pierre, add a caption, and download your own Pierre the Penguin PFP.",
  icons: {
    icon: [{ url: "/favicon.png?v=6", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.png?v=6",
    apple: "/favicon.png?v=6",
  },
  openGraph: { title: "Pierre the Penguin", description: "Make your Pierre.", images: [{ url: "/og.png?v=5", width: 2172, height: 724, alt: "Pierre the Penguin on a crooked polar coast" }] },
  twitter: { card: "summary_large_image", title: "Pierre the Penguin", description: "Make your Pierre.", images: ["/og.png?v=5"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
