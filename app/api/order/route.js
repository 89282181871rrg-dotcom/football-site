/**
 * Приём заказа. Отправляет его сразу в несколько мест — какие настроены,
 * те и сработают. Ни один канал не обязателен: если не настроен ни один,
 * заказ всё равно пишется в лог сервера и покупатель видит подтверждение.
 *
 * Настройка — в файле .env.local в корне проекта. Инструкция: ЗАЯВКИ.md
 *
 *   GOOGLE_SHEET_URL   — заказ падает строкой в Google Таблицу
 *   NTFY_TOPIC         — мгновенный пуш на телефон
 *   WEB3FORMS_KEY      — письмо на почту
 */

const OWNER_EMAIL = "89282181871rrg@gmail.com";

function buildText(o) {
  const lines = o.items.map(
    (i) => `• ${i.title} — ${i.size === "ONE" ? "—" : i.size} × ${i.qty} = ${i.qty * i.price} ₽`
  );
  return [
    "НОВЫЙ ЗАКАЗ",
    "",
    `Имя: ${o.name}`,
    `Телефон: ${o.phone}`,
    o.country ? `Страна: ${o.country}` : null,
    `Адрес: ${o.city}`,
    o.comment ? `Комментарий: ${o.comment}` : null,
    "",
    ...lines,
    "",
    `ИТОГО: ${o.total} ₽` + (o.currency !== "RUB" ? `  (показано как ${o.totalShown})` : ""),
    `Язык сайта: ${o.lang}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function toSheet(o, text) {
  const url = process.env.GOOGLE_SHEET_URL;
  if (!url) return "не настроен";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: new Date().toISOString(),
      name: o.name,
      phone: o.phone,
      country: o.country,
      city: o.city,
      comment: o.comment,
      items: o.items.map((i) => `${i.title} ${i.size} ×${i.qty}`).join("; "),
      totalRub: o.total,
      shown: o.totalShown,
      currency: o.currency,
      lang: o.lang,
    }),
  });
  return res.ok ? "ок" : `ошибка ${res.status}`;
}

async function toPush(o, text) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return "не настроен";
  const res = await fetch(`https://ntfy.sh/${topic}`, {
    method: "POST",
    headers: {
      Title: `Заказ ${o.total} P от ${o.name}`,
      Priority: "high",
      Tags: "shopping_cart",
    },
    body: text,
  });
  return res.ok ? "ок" : `ошибка ${res.status}`;
}

async function toEmail(o, text) {
  const key = process.env.WEB3FORMS_KEY || process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) return "не настроен";
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: key,
      subject: `Заказ с сайта — ${o.name}, ${o.total} ₽`,
      from_name: "Futbolki Russia",
      to: OWNER_EMAIL,
      message: text,
    }),
  });
  return res.ok ? "ок" : `ошибка ${res.status}`;
}

export async function POST(request) {
  let o;
  try {
    o = await request.json();
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const valid =
    typeof o?.name === "string" && o.name.trim().length >= 2 &&
    typeof o?.phone === "string" && o.phone.replace(/\D/g, "").length >= 10 &&
    typeof o?.city === "string" && o.city.trim().length >= 3 &&
    Array.isArray(o?.items) && o.items.length > 0;

  if (!valid) {
    return Response.json({ error: "Проверьте имя, телефон, адрес и состав заказа" }, { status: 400 });
  }

  const text = buildText(o);

  // Каналы независимы: падение одного не мешает остальным
  const results = await Promise.allSettled([toSheet(o, text), toPush(o, text), toEmail(o, text)]);
  const status = {
    таблица: results[0].status === "fulfilled" ? results[0].value : "сбой",
    пуш: results[1].status === "fulfilled" ? results[1].value : "сбой",
    почта: results[2].status === "fulfilled" ? results[2].value : "сбой",
  };

  const delivered = Object.values(status).some((v) => v === "ок");
  if (!delivered) {
    console.warn("[заказ] Ни один канал не сработал. Заказ:\n" + text + "\n", status);
  } else {
    console.log("[заказ] Доставлен:", status);
  }

  // Покупателю всегда отвечаем успехом: заказ у нас есть хотя бы в логе
  return Response.json({ ok: true, delivered, status });
}
