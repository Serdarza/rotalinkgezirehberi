"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { SITE } from "@/config/site";

type Status = "idle" | "sending" | "success" | "error";

const SUBJECTS = [
  "Genel soru",
  "Yeni tesis önerisi",
  "Hata bildirimi",
  "Geri bildirim",
  "Diğer",
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — botlar doldurursa sessizce "başarılı" göster
    if (String(data.get("website") || "").trim()) {
      setStatus("success");
      return;
    }

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      setError("Lütfen zorunlu alanları doldurun.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    const payload = {
      name,
      email,
      subject,
      message,
      _subject: `Rotalink İletişim: ${subject || "Mesaj"}`,
      _template: "table",
      _captcha: "false",
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${SITE.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Form gönderilemedi");
      form.reset();
      setStatus("success");
    } catch {
      // Yedek: mailto ile istemci üzerinden e-posta
      const body = encodeURIComponent(
        `Ad Soyad: ${name}\nE-posta: ${email}\nKonu: ${subject}\n\n${message}`
      );
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        `Rotalink: ${subject || "İletişim"}`
      )}&body=${body}`;
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden />
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Mesajınız alındı
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          En kısa sürede {SITE.email} üzerinden size dönüş yapacağız.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-[#0F62FE] hover:underline"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      noValidate
    >
      <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Bize Ulaşın</h2>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Yeni tesis önerisi, hata bildirimi veya geri bildirimleriniz için formu doldurun.
        Mesajınız doğrudan ekibimize iletilir.
      </p>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Ad Soyad *
          </span>
          <input
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="Adınız"
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            E-posta *
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="ornek@mail.com"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Konu
        </span>
        <select
          name="subject"
          defaultValue={SUBJECTS[0]}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Mesajınız *
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          placeholder="Mesajınızı yazın..."
        />
      </label>

      {status === "error" && error && (
        <p className="mt-3 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F62FE] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Gönderiliyor...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Mesaj Gönder
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-slate-500">
        Alternatif:{" "}
        <a href={`mailto:${SITE.email}`} className="font-medium text-[#0F62FE] hover:underline">
          {SITE.email}
        </a>
      </p>
    </form>
  );
}
