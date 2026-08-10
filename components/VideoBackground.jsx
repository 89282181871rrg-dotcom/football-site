"use client";

import { useEffect, useRef } from "react";

/**
 * Видеофон на весь сайт.
 *
 * ЧТОБЫ ПОМЕНЯТЬ РОЛИК: положи файл в public/video/ и поменяй SRC ниже.
 * Путь обязательно вида "/video/имя.mp4" — со слэшем в начале и расширением.
 */
const SRC = "/video/lv_0_20260809184654.mp4";
const SRC_WEBM = "";
const POSTER = "";

/** Затемнение поверх видео. Больше — темнее фон и лучше читается текст. */
const OVERLAY = 0.2;

/**
 * Увеличение кадра. 1 — как есть.
 * Поднимай, если в ролике есть чёрные поля по краям: при 1.2 обрезается
 * по 10% с каждой стороны, и поля уходят за экран.
 * Обратная сторона — остальные сцены тоже обрежутся сильнее.
 */
const ZOOM = 1.25;

export default function VideoBackground() {
  const videoRef = useRef(null);

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
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 select-none overflow-hidden bg-ink"
      style={{ zIndex: -1 }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        {...(POSTER ? { poster: POSTER } : {})}
        disablePictureInPicture
        onError={() =>
          console.error("[фон] Видео не загрузилось:", SRC)
        }
        className="absolute inset-0 h-full w-full"
        style={{
          objectFit: "cover",
          objectPosition: "center center",
          transform: `scale(${ZOOM})`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      >
        {SRC_WEBM && <source src={SRC_WEBM} type="video/webm" />}
        <source src={SRC} type="video/mp4" />
      </video>

      {/* Затемнение для читаемости текста */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0, 0, 0, ${OVERLAY})` }}
      />
    </div>
  );
}
