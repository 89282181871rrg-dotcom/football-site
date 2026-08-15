"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/products";

const SIZE_OPTIONS = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
const REAL_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");

const emptyForm = {
  title: "",
  subtitle: "",
  category: REAL_CATEGORIES[0]?.id ?? "",
  price: "",
  badge: "",
  note: "",
  noSizes: false,
  sizes: [],
};

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState(null); // null = ещё грузится
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving | error
  const [errorMsg, setErrorMsg] = useState("");

  const load = () =>
    fetch("/api/admin/products")
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]));

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleSize = (s) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg("");

    if (files.length === 0) {
      setErrors({ photos: "Добавьте хотя бы одну фотографию" });
      return;
    }

    const data = new FormData();
    data.set("title", form.title);
    data.set("subtitle", form.subtitle);
    data.set("category", form.category);
    data.set("price", form.price);
    data.set("badge", form.badge);
    data.set("note", form.note);
    data.set("noSizes", form.noSizes ? "1" : "0");
    form.sizes.forEach((s) => data.set(`size_${s}`, "1"));
    files.forEach((f) => data.append("photos", f));

    setStatus("saving");
    try {
      const res = await fetch("/api/admin/products", { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok) {
        if (result.errors) setErrors(result.errors);
        else setErrorMsg(result.error || "Не удалось сохранить товар");
        setStatus("idle");
        return;
      }
      setForm(emptyForm);
      setFiles([]);
      setStatus("idle");
      load();
    } catch {
      setErrorMsg("Нет связи с сервером");
      setStatus("idle");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Удалить этот товар с сайта?")) return;
    setProducts((list) => list.filter((p) => p.id !== id)); // сразу убираем из вида
    const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) load(); // не получилось — возвращаем как было
  };

  const field =
    "h-12 w-full rounded-xl border border-line-strong bg-ink px-4 text-base text-text focus:border-volt";

  return (
    <div className="min-h-screen bg-ink px-4 py-8 text-text sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="title text-2xl">Админка</h1>
            <p className="text-sm text-muted">Futbolki Russia · добавление товаров</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="label flex min-h-11 items-center rounded-xl border border-line-strong px-4 font-bold hover:border-volt hover:text-volt"
          >
            Выйти
          </button>
        </div>

        <p className="mt-4 rounded-r-lg border-l-2 border-volt bg-surface/60 px-3 py-2 text-sm text-muted">
          Здесь добавляются только новые товары. Те 27, что уже на сайте, правит разработчик —
          так безопаснее менять их описание и переводы на другие языки.
        </p>

        {/* ---------- Форма добавления ---------- */}
        <form
          onSubmit={submit}
          className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-6"
        >
          <h2 className="title text-lg">Новый товар</h2>

          <div>
            <label className="label mb-1 block text-muted">Название*</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nike Phantom"
              className={field}
            />
            {errors.title && <p className="mt-1 text-sm font-bold text-volt">{errors.title}</p>}
          </div>

          <div>
            <label className="label mb-1 block text-muted">Подпись (необязательно)</label>
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Шиповки · новая расцветка"
              className={field}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label mb-1 block text-muted">Категория*</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={field}
              >
                {REAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm font-bold text-volt">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="label mb-1 block text-muted">Цена, ₽*</label>
              <input
                type="number"
                min="0"
                step="10"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="5990"
                className={field}
              />
              {errors.price && <p className="mt-1 text-sm font-bold text-volt">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label className="label mb-1 block text-muted">Пометка на фото (необязательно)</label>
            <input
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="Хит, Топ, 1+1…"
              className={field}
            />
          </div>

          <div>
            <label className="label mb-1 block text-muted">
              Комментарий под ценой (необязательно)
            </label>
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Маломерит — берите на размер больше"
              className={field}
            />
          </div>

          <div>
            <label className="label mb-2 flex items-center gap-2 text-muted">
              <input
                type="checkbox"
                checked={form.noSizes}
                onChange={(e) => setForm({ ...form, noSizes: e.target.checked })}
              />
              У товара нет размеров (мяч, боди и т.п.)
            </label>

            {!form.noSizes && (
              <>
                <p className="label mb-1 text-muted">Размеры*</p>
                <div className="flex flex-wrap gap-1.5">
                  {SIZE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-bold transition-colors duration-200 ${
                        form.sizes.includes(s)
                          ? "bg-volt text-ink"
                          : "border border-line-strong text-muted hover:border-volt hover:text-text"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
            {errors.sizes && <p className="mt-1 text-sm font-bold text-volt">{errors.sizes}</p>}
          </div>

          <div>
            <label className="label mb-1 block text-muted">Фотографии*</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-volt file:px-4 file:py-2 file:font-bold file:text-ink"
            />
            {files.length > 0 && (
              <p className="mt-1 text-sm text-muted">Выбрано файлов: {files.length}</p>
            )}
            {errors.photos && <p className="mt-1 text-sm font-bold text-volt">{errors.photos}</p>}
          </div>

          {errorMsg && (
            <p className="rounded-r-lg border-l-2 border-volt pl-3 text-sm font-bold">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "saving"}
            className="label flex min-h-12 w-full items-center justify-center rounded-xl bg-volt px-5 font-bold text-ink disabled:opacity-50"
          >
            {status === "saving" ? "Сохраняем…" : "Добавить товар"}
          </button>
        </form>

        {/* ---------- Список добавленного ---------- */}
        <div className="mt-8">
          <h2 className="title text-lg">Добавлено через админку</h2>

          {products === null ? (
            <p className="mt-4 text-sm text-muted">Загрузка…</p>
          ) : products.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Пока ничего не добавлено.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface p-3"
                >
                  <img
                    src={p.images?.[0]}
                    alt=""
                    className="h-14 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{p.title}</p>
                    <p className="truncate text-sm text-muted">
                      {p.price?.toLocaleString("ru-RU")} ₽ · {p.sizes?.join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="label shrink-0 rounded-lg border border-line-strong px-3 py-2 font-bold text-muted hover:border-volt hover:text-volt"
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
