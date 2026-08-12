import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { LocaleProvider } from "@/lib/locale-context";
import VideoBackground from "@/components/VideoBackground";
import SkipLink from "@/components/SkipLink";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

/**
 * Заголовок и описание для поиска и мессенджеров.
 * Они одни на весь сайт и не переключаются вместе с языком: страница здесь
 * одна, а Next умеет менять метаданные только по адресу. Поэтому написаны
 * на двух языках сразу — так находят и по-русски, и по-английски.
 */
export const metadata = {
  title: "Futbolki Russia — бутсы, шиповки, перчатки · Football boots shop",
  description:
    "Футбольные бутсы, шиповки и сороконожки Nike, Adidas, Puma, Mizuno, New Balance. Вратарские перчатки из немецкого латекса, мячи. Размеры 36–45, отправка в день заказа, доставка по всему миру. Football boots, turf shoes, goalkeeper gloves and balls — worldwide shipping.",
  openGraph: {
    title: "Futbolki Russia — всё для футбола · Everything for football",
    description:
      "Бутсы, шиповки, перчатки, мячи. Доставка по всему миру. Boots, turf shoes, gloves and balls — worldwide shipping.",
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["en_US", "de_DE", "es_ES", "fr_FR", "it_IT", "pt_PT", "tr_TR", "ar_AE"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d10",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${inter.variable} ${oswald.variable}`}>
      <body className="overflow-x-hidden">
        <VideoBackground />
        <LocaleProvider>
          <SkipLink />
          <CartProvider>{children}</CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
