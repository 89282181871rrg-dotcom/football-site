import { CONTACTS } from "@/lib/contacts";

export default function Footer() {
  return (
    <footer id="contacts" className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="display text-xl font-bold">
              Futbolki Russia<span className="text-accent">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Всё для футбола: бутсы, шиповки, сороконожки, вратарские
              перчатки и мячи. Nike, Adidas, Puma, Mizuno, New Balance.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Связаться</h2>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <a
                  href={CONTACTS.phoneHref}
                  className="tnum inline-flex min-h-11 items-center text-base font-semibold hover:text-accent"
                >
                  {CONTACTS.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.whatsapp}
                  className="inline-flex min-h-11 items-center text-muted hover:text-ink"
                >
                  Написать в WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.emailHref}
                  className="inline-flex min-h-11 items-center break-all text-muted hover:text-ink"
                >
                  {CONTACTS.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex min-h-11 items-center text-muted hover:text-ink"
                >
                  Instagram
                </a>
              </li>
            </ul>
            <p className="mt-2 text-xs text-muted">{CONTACTS.hours}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Покупателям</h2>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <a
                  href="#catalog"
                  className="inline-flex min-h-11 items-center text-muted hover:text-ink"
                >
                  Каталог
                </a>
              </li>
              <li>
                <a
                  href="#sizes"
                  className="inline-flex min-h-11 items-center text-muted hover:text-ink"
                >
                  Таблица размеров
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="inline-flex min-h-11 items-center text-muted hover:text-ink"
                >
                  Доставка и обмен
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-xs text-muted">
          © {new Date().getFullYear()} Futbolki Russia
        </p>
      </div>
    </footer>
  );
}
