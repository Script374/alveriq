import Header from "../components/layout/Header";
import Hero from "../components/home/hero";
import MadeInIndia from "../components/home/MadeInIndia";
import GenderSplit from "../components/home/GenderSplit";
import Categories from "../components/home/Categories";
import BestSeller from "../components/home/BestSeller";
import NewArrival from "../components/home/NewArrival";
import Newsletter from "../components/home/Newsletter";
import Footer from "../components/layout/Footer";
import FeaturedBanner from "../components/home/FeaturedBanner";
import TrustSection from "../components/home/TrustSection";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <MadeInIndia />
      <GenderSplit />
      <Categories />
      <BestSeller />
      <FeaturedBanner />
      <TrustSection />
      <NewArrival />
      <Newsletter />
      <Footer />

    </>
  );
}