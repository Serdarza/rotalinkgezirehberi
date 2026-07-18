import Link from "next/link";
import { Container, Section, GlassCard } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { BLOG_POSTS } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Kamu tesisleri ve seyahat rehberi yazıları.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero title="Blog" description="Seyahat ve kamu tesisleri hakkında yazılar." />
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <GlassCard className="h-full hover:-translate-y-1 transition-transform">
                  <time className="text-xs font-medium text-[#0F62FE]">
                    {new Date(post.date).toLocaleDateString("tr-TR")}
                  </time>
                  <h2 className="mt-2 text-xl font-bold">{post.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
