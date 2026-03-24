import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface GetQuotePageProps {
    searchParams?: Promise<{
        submitted?: string;
        error?: string;
        product?: string;
    }>;
}

export default async function GetQuotePage({ searchParams }: GetQuotePageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const isSubmitted = resolved?.submitted === "1";
    const hasError = resolved?.error === "1";
    const requestedProduct = resolved?.product?.trim() ?? "";
    const supabase = await createClient();

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
            <section className="py-20">
                <div className="container max-w-2xl">
                    <div className="bg-card border rounded-lg p-8">
                        {isSubmitted && (
                            <div className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                                Your quote request has been submitted. Our sales team will contact you shortly.
                            </div>
                        )}
                        {hasError && (
                            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                                We could not submit your quote request right now. Please try again.
                            </div>
                        )}
                        <form className="space-y-5" method="post" action="/api/inquiries/quote">
                            {requestedProduct && <input type="hidden" name="requested_product_slug" value={requestedProduct} />}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input name="full_name" type="text" placeholder="Full Name *" required className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                <input name="company_name" type="text" placeholder="Company Name" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input name="email" type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                <input name="phone" type="tel" placeholder="Phone *" required className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <select name="request_type" required className="w-full px-4 py-3 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="quote">
                                <option value="quote">Quote Request</option>
                                <option value="brochure">Brochure Request</option>
                            </select>
                            <select name="vehicle_category" required className="w-full px-4 py-3 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="">
                                <option value="" disabled>Vehicle Category *</option>
                                <option value="Mini Trucks">Mini Trucks</option>
                                <option value="Light Trucks">Light Trucks</option>
                                <option value="Dumper Trucks">Dumper Trucks</option>
                                <option value="EV Trucks">EV Trucks</option>
                                <option value="Buses">Buses</option>
                                <option value="Special Vehicles">Special Vehicles</option>
                            </select>
                            <select
                                name="selected_product_id"
                                className="w-full px-4 py-3 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                defaultValue={preselectedProductId}
                            >
                                <option value="">Select Product (Optional)</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <input name="city" type="text" placeholder="City / Province *" required className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                            <textarea name="requirements" rows={4} placeholder="Additional Requirements" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors flex items-center justify-center gap-2">
                                Submit Request
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
