/**
 * Каталог из МойСклада (JSON API 1.2): товары, цены, размеры, остатки и фото.
 *
 * Включается переменной MOYSKLAD_TOKEN. Без неё, или если МойСклад
 * недоступен, возвращается null — сайт показывает товары из lib/products.js.
 *
 * Как устроено в МойСкладе:
 *  - товар  → карточка на сайте (название, описание, цена продажи, фото);
 *  - группа товара → вкладка в каталоге с тем же названием;
 *  - модификации с характеристикой «Размер» → список размеров.
 * Показываются только товары и размеры в наличии на складе.
 */

const API = "https://api.moysklad.ru/api/remap/1.2";
const REVALIDATE = 300; // список товаров обновляется раз в 5 минут

const SIZE_ATTR = (process.env.MOYSKLAD_SIZE_ATTR || "Размер").toLowerCase();

function headers() {
  return {
    Authorization: `Bearer ${process.env.MOYSKLAD_TOKEN}`,
    "Accept-Encoding": "gzip",
  };
}

async function get(path, revalidate = REVALIDATE) {
  const res = await fetch(`${API}${path}`, {
    headers: headers(),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`МойСклад ${res.status} ${path}`);
  return res.json();
}

/** Все строки списка с постраничной загрузкой */
async function getAll(path, pageSize) {
  const rows = [];
  const sep = path.includes("?") ? "&" : "?";
  for (let offset = 0; ; offset += pageSize) {
    const data = await get(`${path}${sep}limit=${pageSize}&offset=${offset}`);
    rows.push(...(data.rows ?? []));
    if (!data.rows || data.rows.length < pageSize) return rows;
  }
}

const idFromHref = (href) => href?.split("/").pop()?.split("?")[0];

/**
 * Вкладка на сайте = верхняя группа товара в МойСкладе,
 * подраздел внутри вкладки = подгруппа следующего уровня.
 * «Тренировочные костюмы/Детские» → вкладка «Тренировочные костюмы», подраздел «Детские».
 */
function groupsFor(folderPath) {
  const parts = (folderPath ?? "").split("/").map((s) => s.trim()).filter(Boolean);
  return { category: parts[0] ?? null, subcategory: parts[1] ?? null };
}

/**
 * Размер модификации. Сначала ищем характеристику с именем из MOYSKLAD_SIZE_ATTR
 * («Размер»), иначе берём первую любую: админ может назвать её «Одежда», «Обувь»…
 */
function sizeOf(variant) {
  const list = variant.characteristics ?? [];
  const c = list.find((ch) => ch.name?.toLowerCase() === SIZE_ATTR) ?? list[0];
  return c?.value?.trim();
}

// Размеры обуви по возрастанию, одежда (S, M, L…) — в своём порядке
const LETTER_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL", "4XL"];
function sortSizes(a, b) {
  const na = parseFloat(a.replace(",", "."));
  const nb = parseFloat(b.replace(",", "."));
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  const ia = LETTER_ORDER.indexOf(a.toUpperCase());
  const ib = LETTER_ORDER.indexOf(b.toUpperCase());
  if (ia !== -1 && ib !== -1) return ia - ib;
  return a.localeCompare(b, "ru");
}

/** Ссылка на фото через наш сервер: сам МойСклад отдаёт файлы только с токеном */
function imageUrl(img) {
  const id = idFromHref(img.meta?.downloadHref);
  return id ? `/api/ms-image/${id}` : null;
}

/**
 * Товары в формате lib/products.js или null, если интеграция выключена
 * или МойСклад не ответил.
 */
export async function readMoyskladProducts() {
  if (!process.env.MOYSKLAD_TOKEN) return null;

  try {
    const [products, variants, stock] = await Promise.all([
      // expand=images работает только при limit ≤ 100
      getAll("/entity/product?filter=archived=false&expand=images", 100),
      getAll("/entity/variant?filter=archived=false", 1000),
      get("/report/stock/all/current?stockType=quantity"),
    ]);

    const stockById = new Map(
      // при stockType=quantity количество приходит в поле quantity
      (Array.isArray(stock) ? stock : []).map((s) => [s.assortmentId, s.quantity ?? s.stock ?? 0])
    );
    const inStock = (id) => (stockById.get(id) ?? 0) > 0;

    const sizesByProduct = new Map();
    for (const v of variants) {
      const size = sizeOf(v);
      if (!size || !inStock(v.id)) continue; // только размеры в наличии
      const pid = idFromHref(v.product?.meta?.href);
      if (!sizesByProduct.has(pid)) sizesByProduct.set(pid, new Set());
      sizesByProduct.get(pid).add(size);
    }

    const result = [];
    const skipped = { noStock: 0, noPhoto: 0, noPrice: 0 };
    for (const p of products) {
      const hasVariants = (p.variantsCount ?? 0) > 0;
      const sizes = [...(sizesByProduct.get(p.id) ?? [])].sort(sortSizes);

      // На сайт попадает только то, что есть на складе: у товара с
      // модификациями — хотя бы один размер в наличии, без них — сам товар.
      // Незаполненные карточки без остатка не показываются.
      if (hasVariants ? sizes.length === 0 : !inStock(p.id)) { skipped.noStock++; continue; }

      let images = (p.images?.rows ?? []).map(imageUrl).filter(Boolean);
      if (images.length === 0) { skipped.noPhoto++; images = ["/no-photo.svg"]; }

      const price = Math.round((p.salePrices?.[0]?.value ?? 0) / 100);
      if (!price) skipped.noPrice++;

      result.push({
        id: `ms-${p.id}`,
        title: p.name,
        subtitle: p.description?.split("\n")[0]?.slice(0, 120) || undefined,
        ...groupsFor(p.pathName),
        price,
        sizes: sizes.length ? sizes : ["ONE"],
        images,
        source: "moysklad",
      });
    }
    // Сводка в логах Vercel: видно, почему товара из МойСклада нет на сайте
    console.info(
      `[МойСклад] товаров: ${products.length}, на сайте: ${result.length}, ` +
        `скрыто без остатка: ${skipped.noStock}, без фото: ${skipped.noPhoto}, без цены: ${skipped.noPrice}`
    );
    return result;
  } catch (err) {
    console.warn("[МойСклад] каталог не загрузился, показан встроенный:", err.message);
    return null;
  }
}

/** Скачивает файл фото из МойСклада (для /api/ms-image/[id]) */
export async function fetchMoyskladImage(id) {
  return fetch(`${API}/download/${id}`, {
    headers: headers(),
    redirect: "follow",
  });
}
