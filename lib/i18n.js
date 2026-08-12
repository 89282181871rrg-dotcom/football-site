/**
 * Языки сайта.
 *
 * Активных девять — те, на которых реально может прийти заказ.
 * Русский и английский зашиты в сборку: русский источник правды,
 * английский запасной вариант, если в другом языке ключ забыли.
 * Остальные подгружаются только когда их выбрали, поэтому посетитель
 * не качает все словари ради одного.
 *
 * ЗАПАСНЫЕ ЯЗЫКИ лежат готовыми в lib/locales/extra: нидерландский,
 * польский, чешский, украинский, сербский, румынский, греческий,
 * шведский, венгерский, иврит, персидский, хинди.
 * Как включить любой из них — написано в файле ЯЗЫКИ.md.
 */

import ru from "./locales/ru";
import en from "./locales/en";

export const LANGUAGES = {
  ru: { code: "ru", label: "Русский",   short: "RU", search: "russian русский" },
  en: { code: "en", label: "English",   short: "EN", search: "english английский" },
  de: { code: "de", label: "Deutsch",   short: "DE", search: "german deutsch немецкий" },
  es: { code: "es", label: "Español",   short: "ES", search: "spanish espanol испанский" },
  fr: { code: "fr", label: "Français",  short: "FR", search: "french francais французский" },
  it: { code: "it", label: "Italiano",  short: "IT", search: "italian italiano итальянский" },
  pt: { code: "pt", label: "Português", short: "PT", search: "portuguese portugues португальский" },
  tr: { code: "tr", label: "Türkçe",    short: "TR", search: "turkish turkce турецкий" },
  ar: { code: "ar", label: "العربية",    short: "AR", search: "arabic arabiya арабский" },
};

/** Языки с письмом справа налево — им ставится dir="rtl" */
export const RTL = new Set(["ar"]);

const LOADERS = {
  de: () => import("./locales/de"),
  es: () => import("./locales/es"),
  fr: () => import("./locales/fr"),
  it: () => import("./locales/it"),
  pt: () => import("./locales/pt"),
  tr: () => import("./locales/tr"),
  ar: () => import("./locales/ar"),
};

const cache = { ru, en };

/** Уже загруженный словарь или undefined */
export function loaded(code) {
  return cache[code];
}

/** Подгружает словарь языка. Если файла нет — отдаёт английский */
export async function loadLocale(code) {
  if (cache[code]) return cache[code];
  const loader = LOADERS[code];
  if (!loader) return en;
  try {
    const mod = await loader();
    cache[code] = mod.default;
    return mod.default;
  } catch (err) {
    console.warn("[язык] Не удалось загрузить", code, err?.message);
    return en;
  }
}

/**
 * Текст по ключу. Если в языке ключа нет — берём английский, потом русский,
 * потом сам ключ. Так забытый перевод не превращается в пустое место.
 */
export function translate(dict, key, vars) {
  let s = dict?.ui?.[key] ?? en.ui[key] ?? ru.ui[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

/**
 * Описания товаров хранятся в lib/products.js по-русски. Здесь русская
 * строка работает ключом: ищем перевод, если нет — показываем как есть.
 */
export function phrase(dict, text) {
  if (!text) return text;
  return dict?.phrases?.[text] ?? en.phrases[text] ?? text;
}

/** Вопросы и ответы: если в языке их нет, показываем английские */
export function faqOf(dict) {
  return dict?.faq?.length ? dict.faq : en.faq;
}
