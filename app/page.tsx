import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import VehiclesSection from "@/components/home/VehiclesSection";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import { getStorageUrl } from "@/lib/supabase/storage";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import { fetchApprovedTestimonials } from "@/lib/testimonials";

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

const TestimonialsSection = dynamic(() => import("@/components/testimonials/TestimonialsSection"), {
    loading: () => <div className="h-[480px] bg-background" aria-hidden="true" />,
});

type HeroSlideSettingsItem = {
    imageUrl?: string;
    title?: string;
};

const resolveHeroImage = (value: string) => {
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
        // Auto-apply Cloudinary optimization if it's a Cloudinary URL
        if (value.includes("res.cloudinary.com") && !value.includes("/f_auto") && !value.includes("/q_auto")) {
            return value.replace("/upload/", "/upload/f_auto,q_auto/");
        }
        return value;
    }
    return getStorageUrl(value);
};

export default async function HomePage() {
    const supabase = createPublicServerClient();

    const [settings, { data: heroFiles }, testimonials] = await Promise.all([
        getPublicSiteSettings(),
        supabase.storage
            .from("images")
            .list("hero", { sortBy: { column: "name", order: "asc" } }),
        fetchApprovedTestimonials(supabase, 3),
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

    return (
        <>
            <HeroSection slides={heroSlides} />
            <VehiclesSection />
            <StatsSection />
            <WhyKamaSection />
            <BrandsSection />
            <FabricationSection />
            <CTASection />
            {testimonials.length > 0 && (
                <TestimonialsSection items={testimonials} variant="home" />
            )}
        </>
    );
}

