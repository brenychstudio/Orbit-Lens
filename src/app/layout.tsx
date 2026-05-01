import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://orbit-lens.brenychinfo.workers.dev/"),
  title: "Orbit Lens — AI Spatial Glasses Interface Concept",
  description:
    "A fictional AI spatial glasses product concept. Orbit Lens explores calm field-of-view intelligence, translucent interface layers and gesture-led product storytelling.",
  openGraph: {
    title: "Orbit Lens — AI Spatial Glasses Interface Concept",
    description:
      "A fictional AI spatial glasses product concept with a cinematic field-of-view interface, optical inspection mode and gesture-led spatial storytelling.",
    url: "https://orbit-lens.brenychinfo.workers.dev/",
    siteName: "Orbit Lens",
    images: [
      {
        url: "/og/orbit-lens-og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Orbit Lens AI spatial glasses interface concept",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit Lens — AI Spatial Glasses Interface Concept",
    description:
      "A fictional AI spatial glasses product concept with cinematic spatial interface layers.",
    images: ["/og/orbit-lens-og-1200x630.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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

