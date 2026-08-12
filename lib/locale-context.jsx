"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ru from "./locales/ru";
import { translate, phrase, faqOf, loadLocale, loaded, LANGUAGES, RTL } from "./i18n";
import { CURRENCIES, COUNTRY_CURRENCY, FALLBACK_RATES, formatMoney } from "./currency";

const LocaleContext = createContext(null);
const KEY_LANG = "futbolki-lang";
const KEY_CUR = "futbolki-currency";

/** Угадываем язык и валюту по настройкам браузера */
function detect() {
  if (typeof navigator === "undefined") return { lang: "ru", currency: "RUB" };

  const tags = navigator.languages?.length ? navigator.languages : [navigator.language || "ru"];
  let lang = "en";
  let region;

  // Первый язык браузера, который у нас есть. Регион берём из него же
  for (const tag of tags) {
    const code = String(tag).slice(0, 2).toLowerCase();
    const r = String(tag).split("-")[1]?.toUpperCase();
    if (!region && r) region = r;
    if (LANGUAGES[code]) { lang = code; break; }
  }

  const byCountry = region && COUNTRY_CURRENCY[region];
  const currency = byCountry || (loaded(lang)?.currency ?? (lang === "ru" ? "RUB" : "USD"));

  return { lang, currency: CURRENCIES[currency] ? currency : "USD" };
}

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState("ru");
  const [dict, setDict] = useState(ru);
  const [currency, setCurrency] = useState("RUB");
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [ready, setReady] = useState(false);

  // Восстанавливаем выбор пользователя, иначе определяем автоматически
  useEffect(() => {
    const savedLang = localStorage.getItem(KEY_LANG);
    const savedCur = localStorage.getItem(KEY_CUR);
    const guess = detect();
    setLang(savedLang && LANGUAGES[savedLang] ? savedLang : guess.lang);
    setCurrency(savedCur && CURRENCIES[savedCur] ? savedCur : guess.currency);
    setReady(true);
  }, []);

  // Подгружаем словарь выбранного языка. До загрузки показываем предыдущий —
  // это доли секунды и лучше, чем пустой экран
  useEffect(() => {
    let alive = true;
    const have = loaded(lang);
    if (have) { setDict(have); return; }
    loadLocale(lang).then((d) => alive && setDict(d));
    return () => { alive = false; };
  }, [lang]);

  // Живые курсы: если сервер не ответил, остаются запасные из конфига
  useEffect(() => {
    fetch("/api/rates")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.rates && setRates({ ...FALLBACK_RATES, ...d.rates }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY_LANG, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.has(lang) ? "rtl" : "ltr";
  }, [lang, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY_CUR, currency);
  }, [currency, ready]);

  const value = useMemo(
    () => ({
      lang,
      dict,
      currency,
      rates,
      setLang,
      setCurrency,
      t: (key, vars) => translate(dict, key, vars),
      p: (text) => phrase(dict, text),
      faq: faqOf(dict),
      country: dict?.country ?? "",
      money: (priceRub) => formatMoney(priceRub, currency, rates, lang),
    }),
    [lang, dict, currency, rates]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale должен вызываться внутри LocaleProvider");
  return ctx;
}
