"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export default function Catalog() {
  const [active, setActive] = useState("all");
  const list =
    active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  const countFor = (id) =>
    id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === id).length;

  return (
    <section
      id="catalog"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 className="display-md">
          Каталог <span className="tnum text-volt">{PRODUCTS.length}</span>
        </h2>
        <p className="max-w-xs text-sm text-muted">
          Всё в наличии. Не нашли модель — напишите, привезём под заказ.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Категории товаров"
        className="scrollbar-none -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            aria-selected={active === c.id}
            onClick={() => setActive(c.id)}
            className={`label flex min-h-11 shrink-0 items-center gap-2 px-4 font-bold transition-colors duration-200 ${
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

      {list.length === 0 ? (
        <p className="mt-16 text-muted">
          В этой категории пока пусто. Загляните в другие или напишите нам.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
