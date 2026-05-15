import { ArrowRight, ClipboardList, FileText } from "lucide-react";
import { createPublicServerClient } from "@/lib/supabase/publicServer";

const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const timelineSteps = [
    { dot: "bg-blue-600", title: "Received", desc: "submitted successfully" },
    { dot: "bg-amber-500", title: "In Review", desc: "sales team is checking details" },
    { dot: "bg-emerald-500", title: "Responded", desc: "quote sent back to you" },
] as const;

export const revalidate = 60;

interface GetQuotePageProps {
    searchParams?: Promise<{
        submitted?: string;
        error?: string;
        product?: string;
        ref?: string;
    }>;
}

export default async function GetQuotePage({ searchParams }: GetQuotePageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const isSubmitted = resolved?.submitted === "1";
    const errorCode = resolved?.error?.trim() ?? "";
    const inquiryReference = resolved?.ref?.trim() ?? "";
    const hasError = Boolean(errorCode);
    const errorMessage = (() => {
        switch (errorCode) {
            case "missing_fields":
                return "Please fill all required fields before submitting.";
            case "invalid_phone":
                return "Please enter a valid Pakistani mobile number (e.g., 03XXXXXXXXX or +92XXXXXXXXXX).";
            case "invalid_email":
                return "Please enter a valid email address.";
            case "supabase":
                return "We could not save your request right now. Please try again in a moment.";
            case "server":
                return "A server error occurred while submitting your request. Please try again.";
            default:
                return "We could not submit your quote request right now. Please try again.";
        }
    })();
    const requestedProduct = resolved?.product?.trim() ?? "";
    const supabase = createPublicServerClient();

    const { data: productsData } = await supabase
        .from("products")
        .select("id, name, slug")
        .eq("is_active", true)
        .neq("brand", "joylong")
        .order("name", { ascending: true });

    const products = (productsData ?? []) as Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    const preselectedProductId =
        products.find((product) => product.slug === requestedProduct)?.id ?? "";

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Get a Quote</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto mb-3">Fill out the form below and our sales team will contact you with a personalized quote.</p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Driven by Al Nasir Motors
                    </p>
                </div>
            </section>

            <section className="bg-slate-100/90 py-12 md:py-16">
                {/* Wider container so both cards breathe */}
                <div className="container max-w-[1400px]">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-8">

                        {/* ── Left: Track & Submit sidebar ── fixed width on desktop */}
                        <aside className="flex w-full shrink-0 flex-col gap-3 rounded-xl border border-slate-200/90 bg-white p-7 shadow-[0_4px_24px_rgba(15,23,42,0.07)] md:p-8 lg:w-[360px]">
                            <div className="flex items-center gap-2.5">
                                <ClipboardList className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                    Track & Submit
                                </span>
                            </div>
                            <h2 className="text-xl font-bold leading-snug text-slate-900 md:text-2xl">
                                Request a quote and track it later with one reference.
                            </h2>
                            <p className="text-sm leading-relaxed text-slate-600 md:text-[15px]">
                                Every submitted quote gets a public reference like{" "}
                                <span className="font-semibold text-slate-900">INQ-A1B2C3D4</span>. You'll see it right
                                away, receive it by email, and can revisit status anytime without logging in.
                            </p>
                            <div className="hidden lg:block rounded-xl border border-slate-200/80 bg-slate-50 p-5">
                                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                    Status flow
                                </p>
                                <ul className="space-y-0">
                                    {timelineSteps.map((step, i) => (
                                        <li key={step.title} className="flex gap-3">
                                            <div className="flex flex-col items-center pt-1">
                                                <span
                                                    className={`h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-slate-50 ${step.dot}`}
                                                />
                                                {i < timelineSteps.length - 1 ? (
                                                    <div className="my-0.5 h-5 w-px shrink-0 bg-slate-200" aria-hidden />
                                                ) : null}
                                            </div>
                                            <div className={`${i < timelineSteps.length - 1 ? "pb-4" : ""} min-w-0 pt-0.5`}>
                                                <p className="text-sm text-slate-800">
                                                    <span className="font-semibold text-slate-900">{step.title}</span>
                                                    <span className="text-slate-600"> – {step.desc}</span>
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <a
                                href="/track-inquiry"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-white py-3 text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary/5"
                            >
                                Open Tracker
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </aside>

                        {/* ── Right: Quote Request form ── takes all remaining width */}
                        <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-xl border border-slate-200/90 bg-white p-7 shadow-[0_4px_24px_rgba(15,23,42,0.07)] md:p-8">
                            {isSubmitted && (
                                <div className="mb-5 rounded-xl border border-green-500/30 bg-green-50 px-4 py-3 text-sm text-green-900">
                                    <p className="font-semibold">Your quote request has been submitted.</p>
                                    {inquiryReference && (
                                        <span className="mt-1 block font-semibold">Reference: {inquiryReference}</span>
                                    )}
                                    <a
                                        href={`/track-inquiry${inquiryReference ? `?ref=${encodeURIComponent(inquiryReference)}` : ""}`}
                                        className="mt-2 inline-flex text-xs font-semibold uppercase tracking-wider text-green-800 underline underline-offset-4"
                                    >
                                        Open tracker
                                    </a>
                                </div>
                            )}
                            {hasError && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="mb-3 shrink-0">
                                <div className="mb-3 flex items-center gap-2.5">
                                    <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                        Quote Request
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Tell us what you need</h2>
                                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
                                    Fill in the request below and we&apos;ll send pricing and availability to your email
                                    and phone.
                                </p>
                            </div>

                            <form className="flex flex-col gap-3" method="post" action="/api/inquiries/quote">
                                {requestedProduct && (
                                    <input type="hidden" name="requested_product_slug" value={requestedProduct} />
                                )}

                                {/* Row 1: Name + Company + Email */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <input
                                        name="full_name"
                                        type="text"
                                        placeholder="Full Name *"
                                        required
                                        className={fieldClass}
                                    />
                                    <input
                                        name="company_name"
                                        type="text"
                                        placeholder="Company Name"
                                        className={fieldClass}
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email *"
                                        required
                                        className={fieldClass}
                                    />
                                </div>

                                {/* Row 2: Phone + City + Request Type */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone *"
                                        required
                                        className={fieldClass}
                                    />
                                    <input
                                        name="city"
                                        type="text"
                                        placeholder="City / Province *"
                                        required
                                        className={fieldClass}
                                    />
                                    <select
                                        name="request_type"
                                        required
                                        className={fieldClass}
                                        defaultValue="quote"
                                    >
                                        <option value="quote">Quote Request *</option>
                                        <option value="brochure">Brochure Request *</option>
                                    </select>
                                </div>

                                {/* Row 3: Vehicle Category + Product */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <select
                                        name="vehicle_category"
                                        required
                                        className={fieldClass}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Vehicle Category *
                                        </option>
                                        <option value="Mini Trucks">Mini Trucks</option>
                                        <option value="Light Trucks">Light Trucks</option>
                                        <option value="Dumper Trucks">Dumper Trucks</option>
                                        <option value="EV Trucks">EV Trucks</option>
                                        <option value="Buses">Buses</option>
                                        <option value="Special Vehicles">Special Vehicles</option>
                                    </select>
                                    <select
                                        name="selected_product_id"
                                        className={fieldClass}
                                        defaultValue={preselectedProductId}
                                    >
                                        <option value="">Select Product (Optional)</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Row 4: Textarea — shorter now that fields are compressed above */}
                                <textarea
                                    name="requirements"
                                    rows={2}
                                    placeholder="Additional requirements"
                                    className={`${fieldClass} resize-y min-h-[60px]`}
                                />

                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                                >
                                    Submit Request
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}