import HeroSection from "@/components/home/HeroSection";
import VehiclesSection from "@/components/home/VehiclesSection";
import StatsSection from "@/components/home/StatsSection";
import WhyKamaSection from "@/components/home/WhyKamaSection";
import BrandsSection from "@/components/home/BrandsSection";
import FabricationSection from "@/components/home/FabricationSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <VehiclesSection />
            <StatsSection />
            <WhyKamaSection />
            <BrandsSection />
            <FabricationSection />
            <CTASection />
        </>
    );
}
