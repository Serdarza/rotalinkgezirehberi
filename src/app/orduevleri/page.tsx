import { HubPage, hubMetadata } from "@/components/seo/HubPage";

export const metadata = hubMetadata("/orduevleri/");

export default function OrduevleriPage() {
  return <HubPage path="/orduevleri/" />;
}