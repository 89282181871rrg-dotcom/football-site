"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Видеофон на весь сайт.
 *
 * ЧТОБЫ ПОМЕНЯТЬ РОЛИКИ: положи файлы в public/video/ и поправь список ниже.
 * Ролики играют по очереди, по кругу. Путь вида "/video/имя.mp4".
 */
const PLAYLIST = [
  "/video/lv_0_20260809184654.mp4", // Ла Лига
  "/video/apl-logos.mp4",           // эмблемы клубов АПЛ
];
const POSTER = "";

/** Затемнение поверх видео. Больше — темнее фон и лучше читается текст. */
const OVERLAY = 0.5;

/**
 * Увеличение кадра. 1 — как есть. Поднимай, если в ролике есть чёрные поля
 * по краям: при 1.2 обрезается по 10% с каждой стороны, и поля уходят за экран.
 * Обратная сторона — остальные сцены тоже обрежутся сильнее.
 *
 * Значений три, потому что экраны разные. Телефон вертикальный, а ролик
 * горизонтальный: браузер и так показывает лишь узкую полосу по центру кадра,
 * и любое увеличение сверху превращает фон в пятно. Поэтому на телефоне 1.
 */
const ZOOM = 1.25;        // компьютер, от 1024 px
const ZOOM_TABLET = 1.1;  // планшет, от 640 px
const ZOOM_PHONE = 1;     // телефон

export default function VideoBackground() {
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const src = PLAYLIST[index];
  const next = () => setIndex((i) => (i + 1) % PLAYLIST.length);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = () => {
      if (motionOK) v.play().catch(() => {});
      else v.pause();
    };

    start();
    v.addEventListener("loadeddata", start);
    document.addEventListener("visibilitychange", start);
    window.addEventListener("touchstart", start, { once: true, passive: true });

    return () => {
      v.removeEventListener("loadeddata", start);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("touchstart", start);
    };
  }, [src]); // новый ролик из списка — новый <video>, запускаем заново

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 select-none overflow-hidden bg-ink"
      style={{ zIndex: -1 }}
    >
      <video
        key={src}
        ref={videoRef}
        autoPlay
        muted
        loop={PLAYLIST.length === 1}
        onEnded={next}
        playsInline
        preload="auto"
        {...(POSTER ? { poster: POSTER } : {})}
        disablePictureInPicture
        onError={() => {
          console.error("[фон] Видео не загрузилось:", src);
          if (PLAYLIST.length > 1) next();
        }}
        className="bg-video absolute inset-0 h-full w-full"
        style={{
          objectFit: "cover",
          objectPosition: "center center",
          transformOrigin: "center center",
          pointerEvents: "none",
          // Сам масштаб выбирается по ширине экрана — правило .bg-video в globals.css
          "--zoom-phone": ZOOM_PHONE,
          "--zoom-tablet": ZOOM_TABLET,
          "--zoom-desktop": ZOOM,
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Затемнение для читаемости текста */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0, 0, 0, ${OVERLAY})` }}
      />
    </div>
  );
}
