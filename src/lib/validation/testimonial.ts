export const safeTrim = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

export function validateTestimonialPayload(body: {
    customer_name?: unknown;
    customer_title?: unknown;
    company?: unknown;
    content?: unknown;
    rating?: unknown;
}) {
    const customer_name = safeTrim(body.customer_name);
    const customer_title = safeTrim(body.customer_title) || null;
    const company = safeTrim(body.company) || null;
    const content = safeTrim(body.content);

    let rating: number | null = null;
    if (body.rating !== undefined && body.rating !== null && body.rating !== "") {
        const parsed = Number(body.rating);
        if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
            return { ok: false as const, error: "Rating must be between 1 and 5." };
        }
        rating = parsed;
    }

    if (!customer_name || customer_name.length < 2) {
        return { ok: false as const, error: "Please enter your name." };
    }

    if (content.length < 20) {
        return { ok: false as const, error: "Please share a bit more detail (at least 20 characters)." };
    }

    if (content.length > 2000) {
        return { ok: false as const, error: "Review is too long (max 2000 characters)." };
    }

    return {
        ok: true as const,
        data: { customer_name, customer_title, company, content, rating },
    };
}
