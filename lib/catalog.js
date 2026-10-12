import { readMoyskladProducts } from "./moysklad";

/**
 * Каталог целиком берётся из МойСклада (MOYSKLAD_TOKEN).
 * Вызывается только на сервере — из app/page.jsx.
 */
export async function getAllProducts() {
  return (await readMoyskladProducts()) ?? [];
}
