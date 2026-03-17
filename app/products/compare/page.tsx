import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/supabase/types";

interface ComparePageProps {
    searchParams?: Promise<{
        ids?: string;
    }>;
}

const formatLabel = (value: string) => value.replace(/_/g, " ");

export default async function ComparePage({ searchParams }: ComparePageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const ids = (resolved?.ids || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .slice(0, 3);

    if (ids.length < 2) {
        return (
            <>
                <section className="py-16 bg-kama-gradient">
                    <div className="container text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Compare Vehicles</h1>
                        <p className="text-primary-foreground/70 max-w-xl mx-auto">Select 2 to 3 vehicles from Products page to compare specifications side-by-side.</p>
                    </div>
                </section>
                <section className="py-16">
                    <div className="container max-w-3xl text-center">
                        <div className="rounded-xl border bg-card p-8">
                            <p className="text-muted-foreground mb-5">No vehicles selected for comparison.</p>
                            <Link
                                href="/products"
                                className="inline-flex px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-kama-blue-dark transition-colors"
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .in("id", ids)
        .eq("is_active", true);

    const products = ((data ?? []) as (Product & { category?: Category })[])
        .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

    if (products.length < 2) notFound();

    const specKeys = Array.from(
        new Set(
            products.flatMap((product) => Object.keys(product.specs || {}))
        )
    ).sort((a, b) => a.localeCompare(b));

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container">
                    <Link href="/products" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">
                        ← Back to Products
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mt-3 mb-3">Vehicle Comparison</h1>
                    <p className="text-primary-foreground/70">Compare up to three vehicles side-by-side before requesting a quote.</p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container overflow-x-auto">
                    <table className="min-w-[780px] w-full border rounded-xl overflow-hidden bg-card shadow-sm">
                        <thead>
                            <tr className="bg-muted/40 border-b">
                                <th className="text-left px-4 py-3 font-display text-sm uppercase tracking-wide text-muted-foreground w-[220px]">Specification</th>
                                {products.map((product) => (
                                    <th key={product.id} className="text-left px-4 py-3 border-l">
                                        <p className="font-display font-bold text-foreground text-base">{product.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {(product.category?.name ?? "-")} · {product.brand.toUpperCase()}
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-3 font-medium text-foreground">Model Year</td>
                                {products.map((product) => (
                                    <td key={product.id} className="px-4 py-3 border-l text-sm text-muted-foreground">
                                        {product.model_year || "-"}
                                    </td>
                                ))}
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-3 font-medium text-foreground">Short Description</td>
                                {products.map((product) => (
                                    <td key={product.id} className="px-4 py-3 border-l text-sm text-muted-foreground">
                                        {product.short_description || "-"}
                                    </td>
                                ))}
                            </tr>

                            {specKeys.map((key, idx) => (
                                <tr key={key} className={`${idx % 2 === 0 ? "bg-muted/20" : ""} border-b`}>
                                    <td className="px-4 py-3 font-medium text-foreground capitalize">{formatLabel(key)}</td>
                                    {products.map((product) => (
                                        <td key={`${product.id}-${key}`} className="px-4 py-3 border-l text-sm text-muted-foreground">
                                            {String(product.specs?.[key] ?? "-")}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
