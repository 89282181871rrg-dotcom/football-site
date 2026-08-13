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
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Меню закрывается по Esc и само при переходе на широкий экран
  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => e.key === "Escape" && setMenu(false);
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = (e) => e.matches && setMenu(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [menu]);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || menu ? "border-b border-white/10 bg-ink/90 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
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

        {/* Разделы: на широком экране строкой, на телефоне прячутся в меню */}
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
          className="tnum label ml-2 hidden min-h-11 items-center px-3 transition-colors duration-200 hover:text-volt xl:flex"
        >
          {CONTACTS.phoneDisplay}
        </a>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {/* Кнопка меню — только там, где разделы не помещаются строкой */}
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong transition-colors duration-200 hover:border-volt hover:text-volt lg:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              {menu ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
            <span className="sr-only">{t("nav.main")}</span>
          </button>

          <LocaleSwitcher />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`label flex min-h-11 items-center gap-2 rounded-xl px-3 font-bold transition-colors duration-200 sm:px-4 ${
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

      {menu && (
        <nav
          id="mobile-menu"
          aria-label={t("nav.main")}
          className="border-t border-white/10 bg-ink/95 backdrop-blur-md lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenu(false)}
                  className="flex min-h-13 items-center border-b border-line py-3 text-base transition-colors duration-200 hover:text-volt"
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
            <li>
              <a
                href={CONTACTS.phoneHref}
                className="tnum flex min-h-13 items-center py-3 text-base font-bold text-volt"
              >
                {CONTACTS.phoneDisplay}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
