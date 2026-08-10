import { CONTACTS } from "@/lib/contacts";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Вуаль под текстом: делает заголовок читаемым на светлых кадрах видео */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/92 from-0% via-ink/55 via-35% to-transparent to-65%"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p
            className="label inline-flex items-center gap-2 bg-volt px-3 py-1.5 text-ink"
            style={{ animation: "fade-up .6s var(--ease-out-soft) both" }}
          >
            Отправка в день заказа
          </p>

          <h1 className="display display-see-through mt-6">
            <span className="rise-mask block">
              <span style={{ animationDelay: "80ms" }}>Бутсы</span>
            </span>
            <span className="rise-mask block">
              <span style={{ animationDelay: "180ms" }}>и шиповки</span>
            </span>
            <span className="rise-mask block text-volt">
              <span style={{ animationDelay: "280ms" }}>от 5990 ₽</span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-md text-base leading-relaxed text-text/90"
            style={{ animation: "fade-up .7s var(--ease-out-soft) .45s both" }}
          >
            Nike, Adidas, Puma, Mizuno, New Balance. Сороконожки, вратарские
            перчатки и мячи. Размеры 36–45. Поможем подобрать — часть моделей
            маломерит.
          </p>

          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animation: "fade-up .7s var(--ease-out-soft) .55s both" }}
          >
            <a
              href="#catalog"
              className="label flex min-h-13 items-center justify-center bg-volt px-8 py-4 font-bold text-ink transition-colors duration-200 hover:bg-volt-dim"
            >
              Смотреть каталог
            </a>
            <a
              href={CONTACTS.phoneHref}
              className="btn-sweep label tnum flex min-h-13 items-center justify-center border border-line-strong px-8 py-4 font-bold transition-colors duration-300 hover:border-volt hover:text-ink"
            >
              {CONTACTS.phoneDisplay}
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-8">
            {[
              ["27", "моделей"],
              ["36–45", "размеры"],
              ["1 день", "отправка"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="label text-text/75">{label}</dt>
                <dd className="display-md tnum mt-1">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Товар: фото на графитовой подложке, с ярлыком цены */}
        <div
          className="relative"
          style={{ animation: "fade-up .9s var(--ease-out-soft) .3s both" }}
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-surface/72 backdrop-blur-sm">
            <img
              src="/catalog/phantom-ag-1.webp"
              alt="Шиповки Nike Phantom"
              width={900}
              height={1125}
              fetchPriority="high"
              className="h-full w-full object-cover opacity-90"
            />
            <span className="label absolute left-0 top-0 bg-volt px-3 py-2 font-bold text-ink">
              Хит продаж
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-4">
            <p className="title text-lg">Nike Phantom · шиповки</p>
            <p className="tnum display-md text-volt">5990 ₽</p>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
