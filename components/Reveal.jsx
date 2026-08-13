"use client";

import { useEffect, useRef } from "react";

/**
 * Появление блока при попадании в экран.
 * Наблюдатель отключается после первого срабатывания — анимация не повторяется.
 * Если в системе включено «меньше движения», класс ставится сразу.
 */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      /*
       * threshold обязан быть нулём, и вот почему.
       *
       * Это доля площади блока, попавшая в экран. Для блока выше экрана она
       * физически не может стать большой: у каталога на телефоне высота около
       * 9000 px, экран 844 px, то есть максимум 8.5%. С прежним порогом 0.12
       * условие не выполнялось никогда — наблюдатель не срабатывал, класс
       * is-visible не ставился, и весь каталог навсегда оставался прозрачным.
       * Место под него на странице было, товаров не было.
       *
       * На широком экране каталог идёт в четыре колонки, он втрое ниже, доля
       * доходила до 14% — и там всё работало. Поэтому баг было видно только
       * на телефоне.
       *
       * С нулём блок появляется, едва его край пересечёт линию, поднятую
       * на 8% от низа экрана. Для невысоких блоков разница на глаз незаметна,
       * а высокие перестают зависеть от своей высоты.
       */
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
