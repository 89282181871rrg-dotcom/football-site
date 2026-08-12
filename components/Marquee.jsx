"use client";

import { useLocale } from "@/lib/locale-context";

/**
 * Бегущая строка. Слова берутся из словаря языка, поэтому меняются
 * вместе с интерфейсом. Марки не переводятся — это имена собственные.
 */
export default function Marquee() {
  const { t } = useLocale();

  const words = [
    "NIKE",
    "ADIDAS",
    "PUMA",
    "MIZUNO",
    "NEW BALANCE",
    t("cat.fg"),
    t("cat.ag"),
    t("cat.tf"),
    t("cat.gloves"),
    `${t("cat.balls")} 1+1`,
    t("hero.badge"),
  ];

  // Лента дублируется — сдвиг на -50% выглядит бесшовным
  const line = [...words, ...words];

  return (
    <div className="marquee overflow-hidden bg-volt py-3" aria-hidden="true">
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {line.map((w, i) => (
          <span key={i} className="title flex items-center text-lg text-ink">
            <span className="px-5">{w}</span>
            <span className="opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
