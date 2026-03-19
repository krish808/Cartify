import React from "react";
import HeroBanner from "../components/HeroBanner";
import { Section } from "@cartify/ui";
import CategoryRow from "../components/CategoryRow";
import DealOfTheDay from "../components/DealOfTheDay";
import PromoBanners from "../components/PromoBanners";

export default function Home() {
  return (
    <Section className="bg-[#f1f3f6] min-h-screen py-3">
      <HeroBanner />
      <CategoryRow />
      <DealOfTheDay />
      <PromoBanners />
      {/* <ProductGrid />
      <ShopByPrice />
      <BrandSpotlight />
      <RecentlyViewed /> */}
    </Section>
  );
}
