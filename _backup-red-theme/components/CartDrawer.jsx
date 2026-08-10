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

  // Esc закрывает, фокус уходит внутрь панели
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

  return (
    <div className="fixed inset-0 z-50">
      {/* Затемнение достаточно плотное, чтобы фон не спорил с панелью */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-bg shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-xl font-bold">Корзина</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line-strong text-lg"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Закрыть корзину</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {status === "done" ? (
            <div className="rounded-2xl border border-line bg-surface p-6 text-center">
              <p className="display text-2xl font-bold text-accent">Заказ принят</p>
              <p className="mt-3 text-muted">
                Перезвоним в течение 15 минут в рабочее время, чтобы подтвердить
                размер и доставку.
              </p>
              <p className="mt-4 text-sm text-muted">
                Срочно? Звоните сами:
              </p>
              <a
                href={CONTACTS.phoneHref}
                className="tnum mt-2 inline-flex min-h-12 items-center justify-center rounded-xl border border-line-strong bg-surface-2 px-5 font-semibold hover:text-accent"
              >
                {CONTACTS.phoneDisplay}
              </a>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-semibold">Пока пусто</p>
              <p className="mt-2 text-muted">
                Выберите модель в каталоге — оформим за минуту.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 min-h-12 rounded-xl bg-accent-strong px-6 font-semibold text-white"
              >
                В каталог
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li
                  key={i.key}
                  className="flex gap-3 rounded-xl border border-line bg-surface p-3"
                >
                  <img
                    src={i.image}
                    alt=""
                    width={64}
                    height={80}
                    className="h-20 w-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{i.title}</p>
                    <p className="mt-0.5 text-xs text-muted">Размер {i.size}</p>
                    <p className="tnum mt-1 text-sm font-bold">
                      {formatPrice(i.price * i.qty)}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(i.key, i.qty - 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong text-lg"
                      >
                        <span aria-hidden="true">−</span>
                        <span className="sr-only">Уменьшить количество</span>
                      </button>
                      <span className="tnum w-8 text-center text-sm font-semibold">
                        {i.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(i.key, i.qty + 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong text-lg"
                      >
                        <span aria-hidden="true">+</span>
                        <span className="sr-only">Увеличить количество</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(i.key)}
                        className="ml-auto flex min-h-11 items-center rounded-lg px-3 text-xs text-muted underline underline-offset-4 hover:text-ink"
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
          <form onSubmit={submit} noValidate className="border-t border-line px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-muted">Итого</span>
              <span className="tnum text-2xl font-bold">{formatPrice(total)}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">
                  Имя <span className="text-accent">*</span>
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="h-12 w-full rounded-xl border border-line-strong bg-surface px-4 text-base"
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="mt-1 text-sm text-accent">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                  Телефон <span className="text-accent">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 900 000-00-00"
                  aria-invalid={errors.phone ? "true" : undefined}
                  aria-describedby={
                    errors.phone ? "phone-error" : "phone-hint"
                  }
                  className="h-12 w-full rounded-xl border border-line-strong bg-surface px-4 text-base"
                />
                {errors.phone ? (
                  <p id="phone-error" role="alert" className="mt-1 text-sm text-accent">
                    {errors.phone}
                  </p>
                ) : (
                  <p id="phone-hint" className="mt-1 text-xs text-muted">
                    Позвоним только чтобы подтвердить заказ
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="comment" className="mb-1 block text-sm font-medium">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={2}
                  className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-base"
                />
              </div>
            </div>

            {status === "error" && (
              <div role="alert" className="mt-3 rounded-xl border border-accent/40 bg-accent/10 p-3">
                <p className="text-sm text-accent">
                  Не получилось отправить заказ. Проверьте связь и попробуйте ещё раз.
                </p>
                <p className="mt-2 text-sm text-muted">
                  Или позвоните напрямую —{" "}
                  <a
                    href={CONTACTS.phoneHref}
                    className="tnum font-semibold text-ink underline underline-offset-4"
                  >
                    {CONTACTS.phoneDisplay}
                  </a>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-accent-strong text-base font-semibold text-white transition-opacity duration-200 disabled:opacity-50"
            >
              {status === "sending" ? "Отправляем…" : "Оформить заказ"}
            </button>

            <p className="mt-3 text-center text-xs text-muted">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
