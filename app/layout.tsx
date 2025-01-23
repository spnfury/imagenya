import Providers from "@/app/providers";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";

const anonymousPro = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-anonymous-pro",
});

let title = "BlinkShot – Real-Time AI Image Generator";
let description = "Generate images with AI in a milliseconds";
let url = "https://www.blinkshot.io/";
let ogimage = "https://www.blinkshot.io/og-image.png";
let sitename = "blinkshot.io";

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
    <html lang="en" className={`h-full ${anonymousPro.variable} font-sans`}>
      <head>
        <PlausibleProvider domain="loras.dev" />
      </head>
      <body className="h-full min-h-full bg-gray-100 font-sans text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
