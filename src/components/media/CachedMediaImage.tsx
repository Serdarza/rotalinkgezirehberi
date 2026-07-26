"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { resolveCachedMediaSrc } from "@/lib/mediaImageCache";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * Uzak görselleri cihaz önbelleğine (Cache Storage) alır — Flutter CachedImage gibi.
 * Yerel `/…` path'ler doğrudan gösterilir.
 */
export function CachedMediaImage({ src, alt, className, ...rest }: Props) {
  const [resolved, setResolved] = useState(src);
  const [ready, setReady] = useState(!/^https?:\/\//i.test(src));

  useEffect(() => {
    let cancelled = false;
    setReady(!/^https?:\/\//i.test(src));
    setResolved(src);

    void resolveCachedMediaSrc(src).then((url) => {
      if (cancelled) return;
      setResolved(url);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [src]);

  const remoteOrBlob =
    resolved.startsWith("http") || resolved.startsWith("blob:");

  return (
    <Image
      {...rest}
      src={resolved || src}
      alt={alt}
      unoptimized={remoteOrBlob || rest.unoptimized}
      className={cn(
        className,
        !ready && "opacity-0",
        ready && "opacity-100 transition-opacity duration-300"
      )}
    />
  );
}
