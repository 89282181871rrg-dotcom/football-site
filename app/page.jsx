import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import Catalog from "@/components/Catalog";
import SizeGuide from "@/components/SizeGuide";
import Faq from "@/components/Faq";
import Review from "@/components/Review";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Reveal from "@/components/Reveal";
import { getAllProducts } from "@/lib/catalog";

// Каталог может пополняться через /admin в любой момент, поэтому страница
// собирается заново на каждый заход, а не кэшируется целиком.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getAllProducts();

  return (
    <>
      <Header />
      <main id="main">
        <Hero products={products} />
        <Marquee />
        <Reveal>
          <Features />
        </Reveal>
        <Reveal>
          <Catalog products={products} />
        </Reveal>
        <Marquee />
        <Reveal>
          <Review />
        </Reveal>
        <Reveal>
          <SizeGuide />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
      </main>
      <Reveal>
        <Footer />
      </Reveal>
      <CartDrawer />
    </>
  );
}
