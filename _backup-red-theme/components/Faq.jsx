const QA = [
  {
    q: "Чем шиповки отличаются от бутс и сороконожек?",
    a: "Бутсы (FG) — длинные шипы, для натурального газона. Шиповки (AG) — шипов больше, они короче, для искусственного поля. Сороконожки (TF) — мелкий резиновый протектор, для жёсткого искусственного покрытия и коробок. Не уверены, что у вас за поле — напишите, подскажем.",
  },
  {
    q: "Модели маломерят?",
    a: "Часть моделей — да, особенно Puma Future и Adidas F50. Если сомневаетесь, берите на размер больше или напишите длину стопы в комментарии — подскажем точно.",
  },
  {
    q: "Сколько идёт доставка?",
    a: "Отправляем в день заказа, если он оформлен до 16:00. Крупные города — 2–3 дня, остальная Россия — 3–7 дней в зависимости от региона.",
  },
  {
    q: "Что если размер не подошёл?",
    a: "Меняем на другой размер. Обувь должна быть неношеной, с сохранённой коробкой. Напишите или позвоните — договоримся по обмену.",
  },
  {
    q: "Можно посмотреть вживую перед покупкой?",
    a: "Да, напишите — договоримся о встрече или отправим дополнительное видео нужной модели.",
  },
  {
    q: "Что за акция 1+1?",
    a: "На мячи и перчатки: покупаете один — второй идёт в подарок. На обувь акция не распространяется. Условия уточняйте при заказе.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-bold sm:text-4xl">Частые вопросы</h2>

      <div className="mt-8 space-y-3">
        {QA.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-line bg-surface px-5"
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold">
              {item.q}
              <span
                aria-hidden="true"
                className="text-accent transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-5 leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
