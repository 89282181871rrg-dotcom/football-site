const ROWS = [
  ["39", "38–39", "24.5", "6"],
  ["40", "39–40", "25.0", "6.5"],
  ["41", "40–41", "26.0", "7.5"],
  ["42", "41–42", "26.5", "8"],
  ["43", "42–43", "27.5", "9"],
  ["44", "43–44", "28.0", "9.5"],
  ["45", "44–45", "29.0", "10.5"],
];

const TIPS = [
  [
    "Как измерить",
    "Встаньте пяткой к стене на лист бумаги, отметьте край большого пальца, измерьте линейкой.",
  ],
  [
    "Между размерами",
    "Берите больший. Тесная обувь на поле — это мозоли уже через полматча.",
  ],
  [
    "Не уверены",
    "Напишите длину стопы в комментарии к заказу — подберём и перезвоним.",
  ],
];

export default function SizeGuide() {
  return (
    <section id="sizes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 className="display-md">Как выбрать размер</h2>
        <p className="max-w-sm text-sm text-muted">
          Футбольная обувь садится плотнее обычных кроссовок — так и должно
          быть, стопа не должна болтаться.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left">
            <caption className="sr-only">
              Соответствие европейских размеров российским и длине стопы
            </caption>
            <thead>
              <tr className="bg-surface/78 backdrop-blur-sm">
                {["EU", "Российский", "Длина стопы, см", "UK"].map((h) => (
                  <th key={h} scope="col" className="label px-4 py-3 text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row[0]} className={i % 2 ? "bg-surface/25" : undefined}>
                  <th
                    scope="row"
                    className="tnum title px-4 py-3 text-left text-lg text-volt"
                  >
                    {row[0]}
                  </th>
                  {row.slice(1).map((cell, j) => (
                    <td key={j} className="tnum px-4 py-3 text-sm text-muted">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          {TIPS.map(([title, text]) => (
            <div key={title} className="border border-white/5 bg-ink/78 p-5 backdrop-blur-md">
              <h3 className="title text-base">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
