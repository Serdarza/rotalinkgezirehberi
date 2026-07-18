import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DownloadModal } from "@/components/layout/DownloadModal";
import { JsonLd } from "@/components/seo/JsonLd";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SITE } from "@/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ADSENSE } from "@/config/ads";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: ["rotalink", "kamu misafirhanesi", "polisevi", "öğretmenevi", "orduevi", "seyahat rehberi"],
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-dvh bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}>
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.client}`}
        />
        <ThemeProvider>
          <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
          <DownloadModal />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
