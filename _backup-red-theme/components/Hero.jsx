import { CONTACTS } from "@/lib/contacts";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold tracking-wide text-muted">
          Доставка по всей России
        </p>

        <h1 className="max-w-3xl text-4xl font-bold sm:text-6xl">
          Бутсы, шиповки и{" "}
          <span className="text-accent">вратарские перчатки</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Nike, Adidas, Puma, Mizuno, New Balance. Шиповки от 5990 ₽, бутсы
          от 6990 ₽, перчатки из немецкого латекса. Поможем подобрать размер —
          многие модели маломерят.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#catalog"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent-strong px-7 text-base font-semibold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Смотреть каталог
          </a>
          <a
            href={CONTACTS.phoneHref}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line-strong bg-surface px-7 text-base font-semibold transition-colors duration-200 hover:bg-surface-2"
          >
            Позвонить и спросить
          </a>
        </div>

        <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-8">
          {[
            ["от 5990 ₽", "шиповки"],
            ["36–45", "размеры"],
            ["1 день", "отправка"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="display tnum block text-2xl font-bold sm:text-3xl">
                  {value}
                </span>
                <span className="text-sm text-muted">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
