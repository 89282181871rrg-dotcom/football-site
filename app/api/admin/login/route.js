/**
 * Вход в /admin. Пароль один, задаётся переменной ADMIN_PASSWORD
 * (в .env.local для разработки, в настройках Vercel — для боевого сайта).
 */
export async function POST(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return Response.json(
      { error: "Пароль администратора не настроен. Впишите ADMIN_PASSWORD в .env.local" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (typeof body?.password !== "string" || body.password !== password) {
    return Response.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const res = Response.json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    `admin_session=${encodeURIComponent(password)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
  );
  return res;
}
