export async function POST() {
  const res = Response.json({ ok: true });
  res.headers.set("Set-Cookie", "admin_session=; Path=/; HttpOnly; Max-Age=0");
  return res;
}
