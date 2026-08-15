/**
 * Отправка заказа в WhatsApp.
 *
 * Покупатель заполняет форму, жмёт кнопку — открывается чат с магазином,
 * где уже написано готовое сообщение. Ему остаётся нажать «отправить».
 *
 * НОМЕР МАГАЗИНА — здесь. Формат: только цифры, с кодом страны, без плюса.
 */
export const WHATSAPP_NUMBER = "79887997977";

/**
 * Язык сообщения выбирается по покупателю, но вариантов всего два.
 * Русскому пишем по-русски, всем остальным по-английски: продавцу надо
 * прочитать заказ, а английский он понимает — сайт у него на девяти языках.
 * Турецкий или арабский текст в переписке не помог бы никому.
 */
const T = {
  ru: {
    hello: "Здравствуйте! Хочу приобрести:",
    size: "размер",
    pcs: "шт",
    photo: "фото",
    total: "Итого",
    shown: "на сайте показано",
    name: "Имя",
    country: "Страна",
    city: "Город и адрес",
    comment: "Комментарий",
    phone: "Телефон",
  },
  en: {
    hello: "Hello! I would like to order:",
    size: "size",
    pcs: "pcs",
    photo: "photo",
    total: "Total",
    shown: "shown on the site as",
    name: "Name",
    country: "Country",
    city: "City and address",
    comment: "Comment",
    phone: "Phone",
  },
};

/**
 * Адрес фото для WhatsApp.
 *
 * Каталог хранится в webp — он легче, но WhatsApp такие ссылки почти никогда
 * не разворачивает в картинку. Поэтому рядом лежат jpg-копии первых фото
 * каждого товара, в папке public/wa. Их WhatsApp показывает миниатюрой,
 * и в переписке видно само фото, а не голая ссылка.
 *
 * ДОБАВИЛ НОВЫЙ ТОВАР — сделай и jpg-копию его первого фото в public/wa
 * с тем же именем. Готовый скрипт: скрипты/фото-для-whatsapp.py
 */
function photoUrl(origin, image) {
  if (!image) return null;
  // Товар, добавленный через /admin, хранит фото уже готовой ссылкой
  // на Vercel Blob — её и используем как есть, копии в /wa для неё нет.
  if (/^https?:\/\//.test(image)) return image;
  const name = image.split("/").pop().replace(/\.\w+$/, ".jpg");
  return `${origin}/wa/${name}`;
}

/**
 * Собирает текст заказа.
 *
 * Приложить настоящий файл ссылкой WhatsApp не позволяет — в ссылку можно
 * положить только текст. Зато он сам разворачивает превью у ПЕРВОЙ ссылки
 * в сообщении. Поэтому фото первого товара идёт раньше всех остальных
 * ссылок и показывается картинкой.
 */
export function buildOrderText(o) {
  const t = T[o.lang === "ru" ? "ru" : "en"];
  const rub = (n) => `${n.toLocaleString("ru-RU")} ₽`;

  const lines = o.items.map((i, n) => {
    const size = i.size === "ONE" ? "" : `, ${t.size} ${i.size}`;
    const url = photoUrl(o.origin, i.image);
    return [
      `${n + 1}. ${i.title}${size}, ${i.qty} ${t.pcs} — ${rub(i.qty * i.price)}`,
      url ? `   ${t.photo}: ${url}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  });

  const totalLine =
    o.currency && o.currency !== "RUB" && o.totalShown
      ? `${t.total}: ${rub(o.total)}  (${t.shown} ${o.totalShown})`
      : `${t.total}: ${rub(o.total)}`;

  return [
    t.hello,
    "",
    ...lines,
    "",
    totalLine,
    "",
    `${t.name}: ${o.name}`,
    o.phone ? `${t.phone}: ${o.phone}` : null,
    o.country ? `${t.country}: ${o.country}` : null,
    `${t.city}: ${o.city}`,
    o.comment ? `${t.comment}: ${o.comment}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Готовая ссылка на чат с заполненным сообщением */
export function orderLink(o) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderText(o))}`;
}
