import { fetchMoyskladImage } from "@/lib/moysklad";

// Фото товаров из МойСклада. Сам МойСклад отдаёт файлы только с токеном,
// поэтому браузер берёт их отсюда, а Vercel кэширует ответ на сутки.
export async function GET(_req, { params }) {
  const { id } = await params;
  if (!process.env.MOYSKLAD_TOKEN || !/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const res = await fetchMoyskladImage(id);
  if (!res.ok) return new Response("Not found", { status: 404 });

  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
