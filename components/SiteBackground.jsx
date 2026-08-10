"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Фон всего сайта: тёмная сцена с металлическими осколками и медленным свечением.
 * Рисуется на canvas, поэтому не грузится по сети и не зависит от политик
 * автовоспроизведения видео на iOS.
 *
 * Требования, которые он закрывает:
 *  — на весь экран, position: fixed, контент скроллится поверх
 *  — z-index ниже контента, pointer-events: none
 *  — тёмный оверлей поверх для читаемости текста
 *  — на мобильных не съезжает: fixed inset-0 не зависит от адресной строки,
 *    поэтому известной проблемы со 100vh здесь просто нет
 *  — при «уменьшить движение» и на слабых устройствах — статичная заливка
 */
export default function SiteBackground() {
  const canvasRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    const saveData = navigator.connection?.saveData === true;
    setAnimate(!reduced && !weak && !saveData);
  }, []);

  useEffect(() => {
    if (!animate) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let shards = [];
    let running = true;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Меньше осколков на узких экранах — телефон не должен греться
      const count = w < 768 ? 16 : w < 1280 ? 28 : 40;
      shards = Array.from({ length: count }, () => {
        const depth = 0.35 + Math.random() * 0.65; // дальние медленнее и темнее
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size: (26 + Math.random() * 74) * depth,
          angle: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.0016,
          vx: (Math.random() - 0.5) * 0.12 * depth,
          vy: (-0.05 - Math.random() * 0.16) * depth,
          depth,
        };
      });
    };

    const draw = (t) => {
      if (!running) return;

      // Базовая заливка
      ctx.fillStyle = "#0d0d10";
      ctx.fillRect(0, 0, w, h);

      // Медленное багровое свечение снизу — «горизонт» сцены
      const pulse = 0.5 + 0.5 * Math.sin(t / 6200);
      const glowY = h * 0.86;
      const glow = ctx.createRadialGradient(
        w * 0.5,
        glowY,
        0,
        w * 0.5,
        glowY,
        Math.max(w, h) * 0.75
      );
      glow.addColorStop(0, `rgba(214, 38, 56, ${0.52 + pulse * 0.18})`);
      glow.addColorStop(0.45, "rgba(110, 22, 36, 0.26)");
      glow.addColorStop(1, "rgba(13, 13, 16, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Холодный лаймовый подсвет сверху слева — связка с акцентом сайта
      const cool = ctx.createRadialGradient(
        w * 0.18,
        h * 0.1,
        0,
        w * 0.18,
        h * 0.1,
        Math.max(w, h) * 0.5
      );
      cool.addColorStop(0, `rgba(216, 255, 60, ${0.10 + (1 - pulse) * 0.05})`);
      cool.addColorStop(1, "rgba(13, 13, 16, 0)");
      ctx.fillStyle = cool;
      ctx.fillRect(0, 0, w, h);

      // Осколки
      for (const s of shards) {
        s.x += s.vx;
        s.y += s.vy;
        s.angle += s.spin;

        if (s.y + s.size < 0) {
          s.y = h + s.size;
          s.x = Math.random() * w;
        }
        if (s.x < -s.size) s.x = w + s.size;
        if (s.x > w + s.size) s.x = -s.size;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);

        const g = ctx.createLinearGradient(-s.size, -s.size, s.size, s.size);
        g.addColorStop(0, `rgba(255, 255, 255, ${0.16 * s.depth})`);
        g.addColorStop(0.5, `rgba(186, 48, 66, ${0.34 * s.depth})`);
        g.addColorStop(1, `rgba(20, 20, 24, ${0.5 * s.depth})`);
        ctx.fillStyle = g;
        ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size * 0.62);

        // Тонкая грань — металлический блик
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.13 * s.depth})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size * 0.62);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 150);
    };

    setup();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [animate]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 select-none"
      style={{ zIndex: -1 }}
    >
      {animate ? (
        <canvas ref={canvasRef} className="block h-full w-full" />
      ) : (
        // Статичная замена: тот же образ без единого кадра анимации
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 90%, rgba(214,38,56,0.5) 0%, rgba(110,22,36,0.24) 45%, rgba(13,13,16,0) 100%), radial-gradient(70% 50% at 18% 10%, rgba(216,255,60,0.11) 0%, rgba(13,13,16,0) 100%), #0d0d10",
          }}
        />
      )}

      {/* Тёмный оверлей для читаемости текста поверх фона */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
