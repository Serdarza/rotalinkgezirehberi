/**
 * /indir yükleme durumu — mobil yönlendirme sırasında gösterilir.
 */
export default function IndirLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500 dark:border-sky-800 dark:border-t-sky-400"
        role="status"
        aria-label="Sayfa yükleniyor"
      />
    </main>
  );
}
