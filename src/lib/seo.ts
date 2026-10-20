import { SITE, SOCIAL_LINKS } from "@/config/site";
import type { Metadata } from "next";

/**
 * Mutlak URL. `trailingSlash: true` ile uyumlu olması için dosya olmayan tüm
 * yollar `/` ile biter (canonical, sitemap ve JSON-LD tek biçimde kalır).
 */
export function absoluteUrl(path = ""): string {
  const raw = path.startsWith("/") ? path : `/${path}`;
  const hasQueryOrHash = /[?#]/.test(raw);
  const looksLikeFile = /\.[a-z0-9]{2,5}$/i.test(raw);
  const normalized =
    hasQueryOrHash || looksLikeFile || raw.endsWith("/") ? raw : `${raw}/`;
  return `${SITE.url}${normalized}`;
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  /** Open Graph / paylaşım görseli (varsayılan: /og.png) */
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Blog yazıları için `article` */
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  image = "/og.png",
  imageWidth = 1200,
  imageHeight = 630,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const isLogo = image.includes("logo");
  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      ...(type === "article"
        ? {
            type: "article" as const,
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
          }
        : { type: "website" as const }),
      images: [
        {
          url: ogImage,
          width: imageWidth,
          height: imageHeight,
          alt: SITE.name,
        },
      ],
    },
    twitter: {
      card: isLogo ? "summary" : "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.png"),
    description: SITE.description,
    email: SITE.email,
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };
}

/**
 * Sitede genel arama sayfası olmadığı için SearchAction eklenmez
 * (yanlış hedefli şema Search Console uyarısı üretir).
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: absoluteUrl("/"),
    inLanguage: "tr-TR",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: ReadonlyArray<{ readonly q: string; readonly a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Liste sayfaları (il kategorileri, hub sayfaları) için ItemList. */
export function itemListJsonLd(
  name: string,
  items: { name: string; path: string }[],
  max = 100
) {
  const list = items.slice(0, max);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: list.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "tr-TR",
    isPartOf: { "@id": `${SITE.url}/#website` },
  };
}

/** Konaklama tesisi sayfası. Fiyat / puan / telefon bilgisi bilinçli olarak yok. */
export function lodgingJsonLd({
  name,
  path,
  il,
  description,
  adres,
  latitude,
  longitude,
}: {
  name: string;
  path: string;
  il: string;
  description: string;
  adres?: string;
  latitude?: number;
  longitude?: number;
}) {
  const hasGeo =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name,
    url: absoluteUrl(path),
    description,
    address: {
      "@type": "PostalAddress",
      ...(adres ? { streetAddress: adres } : {}),
      addressRegion: il,
      addressCountry: "TR",
    },
    ...(hasGeo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          },
        }
      : {}),
  };
}

export function blogPostingJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "tr-TR",
    image: absoluteUrl("/og.png"),
    author: { "@type": "Organization", name: SITE.name, url: absoluteUrl("/") },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
  };
}
