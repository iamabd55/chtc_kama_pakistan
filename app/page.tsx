import HeroSection from "@/components/home/HeroSection";
import VehiclesSection from "@/components/home/VehiclesSection";
import StatsSection from "@/components/home/StatsSection";
import WhyKamaSection from "@/components/home/WhyKamaSection";
import BrandsSection from "@/components/home/BrandsSection";
import FabricationSection from "@/components/home/FabricationSection";
import CTASection from "@/components/home/CTASection";
import { createClient } from "@/lib/supabase/server";
import { getStorageUrl } from "@/lib/supabase/storage";

export default async function HomePage() {
    const supabase = await createClient();

    // Dynamically list ALL files in images/hero/ — no code changes needed when adding/removing images
    const { data: heroFiles } = await supabase.storage
        .from("images")
        .list("hero", { sortBy: { column: "name", order: "asc" } });

    const heroSlides = (heroFiles ?? [])
        .filter((f) => !f.name.startsWith("."))  // exclude hidden/placeholder files
        .map((f) => ({
            src: getStorageUrl(`hero/${f.name}`),
            alt: `CHTC Kama — ${f.name.replace(/\.[^.]+$/, "").replace(/-/g, " ")}`,
        }));

    return (
        <>
            <HeroSection slides={heroSlides} />
            <VehiclesSection />
            <StatsSection />
            <WhyKamaSection />
            <BrandsSection />
            <FabricationSection />
            <CTASection />
        </>
    );
}

