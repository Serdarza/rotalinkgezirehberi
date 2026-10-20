import { BLOG_POSTS } from "@/config/blog";
import { CATEGORY_DEFS, CATEGORY_SLUGS, HUB_DEFS } from "@/config/categories";
import { LEGAL_PAGES } from "@/config/legal";
import { categoryCount, getCityBundles, getFacilityIndex } from "@/lib/facilities";
import { getCampaigns } from "@/lib/kampanyaRepo";
import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bundles = [...(await getCityBundles()).values()];
  const campaigns = await getCampaigns();
  const facilities = await getFacilityIndex();
  const now = new Date();

  const staticPages = [
    "/indir",
    "/hakkimizda",
    "/iletisim",
    "/kampanyalar",
    "/resmi-tatiller",
    "/blog",
    "/sik-sorulan-sorular",
    ...LEGAL_PAGES.map((p) => `/${p.slug}`),
  ];

  const entries: Entry[] = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    ...staticPages.map<Entry>((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly",
      priority: path === "/blog" ? 0.8 : 0.5,
    })),
    ...HUB_DEFS.map<Entry>((hub) => ({
      url: absoluteUrl(hub.path),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    ...bundles.map<Entry>((b) => ({
      url: absoluteUrl(`/sehir/${b.slug}/`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];

  for (const b of bundles) {
    for (const slug of CATEGORY_SLUGS) {
      if (categoryCount(b, CATEGORY_DEFS[slug]) > 0) {
        entries.push({
          url: absoluteUrl(`/sehir/${b.slug}/${slug}/`),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  for (const e of facilities) {
    entries.push({
      url: absoluteUrl(e.path),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  for (const c of campaigns) {
    entries.push({
      url: absoluteUrl(`/kampanyalar/${c.slug}/`),
      lastModified: c.createdAt ? new Date(c.createdAt) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const post of BLOG_POSTS) {
    entries.push({
      url: absoluteUrl(`/blog/${post.slug}/`),
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly",
      priority: post.featured ? 0.8 : 0.6,
    });
  }

  return entries;
}
