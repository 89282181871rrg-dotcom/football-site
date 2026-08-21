"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLocale } from "@/lib/locale-context";
import { CONTACTS } from "@/lib/contacts";
import { orderLink } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { items, setQty, remove, clear, total, isOpen, setOpen } = useCart();
  const { t, lang, currency, money, country } = useLocale();
  const [status, setStatus] = useState("idle"); // idle | opening | error
  const [chatUrl, setChatUrl] = useState("");
  const [errors, setErrors] = useState({});
  const panelRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const submit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const country = String(form.get("country") || "").trim();
    const city = String(form.get("city") || "").trim();
    const comment = String(form.get("comment") || "").trim();

    const next = {};
    if (name.length < 2) next.name = t("cart.err.name");
    if (phone.replace(/\D/g, "").length < 10) next.phone = t("cart.err.phone");
    if (city.length < 3) next.city = t("cart.err.city");
    setErrors(next);
    if (Object.keys(next).length) {
      if (next.name) nameRef.current?.focus();
      return;
    }

    const order = {
      name, phone, country, city, comment,
      items, total, lang, currency,
      totalShown: money(total),
      origin: window.location.origin,
    };

    // Запасная запись заказа: если в .env настроены таблица или пуш, они
    // сработают. sendBeacon переживает уход со страницы, обычный fetch — нет.
    try {
      const blob = new Blob([JSON.stringify(order)], { type: "application/json" });
      navigator.sendBeacon?.("/api/order", blob);
    } catch {
      // не критично: заказ всё равно уходит в WhatsApp
    }

    // Ссылку показываем на экране: если переход заблокирован, покупатель
    // нажмёт её сам и заказ не потеряется
    const url = orderLink(order);
    setChatUrl(url);
    setStatus("opening");
    window.location.href = url;

    // Корзину намеренно не очищаем: мы не знаем, отправил ли он сообщение.
    // Вернётся — товары на месте.
  };

  const field =
    "h-11 w-full rounded-xl border border-line-strong bg-ink px-3.5 text-base text-text focus:border-volt sm:h-12 sm:px-4";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="drawer-veil absolute inset-0 bg-black/70"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
        tabIndex={-1}
        className="drawer-panel absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ink"
      >
        <div className="flex items-center justify-between px-4 py-4 sm:px-5">
          <h2 className="label font-bold">{t("cart.title")}</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="label flex min-h-11 items-center justify-center rounded-xl px-3 font-bold"
          >
            {t("cart.close")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {status === "opening" ? (
            <div className="py-10">
              <p className="display-md">{t("cart.waOpening")}</p>
              <p className="mt-5 text-sm leading-relaxed text-muted">{t("cart.waHint")}</p>
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-6 flex min-h-12 items-center justify-center rounded-xl bg-volt px-5 font-bold text-ink"
              >
                {t("cart.waManual")}
              </a>
              <p className="mt-6 text-sm text-muted">{t("cart.urgent")}</p>
              <a
                href={CONTACTS.phoneHref}
                className="label tnum mt-2 flex min-h-12 items-center justify-center rounded-xl border border-line-strong px-5 font-bold"
              >
                {CONTACTS.phoneDisplay}
              </a>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16">
              <p className="display-md">{t("cart.empty")}</p>
              <p className="mt-4 text-sm text-muted">{t("cart.emptyText")}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="label mt-8 flex min-h-12 w-full items-center justify-center rounded-xl bg-volt px-6 font-bold text-ink"
              >
                {t("cart.toCatalog")}
              </button>
            </div>
          ) : (
            <>
            <ul className="space-y-6">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4">
                  <img
                    src={i.image}
                    alt=""
                    width={64}
                    height={80}
                    className="h-20 w-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="title truncate text-base">{i.title}</p>
                    <p className="label mt-1 text-muted">
                      {i.size === "ONE" ? t("card.oneOption") : `${t("cart.sizeLabel")} ${i.size}`}
                    </p>
                    <p className="tnum label mt-1 font-bold">{money(i.price * i.qty)}</p>

                    <div className="mt-3 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQty(i.key, i.qty - 1)}
                        aria-label="−"
                        className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2 text-lg hover:bg-volt hover:text-ink"
                      >
                        −
                      </button>
                      <span className="tnum flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2 text-sm">
                        {i.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(i.key, i.qty + 1)}
                        aria-label="+"
                        className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2 text-lg hover:bg-volt hover:text-ink"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(i.key)}
                        className="label ml-auto flex min-h-11 items-center px-2 text-muted underline underline-offset-4 hover:text-text"
                      >
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

          <form onSubmit={submit} noValidate className="mt-6">
            <div className="mb-5 flex items-baseline justify-between">
              <span className="label text-muted">{t("cart.total")}</span>
              <span className="tnum display-md text-volt">{money(total)}</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="label mb-1 block text-muted">
                  {t("cart.name")}*
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={field}
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="label mt-2 font-bold text-volt">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="label mb-1 block text-muted">
                  {t("cart.phone")}*
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 900 000-00-00"
                  aria-invalid={errors.phone ? "true" : undefined}
                  aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
                  className={field}
                />
                {errors.phone ? (
                  <p id="phone-error" role="alert" className="label mt-2 font-bold text-volt">
                    {errors.phone}
                  </p>
                ) : (
                  <p id="phone-hint" className="label mt-2 text-muted">
                    {t("cart.phoneHint")}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="label mb-1 block text-muted">
                  {t("cart.country")}
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  key={country}
                  defaultValue={country}
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="city" className="label mb-1 block text-muted">
                  {t("cart.city")}*
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="street-address"
                  aria-invalid={errors.city ? "true" : undefined}
                  aria-describedby={errors.city ? "city-error" : undefined}
                  className={field}
                />
                {errors.city && (
                  <p id="city-error" role="alert" className="label mt-2 font-bold text-volt">
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="comment" className="label mb-1 block text-muted">
                  {t("cart.comment")}
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={2}
                  className="w-full rounded-xl border border-line-strong bg-ink px-4 py-3 text-base text-text focus:border-volt"
                />
              </div>
            </div>

            <p className="label mt-4 rounded-r-lg border-l-2 border-volt bg-surface/60 px-3 py-2 text-muted">
              {t("cart.intl")}
            </p>

            {status === "error" && (
              <div role="alert" className="mt-4 rounded-r-lg border-l-2 border-volt pl-3">
                <p className="label font-bold">{t("cart.err.send")}</p>
                <p className="label mt-1 text-muted">
                  {t("cart.err.retry")}{" "}
                  <a
                    href={CONTACTS.phoneHref}
                    className="tnum text-text underline underline-offset-4"
                  >
                    {CONTACTS.phoneDisplay}
                  </a>
                </p>
              </div>
            )}

            <button
              type="submit"
              className="label mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-volt font-bold text-ink transition-opacity duration-200 disabled:opacity-50"
            >
              {t("cart.submit")}
            </button>

            <p className="label mt-3 text-muted">{t("cart.waHint")}</p>

            <p className="label mt-4 text-muted">{t("cart.consent")}</p>
          </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
