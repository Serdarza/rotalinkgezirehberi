import Link from "next/link";
import { Mail, Clock, AlertTriangle, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/config/site";

export const metadata = buildMetadata({
  title: "İletişim",
  description: `Rotalink ile iletişime geçin — hatalı tesis bilgisi bildirimi, öneri ve iş birliği için ${SITE.email}`,
  path: "/iletisim",
});

const REASONS = [
  {
    icon: AlertTriangle,
    title: "Hatalı veya eksik bilgi bildirimi",
    text: "Bir tesisin telefonu, adresi veya açıklaması yanlışsa bize yazın. Bildirimleri öncelikli olarak inceleyip düzeltiyoruz.",
  },
  {
    icon: MessageSquare,
    title: "Yeni tesis ve kampanya önerisi",
    text: "Listede olmayan bir kamu tesisi ya da kamu personeline özel bir kampanya biliyorsanız paylaşın.",
  },
  {
    icon: Mail,
    title: "İçerik kaldırma ve telif talepleri",
    text: "Hak sahibi olduğunuz bir görsel veya metnin kaldırılmasını talep edebilirsiniz.",
  },
];

export default function IletisimPage() {
  return (
    <>
      <PageHero
        title="İletişim"
        description="Sorularınız, düzeltme bildirimleriniz ve önerileriniz için bize ulaşın."
      />
      <Container className="max-w-3xl py-12 sm:py-16">
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <Mail className="h-5 w-5 text-[#0F62FE]" aria-hidden />
            <h2 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              E-posta
            </h2>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-1 block text-sm font-semibold text-[#0F62FE] hover:underline"
            >
              {SITE.email}
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <Clock className="h-5 w-5 text-[#0F62FE]" aria-hidden />
            <h2 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              Yanıt süresi
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Mesajlar hafta içi 1–3 iş günü içinde yanıtlanır.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Hangi konularda yazabilirsiniz?
          </h2>
          <div className="mt-4 space-y-3">
            {REASONS.map((r) => (
              <div
                key={r.title}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <r.icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F62FE]"
                  aria-hidden
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {r.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            İletişim formu
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Bir tesisle ilgili bildirimde bulunuyorsanız lütfen tesisin adını ve
            ilini de yazın.
          </p>
          <div className="mt-5">
            <ContactForm />
          </div>
        </section>

        <section className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="mb-1 text-base font-bold text-slate-900 dark:text-white">
            Sosyal medya
          </h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Güncellemeler ve duyurular için bizi takip edin.
          </p>
          <SocialLinks variant="full" />
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Rezervasyon yapabilir miyiz?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Hayır. Rotalink bir rehber platformudur; rezervasyon, oda tahsisi
            veya giriş izni konusunda yetkisi yoktur. Konaklama talepleriniz
            için ilgili tesisin telefonunu tesis sayfasından bulup doğrudan
            arayınız. Ayrıntılar için{" "}
            <Link
              href="/kullanim-sartlari"
              className="font-semibold text-[#0F62FE] hover:underline"
            >
              Kullanım Şartları
            </Link>{" "}
            sayfasına göz atabilirsiniz.
          </p>
        </section>
      </Container>
    </>
  );
}
