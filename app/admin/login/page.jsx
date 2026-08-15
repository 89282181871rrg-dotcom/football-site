"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Вход в панель добавления товаров. Панель служебная, одна на хозяина
 * магазина, поэтому без переключения языка — только русский.
 */
export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не удалось войти");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-6"
      >
        <h1 className="title text-xl">Админка</h1>
        <p className="mt-1 text-sm text-muted">Futbolki Russia · добавление товаров</p>

        <label htmlFor="password" className="label mt-6 block text-muted">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-line-strong bg-ink px-4 text-base text-text focus:border-volt"
        />

        {error && <p className="mt-3 text-sm font-bold text-volt">{error}</p>}

        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="label mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-volt px-5 font-bold text-ink disabled:opacity-50"
        >
          {busy ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
