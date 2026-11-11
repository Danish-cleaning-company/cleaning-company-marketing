import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { GoogleConsentDefaults } from "@/components/integrations/GoogleConsentDefaults";
import { Integrations } from "@/components/integrations/Integrations";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.companyName,
    template: `%s | ${siteConfig.companyName}`,
  },
  description: siteConfig.companyName,
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "da_DK",
    siteName: siteConfig.companyName,
    title: siteConfig.companyName,
    url: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <head>
        <GoogleConsentDefaults />
      </head>
      <body>
        <Integrations />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
