import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/shiavm006/Portfolio"),
  title: {
    default: "Shivam Mittal — Portfolio",
    template: "%s · Shivam Mittal",
  },
  description:
    "Interactive macOS-style portfolio by Shivam Mittal — Product, GTM, Applied AI, and Growth engineer.",
  openGraph: {
    title: "Shivam Mittal — Portfolio",
    description:
      "Interactive macOS-style portfolio — Product, GTM, Applied AI, and Growth engineer.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Mittal — Portfolio",
    description:
      "Interactive macOS-style portfolio — Product, GTM, Applied AI, and Growth engineer.",
  },
  authors: [{ name: "Shivam Mittal" }],
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
