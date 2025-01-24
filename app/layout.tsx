import Providers from "@/app/providers";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-dm-sans",
});

let title = "Loras – Generate AI Images with LoRAs";
let description = "Generate AI Images with LoRAs in seconds.";
let url = "https://www.loras.dev/";
let ogimage = "https://www.loras.dev/og-image.png";
let sitename = "loras.dev";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${ibmPlexMono.variable} ${dmSans.variable}`}
    >
      <head>
        <PlausibleProvider domain="loras.dev" />
      </head>
      <body className="h-full min-h-full font-sans text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
