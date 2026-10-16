"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";

// Обувь: EU, RU, длина стопы, UK
const SHOES = [
  ["39", "38–39", "24.5", "6"],
  ["40", "39–40", "25.0", "6.5"],
  ["41", "40–41", "26.0", "7.5"],
  ["42", "41–42", "26.5", "8"],
  ["43", "42–43", "27.5", "9"],
  ["44", "43–44", "28.0", "9.5"],
  ["45", "44–45", "29.0", "10.5"],
];

// Взрослая одежда: размер, RU, рост, обхват груди. Ориентировочно —
// сверьте с поставщиком и поправьте цифры здесь.
const ADULT = [
  ["S", "44–46", "165–170", "88–92"],
  ["M", "46–48", "170–176", "92–96"],
  ["L", "48–50", "176–182", "96–100"],
  ["XL", "50–52", "182–188", "100–104"],
  ["2XL", "52–54", "188–194", "104–110"],
];

// Детская одежда: размер на бирке, возраст, рост, обхват груди (сетка магазина)
const KIDS = [
  ["10", "9–11", "134–146", "68–74"],
  ["12", "11–12", "146–152", "74–78"],
  ["14", "13–14", "152–164", "78–84"],
  ["16", "15–16", "164–174", "84–90"],
  ["18", "16+", "174–180", "90+"],
];

// Детские костюмы: размер, возраст, рост, длина кофты, грудь, длина брюк (сетка поставщика)
const KIDS_SUITS = [
  ["16", "3–4", "95–105", "42", "66", "31"],
  ["18", "4–5", "105–115", "45", "70", "33"],
  ["20", "6–7", "115–125", "48", "73", "35"],
  ["22", "7–8", "125–135", "50", "76", "37"],
  ["24", "8–9", "135–145", "55", "82", "39"],
  ["26", "10–11", "145–155", "59", "88", "41"],
  ["28", "12–14", "155–165", "62", "94", "43"],
];

export default function SizeGuide() {
  const { t } = useLocale();
  const [tab, setTab] = useState("shoes");

  const TABLES = {
    shoes: {
      rows: SHOES,
      heads: [t("size.eu"), t("size.ru"), t("size.len"), t("size.uk")],
    },
    adult: {
      rows: ADULT,
      heads: [t("size.size"), t("size.ru"), t("size.height"), t("size.chest")],
    },
    kids: {
      rows: KIDS,
      heads: [t("size.size"), t("size.age"), t("size.height"), t("size.chest")],
    },
    kidsSuits: {
      rows: KIDS_SUITS,
      heads: [
        t("size.size"), t("size.age"), t("size.height"),
        t("size.shirtLen"), t("size.chest"), t("size.pantsLen"),
      ],
    },
  };
  const { rows: ROWS, heads } = TABLES[tab];

  return (
    <section id="sizes" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 className="display-md">{t("size.title")}</h2>
        <p className="max-w-sm text-sm text-muted">
          {tab === "shoes" ? t("size.lead") : t("size.leadClothes")}
        </p>
      </div>

      <div role="tablist" aria-label={t("size.title")} className="mt-6 flex flex-wrap gap-2">
        {["shoes", "adult", "kids", "kidsSuits"].map((id) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`label min-h-11 rounded-xl px-4 font-bold transition-colors duration-200 ${
              tab === id
                ? "bg-volt text-ink"
                : "border border-line-strong text-muted hover:border-volt hover:text-text"
            }`}
          >
            {t(`size.tab.${id}`)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 sm:mt-8 sm:gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink/90 backdrop-blur-md">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">{t("size.title")}</caption>
            <thead>
              <tr className="bg-surface">
                {heads.map((h) => (
                  <th key={h} scope="col" className="label px-4 py-3 text-text/80">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row[0]} className={i % 2 ? "bg-surface/60" : undefined}>
                  <th scope="row" className="tnum title px-4 py-3 text-left text-lg text-volt">
                    {row[0]}
                  </th>
                  {row.slice(1).map((cell, j) => (
                    <td key={j} className="tnum px-4 py-3 text-sm text-text">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 bg-ink/78 p-5 backdrop-blur-md"
            >
              <h3 className="title text-base">{t(`size.tip${i}.t`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(`size.tip${i}.d`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
