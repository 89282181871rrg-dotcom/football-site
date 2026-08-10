"use client";

import { useId, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import Lightbox from "./Lightbox";

export default function ProductCard({ product }) {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [justAdded, setJustAdded] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const groupId = useId();

  const images = product.images ?? [product.image];
  const hasSizes = !(product.sizes.length === 1 && product.sizes[0] === "ONE");

  const handleAdd = () => {
    add({ ...product, image: images[0] }, size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/78 backdrop-blur-md transition-colors duration-300 hover:bg-surface-2/85">
        <div className="relative aspect-[4/5] overflow-hidden">
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="block h-full w-full cursor-zoom-in"
          >
            <img
              src={images[photo]}
              alt={`${product.title} — ${product.subtitle ?? "футбольная экипировка"}`}
              width={800}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover opacity-[0.92] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-100"
            />
            <span className="sr-only">Открыть фотографии на весь экран</span>
          </button>

          {/* Мягкий переход от фото к карточке — убирает резкую границу */}
          <div
            aria-hidden="true"
            className="photo-fade pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          />

          {product.badge && (
            <span className="label pointer-events-none absolute left-0 top-0 rounded-br-xl bg-volt px-2.5 py-1.5 font-bold text-ink">
              {product.badge}
            </span>
          )}

          {images.length > 1 && (
            <span className="label pointer-events-none absolute right-0 top-0 rounded-bl-xl bg-ink/80 px-2 py-1.5 tabular-nums">
              {photo + 1}/{images.length}
            </span>
          )}
        </div>

        {/* Миниатюры — переключают фото прямо в карточке */}
        {images.length > 1 && (
          <div className="scrollbar-none flex gap-1 overflow-x-auto p-1">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setPhoto(i)}
                aria-current={i === photo}
                aria-label={`Показать фото ${i + 1}`}
                className={`h-14 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-200 ${
                  i === photo ? "border-volt" : "border-transparent opacity-55 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-1 flex-col p-4">
          <h3 className="title text-lg">{product.title}</h3>

          {product.subtitle && (
            <p className="mt-1.5 text-sm leading-snug text-muted">
              {product.subtitle}
            </p>
          )}

          <p className="tnum display-md mt-3 text-volt">
            {formatPrice(product.price)}
          </p>

          {product.note && (
            <p className="mt-3 rounded-r-lg border-l-2 border-volt bg-ink/40 px-3 py-2 text-xs leading-relaxed text-muted">
              {product.note}
            </p>
          )}

          {hasSizes && (
            <fieldset className="mt-4">
              <legend className="label text-muted">Размер</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <label
                    key={s}
                    className={`flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-bold transition-colors duration-200 ${
                      size === s
                        ? "bg-volt text-ink"
                        : "border border-line-strong text-muted hover:border-volt hover:text-text"
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

          <div className="mt-auto flex gap-1.5 pt-5">
            <button
              type="button"
              onClick={handleAdd}
              className={`label flex min-h-12 flex-1 items-center justify-center rounded-xl px-4 font-bold text-ink transition-colors duration-200 ${
                justAdded ? "added-pulse bg-volt-dim" : "bg-volt hover:bg-volt-dim"
              }`}
            >
              {justAdded ? "Добавлено" : "В корзину"}
            </button>
            <button
              type="button"
              onClick={() => {
                add({ ...product, image: images[0] }, size);
                setOpen(true);
              }}
              className="btn-sweep label flex min-h-12 items-center justify-center rounded-xl border border-line-strong px-4 font-bold transition-colors duration-300 hover:border-volt hover:text-ink"
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

      {zoom && (
        <Lightbox
          images={images}
          index={photo}
          title={product.title}
          onIndex={setPhoto}
          onClose={() => setZoom(false)}
        />
      )}
    </>
  );
}
