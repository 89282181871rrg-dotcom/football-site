/**
 * Автоматический перевод текста товаров, добавленных через /admin.
 *
 * Хозяин магазина заполняет форму по-русски. Дальше сайт сам переводит
 * подпись/пометку/комментарий на остальные восемь языков сайта через
 * DeepL — так посетитель с любым языком видит текст на своём языке,
 * а не всегда русский.
 *
 * Если DEEPL_API_KEY не задан (или DeepL не ответил) — просто отдаём
 * null. Товар в этом случае сохраняется как раньше, на русском для
 * всех языков. Витрина от этого не ломается — это сделано намеренно,
 * тот же принцип, что и с хранилищем фото (lib/blob-store.js).
 */

// Код языка сайта (lib/i18n.js) → код языка DeepL.
// Список: https://developers.deepl.com/docs/getting-started/supported-languages
const DEEPL_TARGETS = {
  en: "EN-US",
  de: "DE",
  es: "ES",
  fr: "FR",
  it: "IT",
  pt: "PT-PT",
  tr: "TR",
  ar: "AR",
};

function apiUrl(key) {
  // Бесплатные ключи DeepL всегда заканчиваются на ":fx" и требуют
  // отдельный адрес — не тот, что у платных ключей.
  return key.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";
}

/** Переводит несколько строк разом одним запросом (экономит лимит) */
async function translateBatch(texts, targetLang, key) {
  const present = texts
    .map((text, index) => ({ text, index }))
    .filter((t) => t.text && t.text.trim());
  if (!present.length) return texts.map(() => null);

  const body = new URLSearchParams();
  body.set("target_lang", targetLang);
  body.set("source_lang", "RU");
  present.forEach((t) => body.append("text", t.text));

  const res = await fetch(apiUrl(key), {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) throw new Error(`DeepL ответил ${res.status}`);

  const data = await res.json();
  const out = texts.map(() => null);
  present.forEach((t, i) => {
    out[t.index] = data.translations?.[i]?.text ?? null;
  });
  return out;
}

/**
 * Переводит поля товара (например { subtitle, badge, note }) на все
 * активные языки сайта, кроме русского.
 *
 * Возвращает { en: { subtitle, badge, note }, de: {...}, ... } —
 * только те поля и языки, которые реально удалось перевести.
 * Возвращает null, если ключ не задан вовсе (переводить нечем).
 */
export async function translateProductFields(fields) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return null;

  const names = Object.keys(fields);
  const values = names.map((n) => fields[n]);
  if (!values.some((v) => v && v.trim())) return {};

  const result = {};
  await Promise.all(
    Object.entries(DEEPL_TARGETS).map(async ([lang, target]) => {
      try {
        const translated = await translateBatch(values, target, key);
        const entry = {};
        names.forEach((n, i) => {
          if (translated[i]) entry[n] = translated[i];
        });
        if (Object.keys(entry).length) result[lang] = entry;
      } catch (err) {
        console.warn(`[перевод] Не удалось перевести товар на ${lang}:`, err.message);
      }
    })
  );
  return result;
}
