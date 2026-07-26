import { AdSenseUnit } from "./AdSenseUnit";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Blog yazıları için içerik arası native reklam bandı */
export function InArticleAd({ className }: Props) {
  return (
    <AdSenseUnit
      variant="inFeed"
      className={cn("my-10", className)}
    />
  );
}
