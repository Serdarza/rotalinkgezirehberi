import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { DownloadModal } from "@/components/layout/DownloadModal";
import { KamiFab } from "@/components/kami/KamiFab";
import { JsonLd } from "@/components/seo/JsonLd";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FacilityImageBootstrap } from "@/components/providers/FacilityImageBootstrap";
import { CopyProtection } from "@/components/providers/CopyProtection";
import { SideRailAds } from "@/components/ads/SideRailAds";
import { SITE } from "@/config/site";
import { getAllData } from "@/lib/data";
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
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: ["rotalink", "kamu misafirhanesi", "polisevi", "öğretmenevi", "orduevi", "seyahat rehberi"],
  other: {
    "google-adsense-account": ADSENSE.client,
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: SITE.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.png"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { cities } = await getAllData();

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
          <FacilityImageBootstrap />
          <CopyProtection />
          <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
          <DownloadModal />
          <Header />
          <SideRailAds />
          <main id="main-content" className="xl:px-[148px] 2xl:px-[172px]">
            {children}
          </main>
          <div className="pb-20 md:pb-0 xl:px-[148px] 2xl:px-[172px]">
            <Footer />
          </div>
          <MobileBottomNav />
          <KamiFab cities={cities} />
        </ThemeProvider>
      </body>
    </html>
  );
}
