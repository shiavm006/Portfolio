import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/lib/siteMeta";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * The live address of the site. Link previews (X, LinkedIn, WhatsApp) need
 * absolute image URLs, and Next.js builds them from this.
 * Set NEXT_PUBLIC_SITE_URL in .env.local, e.g. https://shivammittal.dev
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.name,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    url: "/",
    siteName: SITE.name,
    description: SITE.description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    creator: SITE.xHandle,
  },
  authors: [{ name: SITE.name }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
