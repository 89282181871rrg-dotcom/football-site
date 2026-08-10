"use client";

import { useEffect, useState } from "react";

/**
 * Фоновая петля в герое.
 * Видео подключается только если пользователь не просил уменьшить движение
 * и не сидит на экономии трафика. В остальных случаях остаётся постер.
 */
export default function HeroVideo() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData === true;
    const slow = /2g/.test(navigator.connection?.effectiveType ?? "");
    if (!reduced && !saveData && !slow) setPlay(true);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {play ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/video/hero-poster.webp"
          className="h-full w-full scale-110 object-cover blur-[2px]"
        >
          <source src="/video/hero-loop.webm" type="video/webm" />
          <source src="/video/hero-loop.mp4" type="video/mp4" />
        </video>
      ) : (
        <img
          src="/video/hero-poster.webp"
          alt=""
          className="h-full w-full scale-110 object-cover blur-[2px]"
        />
      )}

      {/* Затемнение: без него текст на видео не читается */}
      <div className="absolute inset-0 bg-ink/85" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
    </div>
  );
}
