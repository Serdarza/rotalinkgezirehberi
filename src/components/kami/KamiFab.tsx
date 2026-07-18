"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Send, X } from "lucide-react";
import { buildKamiReply, KAMI_CHIPS, type KamiLink } from "@/lib/kami";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "kami" | "user";
  text: string;
  links?: KamiLink[];
  tip?: string;
};

type Props = {
  cities: string[];
};

/** Uygulamadaki KAMİ konuşma balonu mesaj havuzunun web karşılığı. */
const BUBBLE_MESSAGES = [
  "💬 Size Rotalink veritabanından nasıl yardımcı olabilirim?",
  "🏨 Yakınınızdaki kamu tesislerini listeleyebilirim.",
  "☕ Belediye sosyal tesislerini gösterebilirim.",
  "🍽 İl bazında yöresel yemek önerilerini paylaşabilirim.",
  "🏛 Gezilecek yerleri veritabanından bulabilirim.",
  "🌿 Hafta sonu için yakın illeri önerebilirim.",
  "🔍 Tesis adı veya il ile arama yapabilirim.",
] as const;

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "kami",
  text:
    "Merhaba, ben KAMİ — Akıllı Kamu Seyahat Asistanı. Türkiye genelinde kamu tesisleri, gezi, yemek ve rota konusunda yardımcı olurum.",
  links: [
    { label: "İl ara", href: "/#ara" },
    { label: "Uygulamayı indir", href: "/indir" },
  ],
  tip: "Hazır sorulardan birini seçin veya kendi sorunuzu yazın.",
};

const BUBBLE_DISMISS_KEY = "rotalink_kami_bubble_dismissed";

function playNotificationSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const gain = context.createGain();
    const oscillator = context.createOscillator();
    const now = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.25);
    oscillator.addEventListener("ended", () => void context.close());
  } catch {
    // Tarayıcı otomatik sesi engellerse sohbet yine normal şekilde açılır.
  }
}

export function KamiFab({ cities }: Props) {
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(BUBBLE_DISMISS_KEY)) return;
    const timer = window.setTimeout(() => {
      setBubble(
        BUBBLE_MESSAGES[Math.floor(Math.random() * BUBBLE_MESSAGES.length)]
      );
      playNotificationSound();
    }, 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const dismissBubble = useCallback(() => {
    setBubble(null);
    try {
      sessionStorage.setItem(BUBBLE_DISMISS_KEY, "1");
    } catch {
      // sessionStorage kullanılamıyorsa balon sadece bu görünümde kapanır
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking, open]);

  function toggleOpen() {
    if (!open) playNotificationSound();
    dismissBubble();
    setOpen((prev) => !prev);
  }

  function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: q },
    ]);
    setInput("");
    setThinking(true);

    window.setTimeout(() => {
      const reply = buildKamiReply(q, cities);
      setMessages((prev) => [
        ...prev,
        {
          id: `k-${Date.now()}`,
          role: "kami",
          text: reply.text,
          links: reply.links,
          tip: reply.tip,
        },
      ]);
      setThinking(false);
    }, 420);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <>
      {/* Sohbet paneli */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-3 bottom-40 z-[80] flex max-h-[min(72dvh,620px)] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-black/25 dark:border-slate-700 dark:bg-slate-900 sm:inset-x-auto sm:bottom-28 sm:right-5 sm:w-[400px] md:bottom-24"
            role="dialog"
            aria-label="KAMİ sohbet penceresi"
          >
            {/* Başlık */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#0F62FE] to-[#14B8A6] px-4 py-3.5 text-white">
              <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/60">
                <Image
                  src="/kami-logo.png"
                  alt="KAMİ"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">KAMİ</p>
                <p className="text-[11px] leading-tight text-white/80">
                  Akıllı Kamu Seyahat Asistanı · Çevrimiçi
                </p>
              </div>
              <Link
                href="/indir"
                className="hidden items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-white/25 sm:inline-flex"
              >
                <Download className="h-3 w-3" aria-hidden />
                Uygulama
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 transition hover:bg-white/20"
                aria-label="Sohbeti kapat"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Mesajlar */}
            <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "kami" && (
                      <span className="relative mr-2 mt-0.5 block h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src="/kami-logo.png"
                          alt=""
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                        msg.role === "user"
                          ? "rounded-br-md bg-[#0F62FE] text-white"
                          : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      )}
                    >
                      <p>{msg.text}</p>
                      {msg.tip && (
                        <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {msg.tip}
                        </p>
                      )}
                      {msg.links && msg.links.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {msg.links.map((link) => (
                            <Link
                              key={link.href + link.label}
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className="inline-flex rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0F62FE] ring-1 ring-[#0F62FE]/25 transition hover:bg-[#0F62FE] hover:text-white dark:bg-slate-900"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {thinking && (
                <div className="flex items-start justify-start">
                  <span className="relative mr-2 mt-0.5 block h-7 w-7 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/kami-logo.png"
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </span>
                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Hazır sorular */}
            <div className="flex gap-1.5 overflow-x-auto border-t border-slate-200/80 px-3 py-2 [scrollbar-width:none] dark:border-slate-800 [&::-webkit-scrollbar]:hidden">
              {KAMI_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => ask(chip)}
                  disabled={thinking}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-[#14B8A6]/50 hover:bg-[#14B8A6]/10 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Giriş */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200/80 p-2.5 dark:border-slate-800"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Bana bir şey sor..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-900 outline-none transition focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  aria-label="KAMİ’ye soru yazın"
                />
                <button
                  type="submit"
                  disabled={thinking || !input.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-[#0F62FE] px-3.5 text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Gönder"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konuşma balonu */}
      <AnimatePresence>
        {bubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="fixed bottom-[10.5rem] right-4 z-[75] max-w-[240px] sm:bottom-[7.5rem] sm:right-5 md:bottom-[6.5rem]"
          >
            <div className="relative rounded-2xl rounded-br-md border border-slate-200/80 bg-white px-3.5 py-2.5 text-[12px] font-medium leading-snug text-slate-700 shadow-xl shadow-black/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <button
                type="button"
                onClick={dismissBubble}
                className="absolute -right-1.5 -top-1.5 rounded-full border border-slate-200 bg-white p-0.5 text-slate-400 shadow transition hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800"
                aria-label="Mesajı kapat"
              >
                <X className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={toggleOpen}
                className="text-left"
              >
                {bubble}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — uygulamadaki KAMİ logosu */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-24 right-4 z-[75] block h-14 w-14 overflow-hidden rounded-full shadow-xl shadow-black/30 ring-2 ring-white/70 transition hover:scale-105 dark:ring-slate-700 sm:bottom-9 sm:right-5 md:bottom-6"
        aria-label={open ? "KAMİ sohbetini kapat" : "KAMİ — Akıllı seyahat asistanı"}
        title="KAMİ — Akıllı seyahat asistanı"
      >
        {!open && (
          <span
            className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#14B8A6]/40 [animation-duration:2.4s]"
            aria-hidden
          />
        )}
        <Image
          src="/kami-logo.png"
          alt="KAMİ"
          fill
          sizes="56px"
          className="object-cover"
          priority={false}
        />
        {open && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/55">
            <X className="h-6 w-6 text-white" />
          </span>
        )}
      </motion.button>
    </>
  );
}
