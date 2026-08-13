"use client";

import { useLocale } from "@/lib/locale-context";

export default function Faq() {
  const { t, faq: items } = useLocale();

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
      <h2 className="display-md">{t("nav.faq")}</h2>

      <div className="mt-8 space-y-2 sm:mt-10">
        {items.map(([q, a]) => (
          <details
            key={q}
            className="group rounded-2xl border border-white/5 bg-ink/78 backdrop-blur-md"
          >
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[0.95rem] font-medium transition-colors duration-200 hover:text-volt sm:gap-6 sm:px-5 sm:text-base">
              {q}
              <span
                aria-hidden="true"
                className="title shrink-0 text-2xl text-volt transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="px-4 pb-5 text-sm leading-relaxed text-muted sm:px-5">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
