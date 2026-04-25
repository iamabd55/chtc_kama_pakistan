import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import VehiclesSection from "@/components/home/VehiclesSection";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import { getStorageUrl } from "@/lib/supabase/storage";
import type { Dealer, SiteSettings } from "@/lib/supabase/types";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

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

    // Fire all three independent network requests simultaneously to reduce TTFB
    const [settings, { data: heroFiles }, { data: dealerRows }] = await Promise.all([
        getPublicSiteSettings(),
        supabase.storage
            .from("images")
            .list("hero", { sortBy: { column: "name", order: "asc" } }),
        supabase
            .from("dealers")
            .select("name, city, province, lat, lng, google_maps_url")
            .eq("is_active", true)
            .order("city", { ascending: true })
    ]);

    const configuredSlides = (settings?.hero_slides ?? []) as HeroSlideSettingsItem[];
    const heroSlidesFromSettings = configuredSlides
        .filter((slide) => Boolean(slide?.imageUrl))
        .map((slide, idx) => ({
            src: resolveHeroImage(String(slide.imageUrl)),
            alt: slide.title || `Al Nasir Motors Hero Slide ${idx + 1}`,
        }));

    const heroSlidesFromStorage = (heroFiles ?? [])
        .filter((f) => !f.name.startsWith("."))  // exclude hidden/placeholder files
        .map((f) => ({
            src: getStorageUrl(`hero/${f.name}`),
            alt: `Al Nasir Motors — ${f.name.replace(/\.[^.]+$/, "").replace(/-/g, " ")}`,
        }));

    const heroSlides = heroSlidesFromSettings.length > 0 ? heroSlidesFromSettings : heroSlidesFromStorage;

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

