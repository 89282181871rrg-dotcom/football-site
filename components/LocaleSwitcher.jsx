"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { LANGUAGES } from "@/lib/i18n";
import { CURRENCIES } from "@/lib/currency";

export default function LocaleSwitcher() {
  const { lang, currency, setLang, setCurrency, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Валют много, поэтому поиск: по коду, символу и названию
  const currencies = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = Object.values(CURRENCIES);
    if (!q) return list;
    return list.filter((c) =>
      `${c.code} ${c.symbol} ${c.label}`.toLowerCase().includes(q)
    );
  }, [query]);

  const pick = (fn, value) => () => {
    fn(value);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="label flex min-h-11 items-center gap-1.5 rounded-xl border border-line-strong px-3 font-bold transition-colors duration-200 hover:border-volt hover:text-volt"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
        </svg>
        {LANGUAGES[lang]?.short} · {CURRENCIES[currency]?.symbol}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-ink/95 p-4 backdrop-blur-md rtl:left-0 rtl:right-auto">
          <p className="label text-muted">{t("sw.lang")}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.values(LANGUAGES).map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={pick(setLang, l.code)}
                aria-current={lang === l.code}
                className={`label flex min-h-10 items-center rounded-lg px-3 font-bold transition-colors duration-200 ${
                  lang === l.code
                    ? "bg-volt text-ink"
                    : "border border-line-strong text-muted hover:border-volt hover:text-text"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <p className="label mt-4 text-muted">{t("sw.currency")}</p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("sw.search")}
            aria-label={t("sw.search")}
            className="mt-2 h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-text focus:border-volt"
          />

          <div className="scrollbar-none mt-2 max-h-44 overflow-y-auto">
            {currencies.length === 0 ? (
              <p className="label py-3 text-muted">{t("sw.nothing")}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={pick(setCurrency, c.code)}
                    aria-current={currency === c.code}
                    title={c.label}
                    className={`label flex min-h-10 items-center rounded-lg px-2.5 font-bold transition-colors duration-200 ${
                      currency === c.code
                        ? "bg-volt text-ink"
                        : "border border-line-strong text-muted hover:border-volt hover:text-text"
                    }`}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted">{t("sw.ratesNote")}</p>
        </div>
      )}
    </div>
  );
}
