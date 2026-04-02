import HeroBanner from "../components/home/HeroBanner";
import { Section } from "@cartify/ui";
import CategoryRow from "../components/home/CategoryRow.jsx";
import DealOfTheDay from "../components/home/DealOfTheDay.jsx";
import PromoBanners from "../components/home/PromoBanners.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import BrandSpotlight from "../components/home/BrandSpotlight.jsx";
import ShopByPrice from "../components/home/ShopByPrice.jsx";
import RecentlyViewed from "../components/home/RecentlyViewed.jsx";

export default function Home() {
  return (
    <Section className="bg-[#f1f3f6] min-h-screen py-3">
      <HeroBanner />
      <CategoryRow />
      <DealOfTheDay />
      <PromoBanners />
      <ProductGrid />
      <ShopByPrice />
      <BrandSpotlight />
      <RecentlyViewed />
    </Section>
  );
}
