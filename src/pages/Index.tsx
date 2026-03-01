import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import VehiclesSection from "@/components/home/VehiclesSection";
import StatsSection from "@/components/home/StatsSection";
import WhyKamaSection from "@/components/home/WhyKamaSection";
import BrandsSection from "@/components/home/BrandsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <VehiclesSection />
      <StatsSection />
      <WhyKamaSection />
      <BrandsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
