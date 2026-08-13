"use client";

import { useLocale } from "@/lib/locale-context";

export default function Review() {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="grid items-center gap-6 rounded-2xl border border-white/10 bg-surface/78 p-5 backdrop-blur-md sm:gap-8 sm:p-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        <img
          src="/catalog/review-1.webp"
          alt=""
          width={800}
          height={1000}
          loading="lazy"
          className="mx-auto w-full max-w-[200px] rounded-xl object-cover opacity-90 sm:mx-0 sm:max-w-[280px]"
        />

        <figure>
          <p className="label text-volt">{t("review.label")}</p>
          <blockquote className="display-md mt-4 max-w-2xl">{t("review.text")}</blockquote>
          <figcaption className="mt-4 text-sm text-muted">{t("review.author")}</figcaption>
        </figure>
      </div>
    </section>
  );
}
