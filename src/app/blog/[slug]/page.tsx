import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { BLOG_POSTS } from "@/config/site";
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

  return (
    <>
      <PageHero title={post.title} description={post.excerpt} />
      <Container className="prose prose-slate max-w-3xl py-16 dark:prose-invert">
        <p>
          Bu yazı yakında güncellenecektir. Kamu tesisleri ve seyahat rehberi hakkında
          detaylı içerikler için bizi takip etmeye devam edin.
        </p>
      </Container>
    </>
  );
}
