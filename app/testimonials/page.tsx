import { createPublicServerClient } from "@/lib/supabase/publicServer";
import { fetchApprovedTestimonials } from "@/lib/testimonials";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import TestimonialSubmitForm from "@/components/testimonials/TestimonialSubmitForm";

export const metadata = {
    title: "Customer Testimonials",
    description:
        "Read reviews from fleet operators and business owners, and share your experience with Al Nasir Motors Pakistan.",
};

interface TestimonialsPageProps {
    searchParams?: Promise<{
        success?: string;
        error?: string;
    }>;
}

const errorMessages: Record<string, string> = {
    submit: "Unable to submit your review. Please try again.",
    server: "Something went wrong. Please try again later.",
};

export default async function TestimonialsPage({ searchParams }: TestimonialsPageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const initialSuccess = resolved?.success === "1";
    const errorKey = resolved?.error?.trim();
    const initialError =
        errorKey && errorKey !== "1"
            ? errorMessages[errorKey] || decodeURIComponent(errorKey)
            : null;

    const supabase = createPublicServerClient();
    const testimonials = await fetchApprovedTestimonials(supabase);

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <p className="mb-3 text-[11px] font-display font-semibold uppercase tracking-[0.28em] text-white/55">
                        Customer stories
                    </p>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
                        Testimonials
                    </h1>
                    <p className="text-primary-foreground/75 max-w-2xl mx-auto text-base">
                        Real feedback from businesses that rely on our commercial vehicles and nationwide support.
                    </p>
                </div>
            </section>

            <TestimonialsSection items={testimonials} showViewAll={false} className="pt-12 pb-8" />

            <section id="share-review" className="bg-muted/40 py-16 md:py-20 border-t scroll-mt-24">
                <div className="container max-w-2xl">
                    <TestimonialSubmitForm
                        initialSuccess={initialSuccess}
                        initialError={initialError}
                    />
                </div>
            </section>
        </>
    );
}
