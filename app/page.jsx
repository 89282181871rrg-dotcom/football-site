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

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Reveal>
          <Features />
        </Reveal>
        <Reveal>
          <Catalog />
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
