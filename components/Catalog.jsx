"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { useLocale } from "@/lib/locale-context";

// products приходит из app/page.jsx: товары из МойСклада
export default function Catalog({ products }) {
  const [active, setActive] = useState("all");
  const [activeSub, setActiveSub] = useState("all");
  const { t, lang } = useLocale();

  const inTab =
    active === "all" ? products : products.filter((p) => p.category === active);
  const list =
    activeSub === "all" ? inTab : inTab.filter((p) => p.subcategory === activeSub);

  // Подразделы выбранной вкладки — подгруппы в МойСкладе
  const subgroups =
    active === "all" ? [] : [...new Set(inTab.map((p) => p.subcategory).filter(Boolean))];
  const pickTab = (id) => {
    setActive(id);
    setActiveSub("all");
  };
  const countFor = (id) =>
    id === "all" ? products.length : products.filter((p) => p.category === id).length;

  // Вкладки — группы товаров из МойСклада, в порядке появления в каталоге
  const groups = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const tabs = [
    { id: "all", label: t("cat.all") },
    ...groups.map((g) => ({ id: g, label: g })),
  ];

  // Описания из МойСклада только на русском — на других языках
  // подсказываем, что страницу можно перевести браузером
  const showTranslateHint = lang !== "ru" && products.length > 0;

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
        {tabs.map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            aria-selected={active === c.id}
            onClick={() => pickTab(c.id)}
            className={`label flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 font-bold transition-colors duration-200 ${
              active === c.id
                ? "bg-volt text-ink"
                : "border border-line-strong text-muted hover:border-volt hover:text-text"
            }`}
          >
            {c.label}
            <span className="tnum opacity-60">{countFor(c.id)}</span>
          </button>
        ))}
      </div>

      {subgroups.length > 0 && (
        <div
          role="tablist"
          aria-label={active}
          className="scrollbar-none -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {[{ id: "all", label: t("cat.all") }, ...subgroups.map((g) => ({ id: g, label: g }))].map(
            (c) => (
              <button
                key={c.id}
                role="tab"
                type="button"
                aria-selected={activeSub === c.id}
                onClick={() => setActiveSub(c.id)}
                className={`label flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-bold transition-colors duration-200 ${
                  activeSub === c.id
                    ? "bg-text text-ink"
                    : "border border-line-strong text-muted hover:border-text hover:text-text"
                }`}
              >
                {c.label}
                <span className="tnum opacity-60">
                  {c.id === "all" ? inTab.length : inTab.filter((p) => p.subcategory === c.id).length}
                </span>
              </button>
            )
          )}
        </div>
      )}

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
