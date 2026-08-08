"use client";

import { AffiliateAdCard } from "./AffiliateAdCard";

/** Masaüstü yan şerit reklamlar (xl+). */
export function AffiliateSideRails() {
  return (
    <>
      <aside
        className="pointer-events-none fixed left-3 top-28 z-30 hidden w-[148px] xl:block 2xl:left-6 2xl:w-[168px]"
        aria-label="Sol sponsor"
      >
        <div className="pointer-events-auto sticky top-28 space-y-3">
          <AffiliateAdCard slot="rail-left-1" variant="rail" />
          <AffiliateAdCard slot="rail-left-2" variant="rail" salt={1} />
        </div>
      </aside>
      <aside
        className="pointer-events-none fixed right-3 top-28 z-30 hidden w-[148px] xl:block 2xl:right-6 2xl:w-[168px]"
        aria-label="Sağ sponsor"
      >
        <div className="pointer-events-auto sticky top-28 space-y-3">
          <AffiliateAdCard slot="rail-right-1" variant="rail" salt={2} />
          <AffiliateAdCard slot="rail-right-2" variant="rail" salt={3} />
        </div>
      </aside>
    </>
  );
}
