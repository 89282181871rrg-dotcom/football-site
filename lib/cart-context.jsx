"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "futbolki-cart-v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Восстанавливаем корзину после монтирования, чтобы не сломать SSR
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // повреждённые данные игнорируем
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // приватный режим — просто не сохраняем
    }
  }, [items, ready]);

  const value = useMemo(() => {
    const key = (id, size) => `${id}__${size}`;

    const add = (product, size) =>
      setItems((prev) => {
        const k = key(product.id, size);
        const found = prev.find((i) => i.key === k);
        if (found) {
          return prev.map((i) =>
            i.key === k ? { ...i, qty: Math.min(i.qty + 1, 99) } : i
          );
        }
        return [
          ...prev,
          {
            key: k,
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            size,
            qty: 1,
          },
        ];
      });

    const setQty = (k, qty) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.key !== k)
          : prev.map((i) => (i.key === k ? { ...i, qty: Math.min(qty, 99) } : i))
      );

    const remove = (k) => setItems((prev) => prev.filter((i) => i.key !== k));
    const clear = () => setItems([]);

    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);

    return { items, add, setQty, remove, clear, count, total, isOpen, setOpen };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart должен вызываться внутри CartProvider");
  return ctx;
}
