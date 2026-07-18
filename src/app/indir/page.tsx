import { IndirClient } from "@/components/indir/IndirClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Rotalink Uygulamasını İndir",
  description:
    "Rotalink mobil uygulamasını Google Play veya App Store üzerinden indirin. Kamu tesisleri ve seyahat rehberi cebinizde.",
  path: "/indir",
});

/** /indir — mobilde mağazaya yönlendir, masaüstünde indirme sayfası */
export default function IndirPage() {
  return <IndirClient />;
}
