import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { ShareButton } from "@/components/share/ShareButton";
import { BLOG_POSTS } from "@/config/site";
import { getBlogContentComponent } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return buildMetadata({ title: post.title, description: post.excerpt, path: `/blog/${slug}` });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const Content = getBlogContentComponent(slug);

  return (
    <>
      <PageHero title={post.title} description={post.excerpt} />
      <Container className="max-w-3xl py-16">
        <div className="mb-8 flex justify-end">
          <ShareButton
            title={post.title}
            text={`${post.title} — Rotalink`}
            path={`/blog/${slug}`}
          />
        </div>
        {Content ? (
          <Content />
        ) : (
          <p className="text-slate-600 dark:text-slate-400">
            Bu yazı yakında güncellenecektir. Kamu tesisleri ve seyahat rehberi hakkında
            detaylı içerikler için bizi takip etmeye devam edin.
          </p>
        )}
      </Container>
    </>
  );
}
