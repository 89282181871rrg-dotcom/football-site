const ITEMS = [
  [
    "Показываем на видео",
    "Снимаем каждую пару сами — видно материал, цвет и подошву. Без сюрпризов при получении.",
  ],
  [
    "Отправка в день заказа",
    "Заказ до 16:00 уходит в тот же день. СДЭК, Почта России, Boxberry.",
  ],
  [
    "Поможем с размером",
    "Часть моделей маломерит. Напишите длину стопы — подберём точно.",
  ],
  [
    "Мячи и перчатки 1+1",
    "Покупаете один мяч или пару перчаток — вторые идут в подарок.",
  ],
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(([title, text], i) => (
          <div key={title} className="border border-white/5 bg-ink/78 p-6 backdrop-blur-md">
            <p className="tnum display-md text-volt">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="title mt-4 text-lg">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
