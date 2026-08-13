"use client";

import { useLocale } from "@/lib/locale-context";

export default function Features() {
  const { t } = useLocale();
  const items = [1, 2, 3, 4];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {items.map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-ink/78 p-5 backdrop-blur-md sm:p-6"
          >
            <p className="tnum display-md text-volt">{String(i).padStart(2, "0")}</p>
            <h3 className="title mt-3 text-lg sm:mt-4">{t(`feat.${i}.t`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t(`feat.${i}.d`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
