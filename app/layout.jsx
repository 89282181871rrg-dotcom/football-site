import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import VideoBackground from "@/components/VideoBackground";

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

export const metadata = {
  title: "Futbolki Russia — бутсы, шиповки, вратарские перчатки",
  description:
    "Футбольные бутсы, шиповки и сороконожки Nike, Adidas, Puma, Mizuno, New Balance. Вратарские перчатки из немецкого латекса, мячи. Размеры 36–45, отправка в день заказа, доставка по России.",
  openGraph: {
    title: "Futbolki Russia — всё для футбола",
    description: "Бутсы, шиповки, перчатки, мячи. Доставка по всей России.",
    type: "website",
    locale: "ru_RU",
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
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-volt focus:px-4 focus:py-3 focus:text-ink"
        >
          Перейти к содержимому
        </a>
        <VideoBackground />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
