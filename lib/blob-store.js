import { put, list, del } from "@vercel/blob";

/**
 * Товары, которые хозяин добавил через /admin — отдельно от 27 штук,
 * зашитых в lib/products.js. Хранятся одним JSON-файлом в Vercel Blob.
 *
 * Полностью независимо от собственного кода сайта: если Blob не подключен
 * или временно недоступен, витрина всё равно открывается — просто без
 * добавленных вручную товаров. Разберись сначала, что все функции здесь
 * ловят свои ошибки сами и никогда не бросают исключение наружу.
 */

const PREFIX = "data/catalog";

/** Список товаров, добавленных через админку. Пустой список, если что-то не так. */
export async function readDynamicProducts() {
  try {
    const { blobs } = await list({ prefix: PREFIX });
    if (!blobs.length) return [];
    // На случай, если старая версия каталога не удалилась — берём самую свежую
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[админка] Blob недоступен, каталог показан без добавленных товаров:", err.message);
    return [];
  }
}

/** Сохраняет полный список добавленных товаров, старую версию убирает */
export async function writeDynamicProducts(products) {
  const { blobs } = await list({ prefix: PREFIX });
  await put(`${PREFIX}-${Date.now()}.json`, JSON.stringify(products), {
    access: "public",
    contentType: "application/json",
  });
  await Promise.all(blobs.map((b) => del(b.url).catch(() => {})));
}

/** Загружает одно фото товара, возвращает готовую публичную ссылку */
export async function uploadProductPhoto(file, productId, index) {
  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const blob = await put(`products/${productId}-${index}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

/** Удаляет фото товара при удалении самого товара */
export async function deleteProductPhotos(urls) {
  await Promise.all((urls || []).map((u) => del(u).catch(() => {})));
}
