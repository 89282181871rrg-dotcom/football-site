"use client";

import { useCart } from "@/lib/cart-context";
import { CONTACTS } from "@/lib/contacts";

const NAV = [
  { href: "#catalog", label: "Каталог" },
  { href: "#sizes", label: "Размеры" },
  { href: "#faq", label: "Вопросы" },
  { href: "#contacts", label: "Контакты" },
];

export default function Header() {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#main" className="flex items-center gap-2.5">
          <img
            src="/catalog/logo.webp"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg bg-white object-contain p-0.5"
          />
          <span className="display text-lg font-bold tracking-wide">
            Futbolki Russia
          </span>
        </a>

        <nav aria-label="Основная навигация" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={CONTACTS.phoneHref}
          className="tnum ml-auto hidden min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:text-accent lg:flex md:ml-0"
        >
          {CONTACTS.phoneDisplay}
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-auto flex min-h-11 min-w-11 items-center gap-2 rounded-xl border border-line-strong bg-surface px-4 text-sm font-semibold transition-colors duration-200 hover:bg-surface-2 lg:ml-0"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2 3h2.2l2.4 12.1a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3L21 7H5.5" />
          </svg>
          <span>Корзина</span>
          <span
            className="tnum inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-strong px-1.5 text-xs font-bold text-white"
            aria-hidden="true"
          >
            {count}
          </span>
          <span className="sr-only">
            {count === 0 ? "корзина пуста" : `товаров в корзине: ${count}`}
          </span>
        </button>
      </div>
    </header>
  );
}
