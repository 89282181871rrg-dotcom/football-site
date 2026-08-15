import { NextResponse } from "next/server";

/**
 * Закрывает /admin паролем из переменной ADMIN_PASSWORD.
 *
 * Пароль один на всех — панель на одного человека (хозяина магазина),
 * поэтому без отдельных логинов и без базы пользователей. Куки ставится
 * при входе в app/api/admin/login, здесь только проверка при каждом заходе
 * на закрытые страницы и запросы админки.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD;
  const cookie = request.cookies.get("admin_session")?.value;

  if (!password || cookie !== password) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
