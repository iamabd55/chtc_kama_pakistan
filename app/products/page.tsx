import { createPublicServerClient } from "@/lib/supabase/publicServer";
import type { Category, Product } from "@/lib/supabase/types";
import ProductsExplorer from "@/components/products/ProductsExplorer";

export const revalidate = 60;

export const metadata = {
    title: "Products — Al Nasir Motors Pakistan",
    description: "Browse our full range of commercial vehicles — trucks, buses, EVs and more.",
};

export default async function ProductsPage() {
    const supabase = createPublicServerClient();

    const [{ data: categories }, { data: products }] = await Promise.all([
        supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true }),
        supabase
            .from("products")
            .select("*, category:categories(*)")
            .eq("is_active", true)
            .neq("brand", "joylong")
            .order("created_at", { ascending: false }),
    ]);

    const cats = (categories ?? []) as Category[];
    const prods = (products ?? []) as (Product & { category?: Category })[];

    return (
        <>
            {/* Hero */}
            <section className="py-14 md:py-20 bg-kama-gradient relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container text-center relative z-10">
                    <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Full Lineup</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4 tracking-tight">
                        Our Products
                    </h1>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4">
                            Driven by Al Nasir Motors
                    </p>
                    <p className="text-primary-foreground/70 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Explore our complete range of commercial vehicles — from nimble mini trucks to
                        heavy-duty dumpers, electric vehicles, and passenger buses.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-8 text-primary-foreground/60 text-sm">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {cats.length} Categories
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {prods.length} Vehicles
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {new Set(prods.map((p) => p.brand)).size} Brands
                        </span>
                    </div>
                </div>
            </section>

            {/* Products explorer */}
            <ProductsExplorer categories={cats} products={prods} />
        </>
    );
}

