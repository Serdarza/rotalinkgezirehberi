import Link from "next/link";
import { Container, Section, SectionHeading, GlassCard } from "@/components/ui/Section";
import { BLOG_POSTS } from "@/config/site";

export function BlogSection() {
  return (
    <Section className="bg-white dark:bg-slate-950">
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Seyahat Rehberi"
          description="Kamu tesisleri ve seyahat ipuçları hakkında yazılar."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <GlassCard className="h-full transition-transform hover:-translate-y-1">
                <time className="text-xs font-medium text-[#0F62FE]">
                  {new Date(post.date).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{post.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-sm font-semibold text-[#0F62FE] hover:underline">Tüm yazılar →</Link>
        </div>
      </Container>
    </Section>
  );
}
