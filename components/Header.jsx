"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { CONTACTS } from "@/lib/contacts";

const NAV = [
  { href: "#catalog", label: "Каталог" },
  { href: "#sizes", label: "Размеры" },
  { href: "#faq", label: "Вопросы" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink/78 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="#main" className="flex items-center gap-2.5">
          <img
            src="/catalog/logo.webp"
            alt=""
            width={34}
            height={34}
            className="h-8 w-8 bg-white object-contain p-0.5"
          />
          <span className="title text-lg tracking-wide">Futbolki Russia</span>
        </a>

        <nav aria-label="Основная навигация" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="label flex min-h-11 items-center px-3 text-muted transition-colors duration-200 hover:text-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={CONTACTS.phoneHref}
          className="tnum label ml-auto hidden min-h-11 items-center px-3 transition-colors duration-200 hover:text-volt lg:ml-4 lg:flex"
        >
          {CONTACTS.phoneDisplay}
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`label ml-auto flex min-h-11 items-center gap-2 px-4 font-bold transition-colors duration-200 lg:ml-0 ${
            count > 0
              ? "bg-volt text-ink hover:bg-volt-dim"
              : "border border-line-strong text-text hover:border-volt hover:text-volt"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="20" r="1.3" />
            <circle cx="18" cy="20" r="1.3" />
            <path d="M2 3h2.2l2.4 12.1a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3L21 7H5.5" />
          </svg>
          <span className="tnum">{count}</span>
          <span className="sr-only">
            {count === 0 ? "корзина пуста" : `товаров в корзине: ${count}`}
          </span>
        </button>
      </div>
    </header>
  );
}
