import { HubPage, hubMetadata } from "@/components/seo/HubPage";

export const metadata = hubMetadata("/kamu-misafirhaneleri/");

export default function KamuMisafirhaneleriPage() {
  return <HubPage path="/kamu-misafirhaneleri/" />;
}