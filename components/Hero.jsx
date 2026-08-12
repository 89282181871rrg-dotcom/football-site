"use client";

import { CONTACTS } from "@/lib/contacts";
import { useLocale } from "@/lib/locale-context";
import { PRODUCTS } from "@/lib/products";

export default function Hero() {
  const { t, money } = useLocale();

  const minPrice = Math.min(...PRODUCTS.filter((p) => p.category !== "kids").map((p) => p.price));
  const featured = PRODUCTS.find((p) => p.id === "phantom-ag") ?? PRODUCTS[0];

  return (
    <section className="relative overflow-hidden">
      {/* Вуаль под текстом: плотная слева, к правому краю сходит на нет */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/92 from-0% via-ink/55 via-35% to-transparent to-65%"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p
              className="label inline-flex items-center gap-2 rounded-lg bg-volt px-3 py-1.5 text-ink"
              style={{ animation: "fade-up .6s var(--ease-out-soft) both" }}
            >
              {t("hero.badge")}
            </p>

            <h1 className="display display-see-through mt-6">
              <span className="rise-mask block">
                <span style={{ animationDelay: "80ms" }}>{t("hero.title1")}</span>
              </span>
              <span className="rise-mask block">
                <span style={{ animationDelay: "180ms" }}>{t("hero.title2")}</span>
              </span>
              <span className="rise-mask block text-volt">
                <span style={{ animationDelay: "280ms" }}>
                  {t("hero.title3", { price: money(minPrice) })}
                </span>
              </span>
            </h1>

            <p
              className="mt-6 max-w-md text-base leading-relaxed text-text/90"
              style={{ animation: "fade-up .7s var(--ease-out-soft) .45s both" }}
            >
              {t("hero.lead")}
            </p>

            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animation: "fade-up .7s var(--ease-out-soft) .55s both" }}
            >
              <a
                href="#catalog"
                className="label flex min-h-13 items-center justify-center rounded-xl bg-volt px-8 py-4 font-bold text-ink transition-colors duration-200 hover:bg-volt-dim"
              >
                {t("hero.cta")}
              </a>
              <a
                href={CONTACTS.phoneHref}
                className="btn-sweep label tnum flex min-h-13 items-center justify-center rounded-xl border border-line-strong px-8 py-4 font-bold transition-colors duration-300 hover:border-volt hover:text-ink"
              >
                {CONTACTS.phoneDisplay}
              </a>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-8">
              {[
                [String(PRODUCTS.length), t("hero.stat.models")],
                ["36–45", t("hero.stat.sizes")],
                [t("hero.stat.shipValue"), t("hero.stat.ship")],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="label text-text/75">{label}</dt>
                  <dd className="display-md tnum mt-1">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="relative"
            style={{ animation: "fade-up .9s var(--ease-out-soft) .3s both" }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-surface/72 backdrop-blur-sm">
              <img
                src={featured.images?.[0] ?? featured.image}
                alt={featured.title}
                width={900}
                height={1125}
                fetchPriority="high"
                className="h-full w-full object-cover opacity-90"
              />
              <span className="label absolute left-0 top-0 rounded-br-xl bg-volt px-3 py-2 font-bold text-ink">
                {t("hero.hit")}
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-4">
              <p className="title text-lg">{featured.title}</p>
              <p className="tnum display-md text-volt">{money(featured.price)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
