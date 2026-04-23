import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/getDictionary";
import { isLocale } from "@/lib/isLocale";
import { createServices } from "@/lib/container";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HowToSection from "./components/HowToSection";
import WallGallerySection from "./components/WallGallerySection";
import BouldersSection from "./components/BouldersSection";
import Footer from "./components/Footer";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function Page({ params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const [dict, { boulderService, authService }] = await Promise.all([
    getDictionary(lang),
    createServices(),
  ]);

  const [boulders, user] = await Promise.all([
    boulderService.listAll(),
    authService.getCurrentUser(),
  ]);

  const boulderIds = boulders.map((b) => b.id);

  const [userRatings, gradeDistributions, userGrades] = await Promise.all([
    user ? boulderService.getUserRatings(user.id, boulderIds) : {},
    Promise.all(
      boulders.map(async (b) => [b.id, await boulderService.getGradeDistribution(b.id)] as const),
    ).then(Object.fromEntries),
    user ? boulderService.getUserGrades(user.id, boulderIds) : {},
  ]);

  return (
    <>
      <Header dict={dict.header} user={user} authDict={dict.auth} />
      <main>
        <HeroSection dict={dict.hero} />
        <HowToSection dict={dict.howTo} />
        <WallGallerySection dict={dict.gallery} />
        <BouldersSection
          boulders={boulders}
          dict={dict.boulders}
          authDict={dict.auth}
          userRatings={userRatings}
          gradeDistributions={gradeDistributions}
          userGrades={userGrades}
          user={user}
        />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
