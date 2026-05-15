import type { SupabaseClient } from "@supabase/supabase-js";
import type { Testimonial } from "@/lib/supabase/types";

type TestimonialClient = Pick<SupabaseClient, "from">;

/** Fetch approved testimonials; falls back if display_order column is unavailable. */
export async function fetchApprovedTestimonials(
    supabase: TestimonialClient,
    limit?: number
) {
    const buildQuery = (orderByDisplay: boolean) => {
        let query = supabase
            .from("testimonials")
            .select("*")
            .eq("status", "approved")
            .eq("is_active", true);

        if (orderByDisplay) {
            query = query
                .order("display_order", { ascending: true })
                .order("created_at", { ascending: false });
        } else {
            query = query.order("created_at", { ascending: false });
        }

        if (limit !== undefined) {
            query = query.limit(limit);
        }

        return query;
    };

    const primary = await buildQuery(true);
    if (!primary.error) {
        return (primary.data as Testimonial[]) || [];
    }

    if (!primary.error.message.toLowerCase().includes("display_order")) {
        console.error("[testimonials] fetch error:", primary.error);
        return [];
    }

    const fallback = await buildQuery(false);
    if (fallback.error) {
        console.error("[testimonials] fetch fallback error:", fallback.error);
        return [];
    }

    return (fallback.data as Testimonial[]) || [];
}

/** Next display_order = max(existing) + 1 */
export async function getNextTestimonialDisplayOrder(supabase: TestimonialClient) {
    const { data, error } = await supabase
        .from("testimonials")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        if (error.message.toLowerCase().includes("display_order")) {
            return 1;
        }
        throw error;
    }

    const current = data?.display_order;
    return typeof current === "number" && current > 0 ? current + 1 : 1;
}
