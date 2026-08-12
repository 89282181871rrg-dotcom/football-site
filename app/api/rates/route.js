/**
 * Курсы валют. Тянем у Центробанка России — открыто, без ключей и лимитов.
 * Кэшируем на 12 часов: курс ЦБ меняется раз в сутки, чаще спрашивать незачем.
 *
 * Берём все валюты, которые есть и у ЦБ, и в нашем списке. Если валюты
 * у ЦБ нет, на сайте останется запасное значение из lib/currency.js.
 */

import { CURRENCIES } from "@/lib/currency";

export const revalidate = 43200; // 12 часов

export async function GET() {
  try {
    const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js", {
      next: { revalidate: 43200 },
    });
    if (!res.ok) throw new Error("bad response");

    const data = await res.json();
    const rates = { RUB: 1 };
    const missing = [];

    for (const code of Object.keys(CURRENCIES)) {
      if (code === "RUB") continue;
      const v = data?.Valute?.[code];
      // ЦБ отдаёт курс за Nominal единиц: например за 100 тенге
      if (v?.Value && v?.Nominal) rates[code] = v.Value / v.Nominal;
      else missing.push(code);
    }

    if (missing.length) {
      console.warn("[курсы] Нет у ЦБ, работают запасные значения:", missing.join(", "));
    }

    return Response.json({ rates, updated: data?.Date ?? null });
  } catch (err) {
    console.warn("[курсы] Не удалось получить курс ЦБ, используем запасные:", err.message);
    return Response.json({ rates: null });
  }
}
