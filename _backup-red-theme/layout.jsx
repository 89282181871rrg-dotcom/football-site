import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata = {
  title: "Futbolki Russia — бутсы, шиповки, вратарские перчатки",
  description:
    "Футбольные бутсы, шиповки и сороконожки Nike, Adidas, Puma, Mizuno, New Balance. Вратарские перчатки из немецкого латекса, мячи. Размеры 36–45, отправка в день заказа, доставка по России.",
  openGraph: {
    title: "Futbolki Russia — бутсы, шиповки, вратарские перчатки",
    description:
      "Бутсы, шиповки, перчатки, мячи. Доставка по всей России.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${inter.variable} ${oswald.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent-strong focus:text-white focus:px-4 focus:py-3 focus:rounded-lg"
        >
          Перейти к содержимому
        </a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
