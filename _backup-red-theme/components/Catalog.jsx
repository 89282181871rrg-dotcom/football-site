"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export default function Catalog() {
  const [active, setActive] = useState("all");
  const list =
    active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Каталог</h2>
          <p className="mt-2 text-muted">
            Все позиции в наличии. Не нашли нужную модель — напишите, привезём под заказ.
          </p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Категории товаров"
        className="mb-8 flex flex-wrap gap-2"
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            aria-selected={active === c.id}
            onClick={() => setActive(c.id)}
            className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition-colors duration-200 ${
              active === c.id
                ? "border-accent-strong bg-accent-strong text-white"
                : "border-line-strong bg-surface text-muted hover:text-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-8 text-center text-muted">
          В этой категории пока пусто. Загляните в другие или напишите нам.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
