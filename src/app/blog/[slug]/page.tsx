import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/layout/PageHeader";
import { ShareButton } from "@/components/share/ShareButton";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ACCENT_STYLES,
  AppCtaCard,
  RelatedPostsGrid,
} from "@/components/seo/ListingParts";
import { BLOG_POSTS, getBlogCategory, getBlogPost, relatedPosts } from "@/config/blog";
import { getBlogContentComponent } from "@/content/blog";
import { ARTICLES } from "@/content/blog/articles";
import { StructuredArticle } from "@/content/blog/StructuredArticle";
import { getArticleContext } from "@/lib/blogStats";
import { blogPostingJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}/`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const category = getBlogCategory(post.category);
  const accent = ACCENT_STYLES[category.accent];
  const path = `/blog/${slug}/`;

  const Legacy = getBlogContentComponent(slug);
  const build = ARTICLES[slug];
  const article = build ? build(await getArticleContext()) : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: "Blog", path: "/blog/" },
            { name: post.title, path },
          ]),
          blogPostingJsonLd({
            title: post.title,
            description: post.excerpt,
            path,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
          }),
        ]}
      />

      <header className="border-b border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-900/50 sm:py-14">
        <Container className="max-w-3xl">
          <Breadcrumb
            items={[
              { label: "Anasayfa", href: "/" },
              { label: "Blog", href: "/blog/" },
              { label: category.label },
            ]}
          />
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-bold",
              accent.badge
            )}
          >
            {category.label}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{post.excerpt}</p>
          <p className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden />
              {post.readMinutes} dk okuma
            </span>
            <span>Rotalink Editör</span>
          </p>
        </Container>
      </header>

      <Container className="max-w-3xl py-12 sm:py-16">
        <div className="mb-8 flex justify-end">
          <ShareButton title={post.title} text={`${post.title} — Rotalink`} path={path} />
        </div>

        {article ? (
          <StructuredArticle def={article} />
        ) : Legacy ? (
          <Legacy />
        ) : (
          <p className="text-slate-600 dark:text-slate-400">
            Bu yazı yakında güncellenecektir. Kamu tesisleri ve seyahat rehberi hakkında
            detaylı içerikler için bizi takip etmeye devam edin.
          </p>
        )}

        <aside
          className={cn(
            "mt-12 flex flex-col gap-3 rounded-2xl border border-l-4 border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between",
            accent.bar
          )}
        >
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {category.label} hakkında tesis listesi
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {category.description}
            </p>
          </div>
          <Link
            href={category.hubPath}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline",
              accent.text
            )}
          >
            {category.hubLabel} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </aside>

        <RelatedPostsGrid posts={relatedPosts(slug, post.category, 3)} title="Bunları da okuyun" />
        <AppCtaCard className="mt-12" />
      </Container>
    </>
  );
}
