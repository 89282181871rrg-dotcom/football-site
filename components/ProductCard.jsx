"use client";

import { useId, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLocale } from "@/lib/locale-context";
import Lightbox from "./Lightbox";

export default function ProductCard({ product }) {
  const { add, setOpen, items, setQty } = useCart();
  const { t, pf, money } = useLocale();
  const [size, setSize] = useState(product.sizes[0]);
  const [justAdded, setJustAdded] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const groupId = useId();

  const images = product.images ?? [product.image];

  // Товар уже в корзине — вместо «В корзину» показываем счётчик,
  // как в больших магазинах. Смена размера считается отдельной позицией.
  const inCart = items.find((i) => i.key === `${product.id}__${size}`);
  const hasSizes = !(product.sizes.length === 1 && product.sizes[0] === "ONE");

  // Описания хранятся по-русски, здесь подставляется перевод: у обычных
  // товаров — из словаря (lib/locales), у товаров из /admin — готовый
  // перевод DeepL, если он есть (lib/translate.js)
  const subtitle = pf(product, "subtitle");
  const note = pf(product, "note");
  const badge = pf(product, "badge");

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
              alt={`${product.title} — ${subtitle ?? ""}`}
              width={800}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover opacity-[0.92] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-100"
            />
            <span className="sr-only">{t("card.openPhotos")}</span>
          </button>

          <div
            aria-hidden="true"
            className="photo-fade pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          />

          {badge && (
            <span className="label pointer-events-none absolute left-0 top-0 rounded-br-xl bg-volt px-2.5 py-1.5 font-bold text-ink">
              {badge}
            </span>
          )}

          {images.length > 1 && (
            <span className="label pointer-events-none absolute right-0 top-0 rounded-bl-xl bg-ink/80 px-2 py-1.5 tabular-nums">
              {photo + 1}/{images.length}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="scrollbar-none hidden gap-1 overflow-x-auto p-1 sm:flex">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setPhoto(i)}
                aria-current={i === photo}
                aria-label={`${i + 1}`}
                className={`h-14 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-200 ${
                  i === photo ? "border-volt" : "border-transparent opacity-55 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-1 flex-col p-2.5 sm:p-4">
          <h3 className="title text-base sm:text-lg">{product.title}</h3>

          {subtitle && (
            <p className="mt-1 text-[0.8rem] leading-snug text-muted sm:mt-1.5 sm:text-sm">{subtitle}</p>
          )}

          <p className="tnum display-md mt-2 text-volt sm:mt-3">{money(product.price)}</p>

          {note && (
            <p className="mt-2 rounded-r-lg border-l-2 border-volt bg-ink/40 px-2.5 py-1.5 text-[0.7rem] leading-relaxed text-muted sm:mt-3 sm:px-3 sm:py-2 sm:text-xs">
              {note}
            </p>
          )}

          {hasSizes && (
            <fieldset className="mt-2.5 sm:mt-4">
              <legend className="label text-muted">{t("card.size")}</legend>
              <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2 sm:gap-1.5">
                {product.sizes.map((s) => (
                  <label
                    key={s}
                    className={`flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg px-1.5 text-sm font-bold transition-colors duration-200 sm:h-11 sm:min-w-11 sm:px-2 ${
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
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-auto flex flex-col gap-1.5 pt-3 sm:flex-row sm:gap-1.5 sm:pt-5">
            {inCart ? (
              <>
                <div className="flex h-11 flex-1 items-center justify-between rounded-xl bg-volt text-ink sm:h-12">
                  <button
                    type="button"
                    onClick={() => setQty(inCart.key, inCart.qty - 1)}
                    aria-label="−"
                    className="flex h-11 w-11 items-center justify-center text-xl font-bold sm:h-12"
                  >
                    −
                  </button>
                  <span className="tnum text-base font-bold">{inCart.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(inCart.key, inCart.qty + 1)}
                    aria-label="+"
                    className="flex h-11 w-11 items-center justify-center text-xl font-bold sm:h-12"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="btn-sweep label flex min-h-11 items-center justify-center rounded-xl border border-volt px-4 font-bold text-volt transition-colors duration-300 hover:text-ink sm:min-h-12"
                >
                  {t("card.inCart")}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`label flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 font-bold text-ink transition-colors duration-200 sm:min-h-12 ${
                    justAdded ? "added-pulse bg-volt-dim" : "bg-volt hover:bg-volt-dim"
                  }`}
                >
                  {justAdded ? t("card.added") : t("card.add")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    add({ ...product, image: images[0] }, size);
                    setOpen(true);
                  }}
                  className="btn-sweep label flex min-h-11 items-center justify-center rounded-xl border border-line-strong px-4 font-bold transition-colors duration-300 hover:border-volt hover:text-ink sm:min-h-12"
                >
                  {t("card.buy")}
                </button>
              </>
            )}
          </div>

          <p aria-live="polite" className="sr-only">
            {justAdded ? `${product.title} ${hasSizes ? size : ""}` : ""}
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
