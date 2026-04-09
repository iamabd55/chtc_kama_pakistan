import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import VehiclesSection from "@/components/home/VehiclesSection";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import { getStorageUrl } from "@/lib/supabase/storage";
import type { Dealer, SiteSettings } from "@/lib/supabase/types";

export const revalidate = 300;

const StatsSection = dynamic(() => import("@/components/home/StatsSection"), {
    loading: () => <div className="h-[320px] bg-[#0364CE]" aria-hidden="true" />,
});

const WhyKamaSection = dynamic(() => import("@/components/home/WhyKamaSection"), {
    loading: () => <div className="h-[520px] bg-muted/50" aria-hidden="true" />,
});

const BrandsSection = dynamic(() => import("@/components/home/BrandsSection"), {
    loading: () => <div className="h-[640px] bg-background" aria-hidden="true" />,
});

const FabricationSection = dynamic(() => import("@/components/home/FabricationSection"), {
    loading: () => <div className="h-[620px] bg-muted/30" aria-hidden="true" />,
});

const CTASection = dynamic(() => import("@/components/home/CTASection"), {
    loading: () => <div className="h-[360px] bg-[#0364CE]" aria-hidden="true" />,
});

const DealerSection = dynamic(() => import("@/components/home/DealerSection"), {
    loading: () => <div className="h-[760px] bg-background" aria-hidden="true" />,
});

type HeroSlideSettingsItem = {
    imageUrl?: string;
    title?: string;
};

const resolveHeroImage = (value: string) => {
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
        return value;
    }
    return getStorageUrl(value);
};

export default async function HomePage() {
    const supabase = createPublicServerClient();

    const { data: siteSettingsData } = await supabase
        .from("site_settings")
        .select("hero_slides")
        .eq("id", 1)
        .single();

    const settings = siteSettingsData as Pick<SiteSettings, "hero_slides"> | null;
    const configuredSlides = (settings?.hero_slides ?? []) as HeroSlideSettingsItem[];
    const heroSlidesFromSettings = configuredSlides
        .filter((slide) => Boolean(slide?.imageUrl))
        .map((slide, idx) => ({
            src: resolveHeroImage(String(slide.imageUrl)),
            alt: slide.title || `Al Nasir Motors Hero Slide ${idx + 1}`,
        }));

    // Dynamically list ALL files in images/hero/ — no code changes needed when adding/removing images
    const { data: heroFiles } = await supabase.storage
        .from("images")
        .list("hero", { sortBy: { column: "name", order: "asc" } });

    const heroSlidesFromStorage = (heroFiles ?? [])
        .filter((f) => !f.name.startsWith("."))  // exclude hidden/placeholder files
        .map((f) => ({
            src: getStorageUrl(`hero/${f.name}`),
            alt: `Al Nasir Motors — ${f.name.replace(/\.[^.]+$/, "").replace(/-/g, " ")}`,
        }));

    const heroSlides = heroSlidesFromSettings.length > 0 ? heroSlidesFromSettings : heroSlidesFromStorage;

    const { data: dealerRows } = await supabase
        .from("dealers")
        .select("name, city, province, lat, lng, google_maps_url")
        .eq("is_active", true)
        .order("city", { ascending: true });

    const dealers = (dealerRows ?? []) as Pick<Dealer, "name" | "city" | "province" | "lat" | "lng" | "google_maps_url">[];

    return (
        <>
            <HeroSection slides={heroSlides} />
            <VehiclesSection />
            <StatsSection />
            <WhyKamaSection />
            <BrandsSection />
            <FabricationSection />
            <CTASection />
            <DealerSection dealers={dealers} />
        </>
    );
}

