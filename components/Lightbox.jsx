"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Полноэкранный просмотр фото.
 * Стрелки и свайп переключают кадры, Esc закрывает, фокус запирается внутри.
 */
export default function Lightbox({ images, index, title, onClose, onIndex }) {
  const panelRef = useRef(null);
  const touchX = useRef(null);

  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex]
  );
  const next = useCallback(
    () => onIndex((index + 1) % images.length),
    [index, images.length, onIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
    touchX.current = null;
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Фотографии: ${title}`}
      tabIndex={-1}
      className="drawer-veil fixed inset-0 z-[60] flex flex-col bg-black/95"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <p className="title text-base">{title}</p>
        <p className="tnum label text-muted">
          {index + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="label flex min-h-11 min-w-11 items-center justify-center border border-line-strong px-3 font-bold transition-colors duration-200 hover:border-volt hover:text-volt"
        >
          <span aria-hidden="true">✕</span>
          <span className="sr-only">Закрыть просмотр</span>
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-2"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <img
          key={images[index]}
          src={images[index]}
          alt={`${title} — фото ${index + 1}`}
          className="max-h-full max-w-full object-contain"
          style={{ animation: "fade-up .3s var(--ease-out-soft) both" }}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 flex h-14 w-14 items-center justify-center bg-ink/80 text-2xl transition-colors duration-200 hover:bg-volt hover:text-ink"
            >
              <span aria-hidden="true">‹</span>
              <span className="sr-only">Предыдущее фото</span>
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 flex h-14 w-14 items-center justify-center bg-ink/80 text-2xl transition-colors duration-200 hover:bg-volt hover:text-ink"
            >
              <span aria-hidden="true">›</span>
              <span className="sr-only">Следующее фото</span>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-5 pt-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onIndex(i)}
              aria-current={i === index}
              className={`h-16 w-14 shrink-0 overflow-hidden border-2 transition-colors duration-200 ${
                i === index ? "border-volt" : "border-transparent opacity-60"
              }`}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="sr-only">Фото {i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
