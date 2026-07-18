import type { ComponentType } from "react";
import { KamuMisafirhanesiRehberiContent } from "./kamu-misafirhanesi-rehberi";
import { OgretmeneviKonaklamaContent } from "./ogretmenevi-konaklama";

export const BLOG_CONTENT: Record<string, ComponentType> = {
  "kamu-misafirhanesi-rehberi": KamuMisafirhanesiRehberiContent,
  "ogretmenevi-konaklama": OgretmeneviKonaklamaContent,
};

export function getBlogContentComponent(slug: string): ComponentType | null {
  return BLOG_CONTENT[slug] ?? null;
}
