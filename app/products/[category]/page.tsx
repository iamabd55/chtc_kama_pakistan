import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/supabase/types";
import CategoryProductGrid from "@/components/products/CategoryProductGrid";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { category: slug } = await params;
    const supabase = await createClient();

    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!category) return { title: "Category Not Found" };

    return {
        title: `${category.name} — Al Nasir Motors Pakistan`,
        description: category.description ?? `Browse our ${category.name} range.`,
    };
}

export default async function ProductCategoryPage({ params }: PageProps) {
    const { category: slug } = await params;
    const supabase = await createClient();

    const { data: categoryData } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!categoryData) notFound();
    const category = categoryData as Category;

    const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", category.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    const products = (productsData ?? []) as Product[];

    return (
        <>
            {/* Hero banner */}
            <section className="py-14 md:py-20 bg-kama-gradient relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container relative z-10">
                    <Link href="/products" className="inline-flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        All Products
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground tracking-tight mb-3">
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="text-primary-foreground/70 max-w-xl text-base md:text-lg leading-relaxed">
                                    {category.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="bg-white/15 backdrop-blur-sm text-primary-foreground font-display font-bold text-sm px-4 py-2 rounded-full">
                                {products.length} Vehicle{products.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="py-12 md:py-20">
                <div className="container">
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ChevronRight className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-foreground mb-3">Products Coming Soon</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                We&apos;re preparing our {category.name.toLowerCase()} catalog. Check back soon or contact us for immediate inquiries.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors">
                                Contact Us
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <CategoryProductGrid products={products} categorySlug={slug} />
                    )}
                </div>
            </section>
        </>
    );
}
