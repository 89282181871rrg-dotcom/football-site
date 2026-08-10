const ROWS = [
  ["39", "38–39", "24.5", "6"],
  ["40", "39–40", "25.0", "6.5"],
  ["41", "40–41", "26.0", "7.5"],
  ["42", "41–42", "26.5", "8"],
  ["43", "42–43", "27.5", "9"],
  ["44", "43–44", "28.0", "9.5"],
  ["45", "44–45", "29.0", "10.5"],
  ["46", "45–46", "29.5", "11"],
];

export default function SizeGuide() {
  return (
    <section id="sizes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-3xl font-bold sm:text-4xl">Как выбрать размер</h2>
      <p className="mt-2 max-w-2xl text-muted">
        Футбольная обувь садится плотнее обычных кроссовок — так и должно быть,
        стопа не должна болтаться. Измерьте длину стопы в сантиметрах и найдите
        её в таблице.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <caption className="sr-only">
            Соответствие европейских размеров российским и длине стопы
          </caption>
          <thead>
            <tr className="bg-surface">
              {["Размер EU", "Российский", "Длина стопы, см", "UK"].map((h) => (
                <th key={h} scope="col" className="px-5 py-3 text-sm font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, idx) => (
              <tr key={row[0]} className={idx % 2 ? "bg-surface/40" : undefined}>
                <th scope="row" className="tnum px-5 py-3 text-sm font-bold">
                  {row[0]}
                </th>
                {row.slice(1).map((cell, i) => (
                  <td key={i} className="tnum px-5 py-3 text-sm text-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          [
            "Как измерить",
            "Встаньте пяткой к стене на лист бумаги, отметьте край большого пальца, измерьте линейкой.",
          ],
          [
            "Между размерами",
            "Берите больший. Сильно тесная обувь на поле — гарантированные мозоли.",
          ],
          [
            "Не уверены",
            "Напишите длину стопы в комментарии к заказу — подберём и перезвоним.",
          ],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="text-base font-semibold normal-case tracking-normal">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
