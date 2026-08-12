"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLocale } from "@/lib/locale-context";
import { CONTACTS } from "@/lib/contacts";
import LocaleSwitcher from "./LocaleSwitcher";

const NAV = [
  { href: "#catalog", key: "nav.catalog" },
  { href: "#sizes", key: "nav.sizes" },
  { href: "#faq", key: "nav.faq" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const { t } = useLocale();
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
        scrolled ? "border-b border-white/10 bg-ink/80 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <a href="#main" className="flex shrink-0 items-center gap-2.5">
          <img
            src="/catalog/logo.webp"
            alt=""
            width={34}
            height={34}
            className="h-8 w-8 rounded-lg bg-white object-contain p-0.5"
          />
          <span className="title hidden text-lg tracking-wide sm:inline">
            Futbolki Russia
          </span>
        </a>

        <nav aria-label={t("nav.main")} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="label flex min-h-11 items-center px-3 text-muted transition-colors duration-200 hover:text-text"
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={CONTACTS.phoneHref}
          className="tnum label ml-auto hidden min-h-11 items-center px-3 transition-colors duration-200 hover:text-volt lg:ml-2 xl:flex"
        >
          {CONTACTS.phoneDisplay}
        </a>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <LocaleSwitcher />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`label flex min-h-11 items-center gap-2 rounded-xl px-4 font-bold transition-colors duration-200 ${
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
            <span className="sr-only">{t("nav.cart")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
