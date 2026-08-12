/**
 * Валюты и курсы.
 *
 * Базовая валюта — рубль. Все цены в lib/products.js хранятся в рублях,
 * здесь пересчитываются под выбранную покупателем валюту.
 *
 * Живой курс тянется из открытого API Центробанка — см. app/api/rates/route.js.
 * Значения ниже — запасные, на случай если запрос не прошёл.
 *
 * ЧТОБЫ ДОБАВИТЬ ВАЛЮТУ: она должна быть в списке ЦБ (иначе курс замрёт
 * на запасном значении и цены поедут). Добавь строку в CURRENCIES и,
 * если нужно, в COUNTRY_CURRENCY.
 */

export const RATES_UPDATED = "2026-08-10";

/**
 * Сколько рублей стоит одна единица валюты.
 * Ориентир, не точные значения: живой курс их перекрывает.
 */
export const FALLBACK_RATES = {
  RUB: 1,
  USD: 95, EUR: 103, GBP: 121, CHF: 110,
  CNY: 13.2, JPY: 0.63, KRW: 0.069, HKD: 12.2, SGD: 71,
  INR: 1.1, IDR: 0.0058, VND: 0.0037, THB: 2.7,
  TRY: 2.4, AED: 26, QAR: 26, EGP: 1.95, ZAR: 5.2,
  KZT: 0.19, BYN: 29, UAH: 2.3, UZS: 0.0074, KGS: 1.1,
  TJS: 8.8, TMT: 27, AZN: 56, AMD: 0.24, GEL: 35, MDL: 5.4,
  PLN: 24, CZK: 4.1, HUF: 0.26, RON: 20.7, RSD: 0.88, BGN: 53,
  SEK: 8.9, NOK: 8.6, DKK: 13.8,
  BRL: 17, CAD: 68, AUD: 62, NZD: 56,
};

/**
 * round — до какого шага округляем цену. В рознице не пишут 62.87,
 * поэтому доллар округляем до единиц, тенге до сотен, вьетнамский донг до 10000.
 */
export const CURRENCIES = {
  RUB: { code: "RUB", symbol: "₽",   round: 10,     label: "Российский рубль" },
  USD: { code: "USD", symbol: "$",   round: 1,      label: "US Dollar" },
  EUR: { code: "EUR", symbol: "€",   round: 1,      label: "Euro" },
  GBP: { code: "GBP", symbol: "£",   round: 1,      label: "Pound Sterling" },
  CHF: { code: "CHF", symbol: "Fr",  round: 1,      label: "Swiss Franc" },
  CNY: { code: "CNY", symbol: "¥",   round: 10,     label: "人民币" },
  JPY: { code: "JPY", symbol: "¥",   round: 100,    label: "日本円" },
  KRW: { code: "KRW", symbol: "₩",   round: 1000,   label: "대한민국 원" },
  HKD: { code: "HKD", symbol: "HK$", round: 10,     label: "Hong Kong Dollar" },
  SGD: { code: "SGD", symbol: "S$",  round: 1,      label: "Singapore Dollar" },
  INR: { code: "INR", symbol: "₹",   round: 100,    label: "भारतीय रुपया" },
  IDR: { code: "IDR", symbol: "Rp",  round: 10000,  label: "Rupiah" },
  VND: { code: "VND", symbol: "₫",   round: 10000,  label: "Đồng" },
  THB: { code: "THB", symbol: "฿",   round: 10,     label: "บาท" },
  TRY: { code: "TRY", symbol: "₺",   round: 10,     label: "Türk lirası" },
  AED: { code: "AED", symbol: "AED", round: 1,      label: "درهم إماراتي" },
  QAR: { code: "QAR", symbol: "QAR", round: 1,      label: "ريال قطري" },
  EGP: { code: "EGP", symbol: "E£",  round: 10,     label: "جنيه مصري" },
  ZAR: { code: "ZAR", symbol: "R",   round: 10,     label: "Rand" },
  KZT: { code: "KZT", symbol: "₸",   round: 100,    label: "Қазақстан теңгесі" },
  BYN: { code: "BYN", symbol: "Br",  round: 1,      label: "Беларускі рубель" },
  UAH: { code: "UAH", symbol: "₴",   round: 10,     label: "Українська гривня" },
  UZS: { code: "UZS", symbol: "soʻm",round: 10000,  label: "Oʻzbek soʻmi" },
  KGS: { code: "KGS", symbol: "сом", round: 100,    label: "Кыргыз сому" },
  TJS: { code: "TJS", symbol: "SM",  round: 10,     label: "Сомонӣ" },
  TMT: { code: "TMT", symbol: "m",   round: 1,      label: "Manat" },
  AZN: { code: "AZN", symbol: "₼",   round: 1,      label: "Azərbaycan manatı" },
  AMD: { code: "AMD", symbol: "֏",   round: 500,    label: "Հայկական դրամ" },
  GEL: { code: "GEL", symbol: "₾",   round: 1,      label: "ქართული ლარი" },
  MDL: { code: "MDL", symbol: "L",   round: 10,     label: "Leu moldovenesc" },
  PLN: { code: "PLN", symbol: "zł",  round: 10,     label: "Polski złoty" },
  CZK: { code: "CZK", symbol: "Kč",  round: 10,     label: "Česká koruna" },
  HUF: { code: "HUF", symbol: "Ft",  round: 100,    label: "Magyar forint" },
  RON: { code: "RON", symbol: "lei", round: 1,      label: "Leu românesc" },
  RSD: { code: "RSD", symbol: "дин", round: 100,    label: "Српски динар" },
  BGN: { code: "BGN", symbol: "лв",  round: 1,      label: "Български лев" },
  SEK: { code: "SEK", symbol: "kr",  round: 10,     label: "Svensk krona" },
  NOK: { code: "NOK", symbol: "kr",  round: 10,     label: "Norsk krone" },
  DKK: { code: "DKK", symbol: "kr",  round: 10,     label: "Dansk krone" },
  BRL: { code: "BRL", symbol: "R$",  round: 10,     label: "Real brasileiro" },
  CAD: { code: "CAD", symbol: "C$",  round: 1,      label: "Canadian Dollar" },
  AUD: { code: "AUD", symbol: "A$",  round: 1,      label: "Australian Dollar" },
  NZD: { code: "NZD", symbol: "NZ$", round: 1,      label: "NZ Dollar" },
};

