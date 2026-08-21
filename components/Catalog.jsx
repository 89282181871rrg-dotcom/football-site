"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { CATEGORIES } from "@/lib/products";
import { useLocale } from "@/lib/locale-context";

// products приходит из app/page.jsx: 27 товаров из кода + добавленные через /admin
export default function Catalog({ products }) {
  const [active, setActive] = useState("all");
  const { t, lang } = useLocale();

  const list =
    active === "all" ? products : products.filter((p) => p.category === active);
  const countFor = (id) =>
    id === "all" ? products.length : products.filter((p) => p.category === id).length;

  // Товар из /admin без готового перевода DeepL (ключ не настроен) —
  // подсказываем, что страницу можно перевести браузером. addedAt есть
  // только у товаров из админки, у обычных 27 его нет
  const showTranslateHint =
    lang !== "ru" && products.some((p) => p.addedAt && !p.translations?.[lang]);

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 className="display-md">
          {t("catalog.title")} <span className="tnum text-volt">{products.length}</span>
        </h2>
        <p className="max-w-xs text-sm text-muted">{t("catalog.note")}</p>
      </div>

      {showTranslateHint && (
        <p className="mt-3 max-w-md text-xs text-muted/80">{t("catalog.translateHint")}</p>
      )}

      <div
        role="tablist"
        aria-label={t("catalog.title")}
        className="scrollbar-none -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            aria-selected={active === c.id}
            onClick={() => setActive(c.id)}
            className={`label flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 font-bold transition-colors duration-200 ${
              active === c.id
                ? "bg-volt text-ink"
                : "border border-line-strong text-muted hover:border-volt hover:text-text"
            }`}
          >
            {t("cat." + c.id)}
            <span className="tnum opacity-60">{countFor(c.id)}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-muted">{t("catalog.empty")}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
