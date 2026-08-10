const ITEMS = [
  {
    title: "Показываем на видео",
    text: "Снимаем каждую пару сами — видно материал, цвет и подошву. Никаких сюрпризов при получении.",
  },
  {
    title: "Отправка в день заказа",
    text: "Заказ до 16:00 уходит в тот же день. СДЭК, Почта России, Boxberry.",
  },
  {
    title: "Поможем с размером",
    text: "Футбольная обувь садится плотнее обычной. Напишите длину стопы — подберём точно.",
  },
  {
    title: "Мячи и перчатки 1+1",
    text: "Покупаете один мяч или пару перчаток — вторые идут в подарок.",
  },
];

export default function Features() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div key={item.title}>
              <div
                aria-hidden="true"
                className="mb-4 h-1 w-10 rounded-full bg-accent"
              />
              <h3 className="text-lg font-semibold normal-case tracking-normal">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
