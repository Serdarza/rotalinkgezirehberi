import { SITE, BLOG_POSTS } from "@/config/site";
import { LEGAL_PAGES } from "@/config/legal";
import { getAllData } from "@/lib/data";
import { slugifyCity } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { cities } = await getAllData();
  const base = SITE.url;

  const staticPages = [
    "",
    "/indir",
    "/hakkimizda",
    "/iletisim",
    "/blog",
    "/sik-sorulan-sorular",
    ...LEGAL_PAGES.map((p) => `/${p.slug}`),
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...cities.map((city) => ({
      url: `${base}/sehir/${slugifyCity(city)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
