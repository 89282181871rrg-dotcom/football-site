import { CONTACTS } from "@/lib/contacts";

export default function Footer() {
  return (
    <footer id="contacts" className="border-t border-white/10 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src="/catalog/logo.webp"
                alt=""
                width={34}
                height={34}
                className="h-8 w-8 bg-white object-contain p-0.5"
              />
              <span className="title text-lg">Futbolki Russia</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Всё для футбола: бутсы, шиповки, сороконожки, вратарские перчатки
              и мячи. Nike, Adidas, Puma, Mizuno, New Balance.
            </p>
          </div>

          <div>
            <h2 className="label text-muted">Связаться</h2>
            <a
              href={CONTACTS.phoneHref}
              className="tnum display-md mt-3 block transition-colors duration-200 hover:text-volt"
            >
              {CONTACTS.phoneDisplay}
            </a>
            <p className="mt-2 text-sm text-muted">{CONTACTS.hours}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {[
                [CONTACTS.whatsapp, "WhatsApp"],
                [CONTACTS.instagram, "Instagram"],
              ].map(([href, label]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label flex min-h-11 items-center border border-line-strong px-4 font-bold transition-colors duration-200 hover:border-volt hover:text-volt"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={CONTACTS.emailHref}
              className="mt-4 block break-all text-sm text-muted transition-colors duration-200 hover:text-text"
            >
              {CONTACTS.email}
            </a>
          </div>

          <div>
            <h2 className="label text-muted">Разделы</h2>
            <ul className="mt-3">
              {[
                ["#catalog", "Каталог"],
                ["#sizes", "Таблица размеров"],
                ["#faq", "Доставка и обмен"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="flex min-h-11 items-center text-sm text-muted transition-colors duration-200 hover:text-volt"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-line pt-6 text-xs text-muted">
          © {new Date().getFullYear()} Futbolki Russia
        </p>
      </div>
    </footer>
  );
}
