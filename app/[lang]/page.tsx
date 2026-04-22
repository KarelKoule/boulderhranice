import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/getDictionary";
import { isLocale } from "@/lib/isLocale";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HowToSection from "./components/HowToSection";
import WallGallerySection from "./components/WallGallerySection";
import Footer from "./components/Footer";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function Page({ params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <>
      <Header dict={dict.header} />
      <main>
        <HeroSection dict={dict.hero} />
        <HowToSection dict={dict.howTo} />
        <WallGallerySection dict={dict.gallery} />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
