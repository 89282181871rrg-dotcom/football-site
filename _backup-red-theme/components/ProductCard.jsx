"use client";

import { useId, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }) {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [justAdded, setJustAdded] = useState(false);
  const groupId = useId();

  // Мячи, боди и подобное размер не выбирают
  const hasSizes = !(product.sizes.length === 1 && product.sizes[0] === "ONE");

  const handleAdd = () => {
    add(product, size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        <img
          src={product.image}
          alt={`${product.title} — ${product.subtitle ?? "футбольная экипировка"}`}
          width={900}
          height={1125}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-strong px-3 py-1 text-xs font-bold text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold normal-case tracking-normal">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="mt-1 text-sm text-muted">{product.subtitle}</p>
        )}

        <p className="mt-3 flex items-baseline gap-2">
          <span className="tnum text-xl font-bold">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="tnum text-sm text-muted line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </p>

        {product.note && (
          <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted">
            {product.note}
          </p>
        )}

        {hasSizes && (
          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-medium text-muted">Размер</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <label
                  key={s}
                  className={`flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors duration-200 ${
                    size === s
                      ? "border-accent-strong bg-accent-strong text-white"
                      : "border-line-strong bg-surface-2 text-muted hover:text-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${groupId}-size`}
                    value={s}
                    checked={size === s}
                    onChange={() => setSize(s)}
                    className="sr-only"
                  />
                  {s}
                  <span className="sr-only"> — размер для «{product.title}»</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-4 flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-accent-strong px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
          >
            {justAdded ? "Добавлено ✓" : "В корзину"}
          </button>
          <button
            type="button"
            onClick={() => {
              add(product, size);
              setOpen(true);
            }}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-line-strong bg-surface-2 px-4 text-sm font-semibold transition-colors duration-200 hover:bg-line"
          >
            Купить
          </button>
        </div>

        <p aria-live="polite" className="sr-only">
          {justAdded
            ? `${product.title}${hasSizes ? `, размер ${size}` : ""} добавлен в корзину`
            : ""}
        </p>
      </div>
    </article>
  );
}
