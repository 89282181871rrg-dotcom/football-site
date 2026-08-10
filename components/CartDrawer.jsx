"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { CONTACTS } from "@/lib/contacts";

export default function CartDrawer() {
  const { items, setQty, remove, clear, total, isOpen, setOpen } = useCart();
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
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

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const comment = String(form.get("comment") || "").trim();

    const nextErrors = {};
    if (name.length < 2) nextErrors.name = "Укажите имя — минимум 2 символа";
    if (phone.replace(/\D/g, "").length < 10)
      nextErrors.phone = "Телефон должен содержать минимум 10 цифр";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) nameRef.current?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, comment, items, total }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("done");
      clear();
    } catch {
      setStatus("error");
    }
  };

  const field =
    "h-12 w-full border border-line-strong bg-ink px-4 text-base text-text focus:border-volt";

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
        aria-label="Корзина"
        tabIndex={-1}
        className="drawer-panel absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ink"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="label font-bold">Корзина</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="label flex min-h-11 min-w-11 items-center justify-center font-bold"
          >
            <span aria-hidden="true">Закрыть</span>
            <span className="sr-only">Закрыть корзину</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {status === "done" ? (
            <div className="py-10">
              <p className="display-md">Заказ принят</p>
              <p className="label mt-5 text-muted">
                Перезвоним в течение 15 минут в рабочее время, чтобы подтвердить
                размер и доставку.
              </p>
              <a
                href={CONTACTS.phoneHref}
                className="label tnum mt-8 flex min-h-12 items-center justify-center bg-volt px-5 font-bold text-ink"
              >
                {CONTACTS.phoneDisplay}
              </a>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16">
              <p className="display-md">Пусто</p>
              <p className="label mt-4 text-muted">
                Выберите модель в каталоге — оформим за минуту.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="label mt-8 flex min-h-12 w-full items-center justify-center bg-volt px-6 font-bold text-ink"
              >
                В каталог
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4">
                  <img
                    src={i.image}
                    alt=""
                    width={64}
                    height={80}
                    className="h-20 w-16 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="title truncate text-base">{i.title}</p>
                    <p className="label mt-1 text-muted">
                      {i.size === "ONE" ? "Один вариант" : `Размер ${i.size}`}
                    </p>
                    <p className="tnum label mt-1 font-bold">
                      {formatPrice(i.price * i.qty)}
                    </p>

                    <div className="mt-3 flex items-center gap-px">
                      <button
                        type="button"
                        onClick={() => setQty(i.key, i.qty - 1)}
                        className="flex h-11 w-11 items-center justify-center bg-surface-2 text-lg hover:bg-volt hover:text-ink"
                      >
                        <span aria-hidden="true">−</span>
                        <span className="sr-only">Уменьшить количество</span>
                      </button>
                      <span className="tnum flex h-11 w-11 items-center justify-center bg-surface-2 text-sm">
                        {i.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(i.key, i.qty + 1)}
                        className="flex h-11 w-11 items-center justify-center bg-surface-2 text-lg hover:bg-volt hover:text-ink"
                      >
                        <span aria-hidden="true">+</span>
                        <span className="sr-only">Увеличить количество</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(i.key)}
                        className="label ml-auto flex min-h-11 items-center px-2 text-muted underline underline-offset-4 hover:text-text"
                      >
                        Убрать
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && status !== "done" && (
          <form onSubmit={submit} noValidate className="px-5 pb-5 pt-4">
            <div className="mb-5 flex items-baseline justify-between">
              <span className="label text-muted">Итого</span>
              <span className="tnum display-md text-volt">{total}&nbsp;₽</span>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="label mb-1 block text-muted">
                  Имя*
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
                  <p
                    id="name-error"
                    role="alert"
                    className="label mt-2 border-l-2 border-volt pl-2 font-bold"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="label mb-1 block text-muted">
                  Телефон*
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
                  <p
                    id="phone-error"
                    role="alert"
                    className="label mt-2 border-l-2 border-volt pl-2 font-bold"
                  >
                    {errors.phone}
                  </p>
                ) : (
                  <p id="phone-hint" className="label mt-2 text-muted">
                    Позвоним только чтобы подтвердить заказ
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="comment" className="label mb-1 block text-muted">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={2}
                  className="w-full border border-line-strong bg-ink px-4 py-3 text-base text-text focus:border-volt"
                />
              </div>
            </div>

            {status === "error" && (
              <div
                role="alert"
                className="mt-4 border-l-2 border-volt pl-3"
              >
                <p className="label font-bold">Заказ не отправился</p>
                <p className="label mt-1 text-muted">
                  Проверьте связь и попробуйте ещё раз или позвоните —{" "}
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
              disabled={status === "sending"}
              className="label mt-6 flex min-h-12 w-full items-center justify-center bg-volt font-bold text-ink transition-opacity duration-200 disabled:opacity-50"
            >
              {status === "sending" ? "Отправляем" : "Оформить заказ"}
            </button>

            <p className="label mt-4 text-muted">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
