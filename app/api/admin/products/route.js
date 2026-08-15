/**
 * Товары, добавленные хозяином через /admin.
 * Доступ уже проверен в middleware.js — сюда долетают только свои запросы,
 * но пароль сверяется и здесь на всякий случай, если правило middleware
 * когда-нибудь поменяют и забудут про этот путь.
 */
import {
  readDynamicProducts,
  writeDynamicProducts,
  uploadProductPhoto,
  deleteProductPhotos,
} from "@/lib/blob-store";
import { CATEGORIES } from "@/lib/products";

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));
const SIZE_OPTIONS = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

function checkAuth(request) {
  const password = process.env.ADMIN_PASSWORD;
  const cookie = request.cookies.get("admin_session")?.value;
  return Boolean(password) && cookie === password;
}

function slugify(text) {
  const translit = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",
    к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
    х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
  };
  const base = text
    .toLowerCase()
    .split("")
    .map((ch) => translit[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "tovar"}-${Date.now().toString(36)}`;
}

export async function GET(request) {
  if (!checkAuth(request)) return Response.json({ error: "Нет доступа" }, { status: 401 });
  const products = await readDynamicProducts();
  return Response.json({ products });
}

export async function POST(request) {
  if (!checkAuth(request)) return Response.json({ error: "Нет доступа" }, { status: 401 });

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Некорректная форма" }, { status: 400 });
  }

  const title = String(form.get("title") || "").trim();
  const subtitle = String(form.get("subtitle") || "").trim();
  const category = String(form.get("category") || "");
  const price = Number(form.get("price"));
  const badge = String(form.get("badge") || "").trim();
  const note = String(form.get("note") || "").trim();
  const noSizes = form.get("noSizes") === "1";
  const sizes = noSizes
    ? ["ONE"]
    : SIZE_OPTIONS.filter((s) => form.get(`size_${s}`) === "1");
  const photos = form.getAll("photos").filter((f) => f && typeof f === "object" && f.size > 0);

  const errors = {};
  if (title.length < 2) errors.title = "Укажите название — минимум 2 символа";
  if (!CATEGORY_IDS.has(category)) errors.category = "Выберите категорию";
  if (!Number.isFinite(price) || price <= 0) errors.price = "Укажите цену числом";
  if (sizes.length === 0) errors.sizes = "Выберите хотя бы один размер или отметьте «без размеров»";
  if (photos.length === 0) errors.photos = "Добавьте хотя бы одну фотографию";
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  const id = slugify(title);

  let images;
  try {
    images = await Promise.all(photos.map((file, i) => uploadProductPhoto(file, id, i + 1)));
  } catch (err) {
    return Response.json(
      { error: "Не удалось загрузить фото. Проверьте, что в Vercel подключено хранилище Blob." },
      { status: 500 }
    );
  }

  const product = {
    id,
    title,
    subtitle: subtitle || undefined,
    category,
    price,
    badge: badge || undefined,
    note: note || undefined,
    sizes,
    images,
    addedAt: new Date().toISOString(),
  };

  const current = await readDynamicProducts();
  await writeDynamicProducts([...current, product]);

  return Response.json({ ok: true, product });
}

export async function DELETE(request) {
  if (!checkAuth(request)) return Response.json({ error: "Нет доступа" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Не указан товар" }, { status: 400 });

  const current = await readDynamicProducts();
  const target = current.find((p) => p.id === id);
  if (!target) return Response.json({ error: "Товар уже удалён" }, { status: 404 });

  await writeDynamicProducts(current.filter((p) => p.id !== id));
  await deleteProductPhotos(target.images);

  return Response.json({ ok: true });
}
