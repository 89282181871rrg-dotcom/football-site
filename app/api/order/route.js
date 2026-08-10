// Приём заказа с сайта.
//
// Заказ уходит на почту через Web3Forms — бесплатный сервис, которому нужен
// только публичный access key (не пароль от почты, пароль нигде не нужен).
// Получить ключ: https://web3forms.com — вводите почту, ключ приходит письмом.
//
// Пока ключ не прописан, сайт работает: заказ пишется в логи сервера,
// и клиент всё равно видит телефон для звонка.

const OWNER_EMAIL = "89282181871rrg@gmail.com";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { name, phone, comment, items, total } = payload ?? {};

  // Проверяем на сервере, а не только в браузере
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof phone !== "string" ||
    phone.replace(/\D/g, "").length < 10 ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return Response.json(
      { error: "Проверьте имя, телефон и состав заказа" },
      { status: 400 }
    );
  }

  const lines = items.map(
    (i) => `• ${i.title} — размер ${i.size} × ${i.qty} = ${i.qty * i.price} ₽`
  );

  const text = [
    "НОВЫЙ ЗАКАЗ С САЙТА",
    "",
    `Имя: ${name.trim()}`,
    `Телефон: ${phone.trim()}`,
    comment ? `Комментарий: ${comment.trim()}` : null,
    "",
    "Состав заказа:",
    ...lines,
    "",
    `ИТОГО: ${total} ₽`,
  ]
    .filter(Boolean)
    .join("\n");

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  // Без ключа заказ не теряем — пишем в лог, чтобы можно было поднять руками
  if (!accessKey) {
    console.warn("[order] Почта не настроена, заказ только в логах:\n" + text);
    return Response.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Заказ с сайта — ${name.trim()}, ${total} ₽`,
        from_name: "Futbolki Russia — заказ с сайта",
        to: OWNER_EMAIL,
        message: text,
      }),
    });

    if (!res.ok) {
      console.error("[order] Сервис почты вернул ошибку", await res.text());
      return Response.json({ error: "Не удалось отправить заказ" }, { status: 502 });
    }

    return Response.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[order] Сбой при отправке заказа", err);
    return Response.json({ error: "Не удалось отправить заказ" }, { status: 502 });
  }
}
