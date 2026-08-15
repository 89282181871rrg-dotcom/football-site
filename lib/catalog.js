import { PRODUCTS as STATIC_PRODUCTS, CATEGORIES } from "./products";
import { readDynamicProducts } from "./blob-store";

export { CATEGORIES };

/**
 * Полный каталог: 27 товаров, зашитых в код, плюс всё, что хозяин добавил
 * через /admin. Вызывается только на сервере — из app/page.jsx — и передаётся
 * дальше готовым списком, компоненты каталога сами ничего не запрашивают.
 */
export async function getAllProducts() {
  const dynamic = await readDynamicProducts();
  return [...STATIC_PRODUCTS, ...dynamic];
}
