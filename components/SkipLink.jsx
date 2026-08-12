"use client";

import { useLocale } from "@/lib/locale-context";

/** Ссылка для тех, кто ходит по сайту с клавиатуры: первый Tab ведёт сюда */
export default function SkipLink() {
  const { t } = useLocale();

  return (
    <a
      href="#main"
      className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-volt focus:px-4 focus:py-3 focus:text-ink"
    >
      {t("nav.skip")}
    </a>
  );
}
