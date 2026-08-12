"use client";

import { useLocale } from "@/lib/locale-context";

export default function Faq() {
  const { t, faq: items } = useLocale();

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
      <h2 className="display-md">{t("nav.faq")}</h2>

      <div className="mt-10 space-y-2">
        {items.map(([q, a]) => (
          <details
            key={q}
            className="group rounded-2xl border border-white/5 bg-ink/78 backdrop-blur-md"
          >
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 font-medium transition-colors duration-200 hover:text-volt">
              {q}
              <span
                aria-hidden="true"
                className="title shrink-0 text-2xl text-volt transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
