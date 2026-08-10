const WORDS = [
  "NIKE",
  "ADIDAS",
  "PUMA",
  "MIZUNO",
  "NEW BALANCE",
  "БУТСЫ",
  "ШИПОВКИ",
  "СОРОКОНОЖКИ",
  "ПЕРЧАТКИ",
  "МЯЧИ 1+1",
  "ДОСТАВКА ПО РОССИИ",
];

export default function Marquee() {
  // Лента дублируется — сдвиг на -50% выглядит бесшовным
  const line = [...WORDS, ...WORDS];

  return (
    <div className="marquee overflow-hidden bg-volt py-3" aria-hidden="true">
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {line.map((w, i) => (
          <span key={i} className="title flex items-center text-lg text-ink">
            <span className="px-5">{w}</span>
            <span className="opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
