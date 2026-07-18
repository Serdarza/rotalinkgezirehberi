import type { ComponentType } from "react";
import { KamuMisafirhanesiRehberiContent } from "./kamu-misafirhanesi-rehberi";
import { OgretmeneviKonaklamaContent } from "./ogretmenevi-konaklama";
import { TurkiyeSeyahatIpuclariContent } from "./turkiye-seyahat-ipuclari";

export const BLOG_CONTENT: Record<string, ComponentType> = {
  "kamu-misafirhanesi-rehberi": KamuMisafirhanesiRehberiContent,
  "ogretmenevi-konaklama": OgretmeneviKonaklamaContent,
  "turkiye-seyahat-ipuclari": TurkiyeSeyahatIpuclariContent,
};

export function getBlogContentComponent(slug: string): ComponentType | null {
  return BLOG_CONTENT[slug] ?? null;
}
