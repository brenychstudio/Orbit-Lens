import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbit-lens.brenychstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Orbit Lens",
  title: {
    default: "Orbit Lens — AI Spatial Glasses Concept",
    template: "%s — Orbit Lens",
  },
  description:
    "A fictional AI spatial glasses product concept and premium interactive interface prototype by Brenych Studio.",
  keywords: [
    "Orbit Lens",
    "AI spatial glasses",
    "AR eyewear concept",
    "WebXR interface",
    "interactive product storytelling",
    "premium front-end system",
    "Brenych Studio",
  ],
  authors: [{ name: "Brenych Studio" }],
  creator: "Brenych Studio",
  publisher: "Brenych Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Orbit Lens",
    title: "Orbit Lens — AI Spatial Glasses Concept",
    description:
      "A fictional AI spatial glasses product concept where the website behaves like the product interface.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit Lens — AI Spatial Glasses Concept",
    description:
      "A premium interactive product interface prototype for fictional AI spatial glasses.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#030407",
  colorScheme: "dark",
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
