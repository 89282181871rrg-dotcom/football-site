"use client";

import { CONTACTS } from "@/lib/contacts";
import { useLocale } from "@/lib/locale-context";
import { RATES_UPDATED } from "@/lib/currency";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer id="contacts" className="border-t border-white/10 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src="/catalog/logo.webp"
                alt=""
                width={34}
                height={34}
                className="h-8 w-8 rounded-lg bg-white object-contain p-0.5"
              />
              <span className="title text-lg">Futbolki Russia</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t("foot.about")}</p>
          </div>

          <div>
            <h2 className="label text-muted">{t("foot.contact")}</h2>
            <a
              href={CONTACTS.phoneHref}
              className="tnum display-md mt-3 block transition-colors duration-200 hover:text-volt"
            >
              {CONTACTS.phoneDisplay}
            </a>
            <p className="mt-2 text-sm text-muted">{t("foot.hours")}</p>

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
                    className="label flex min-h-11 items-center rounded-xl border border-line-strong px-4 font-bold transition-colors duration-200 hover:border-volt hover:text-volt"
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
            <h2 className="label text-muted">{t("foot.sections")}</h2>
            <ul className="mt-3">
              {[
                ["#catalog", t("nav.catalog")],
                ["#sizes", t("foot.sizes")],
                ["#faq", t("foot.delivery")],
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

        <p className="mt-10 border-t border-line pt-6 text-xs text-muted sm:mt-14">
          © {new Date().getFullYear()} Futbolki Russia · {t("sw.rates")}: {RATES_UPDATED}
        </p>
      </div>
    </footer>
  );
}