/** Какая валюта уместна для страны из настроек браузера */
export const COUNTRY_CURRENCY = {
  RU: "RUB", BY: "BYN", KZ: "KZT", UA: "UAH", UZ: "UZS", KG: "KGS",
  TJ: "TJS", TM: "TMT", AZ: "AZN", AM: "AMD", GE: "GEL", MD: "MDL",
  DE: "EUR", AT: "EUR", FR: "EUR", BE: "EUR", NL: "EUR", LU: "EUR",
  IT: "EUR", ES: "EUR", PT: "EUR", IE: "EUR", FI: "EUR", GR: "EUR",
  SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR",
  MT: "EUR", HR: "EUR",
  GB: "GBP", CH: "CHF", PL: "PLN", CZ: "CZK", HU: "HUF", RO: "RON",
  RS: "RSD", BG: "BGN", SE: "SEK", NO: "NOK", DK: "DKK",
  US: "USD", CA: "CAD", AU: "AUD", NZ: "NZD", BR: "BRL",
  CN: "CNY", JP: "JPY", KR: "KRW", HK: "HKD", SG: "SGD",
  IN: "INR", ID: "IDR", VN: "VND", TH: "THB",
  TR: "TRY", AE: "AED", QA: "QAR", EG: "EGP", ZA: "ZAR",
};

/**
 * Перевод цены из рублей с округлением до «красивого» шага.
 */
export function convert(priceRub, currencyCode, rates) {
  const c = CURRENCIES[currencyCode] ?? CURRENCIES.RUB;
  const rate = (rates ?? FALLBACK_RATES)[currencyCode] ?? 1;
  const raw = priceRub / rate;
  return Math.max(c.round, Math.round(raw / c.round) * c.round);
}

/**
 * Готовая строка с символом валюты, отформатированная по правилам языка сайта.
 * Немец увидит «6 500 ₽» как «6.500 RUB», американец — «RUB 6,500».
 */
export function formatMoney(priceRub, currencyCode, rates, lang) {
  const c = CURRENCIES[currencyCode] ?? CURRENCIES.RUB;
  const value = convert(priceRub, currencyCode, rates);
  try {
    return new Intl.NumberFormat(lang || "ru", {
      style: "currency",
      currency: c.code,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${c.symbol}`;
  }
}
