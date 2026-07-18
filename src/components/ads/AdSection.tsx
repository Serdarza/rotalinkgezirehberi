import { AdSenseUnit } from "./AdSenseUnit";
import { Container } from "@/components/ui/Section";

export function AdSection() {
  return (
    <section className="bg-white py-5 dark:bg-slate-950">
      <Container>
        <AdSenseUnit variant="banner" />
      </Container>
    </section>
  );
}

