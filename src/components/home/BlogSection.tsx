import Link from "next/link";
import { Container, Section, SectionHeading, GlassCard } from "@/components/ui/Section";
import { BLOG_POSTS, getBlogCategory } from "@/config/blog";

export function BlogSection() {
  const posts = [...BLOG_POSTS]
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.date.localeCompare(a.date))
    .slice(0, 6);
  return (
    <Section className="bg-white dark:bg-slate-950">
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Seyahat Rehberi"
          description="Kamu sosyal tesisleri, misafirhaneler ve seyahat ipuçları hakkında yazılar."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}/`}>
              <GlassCard className="h-full transition-transform hover:-translate-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#14B8A6]">
                  {getBlogCategory(post.category).label}
                </span>
                <time className="mt-1 block text-xs font-medium text-[#0F62FE]">
                  {new Date(post.date).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{post.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/blog/" className="text-sm font-semibold text-[#0F62FE] hover:underline">Tüm yazılar →</Link>
        </div>
      </Container>
    </Section>
  );
}
