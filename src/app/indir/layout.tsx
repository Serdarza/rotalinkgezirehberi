import type { Metadata } from "next";
import { APP_INFO } from "@/config/downloads";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `${APP_INFO.name} — İndir`,
  description: APP_INFO.description,
  path: "/indir",
});

export default function IndirLayout({ children }: { children: React.ReactNode }) {
  return children;
}
