import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Phone, ChevronRight, Truck, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStorageUrl } from "@/lib/supabase/storage";
import type { Product, Category } from "@/lib/supabase/types";
import ProductGallery from "@/components/products/ProductGallery";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from("products")
        .select("name, meta_title, meta_desc, short_description")
        .eq("slug", slug)
        .single();

    if (!product) return { title: "Product Not Found" };

    return {
        title: product.meta_title ?? `${product.name} — CHTC Kama Pakistan`,
        description: product.meta_desc ?? product.short_description ?? `Learn more about the ${product.name}.`,
    };
}

const BRAND_LABELS: Record<string, string> = {
    kama: "Kama",
    kinwin: "Kinwin",
    chtc: "CHTC",
    joylong: "Joylong",
};

export default async function ProductDetailPage({ params }: PageProps) {
    const { category: categorySlug, slug } = await params;
    const supabase = await createClient();

    // Fetch product with category
    const { data: productData } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single();

    if (!productData) notFound();

    const product = productData as Product & { category: Category };

    // Parse specs
    const specs = product.specs as Record<string, string | number>;
    const specEntries = Object.entries(specs);

    // Fetch related products (same category, different product)
    const { data: relatedData } = await supabase
        .from("products")
        .select("id, name, slug, brand, thumbnail, short_description, model_year, is_featured")
        .eq("category_id", product.category_id)
        .eq("is_active", true)
        .neq("id", product.id)
        .limit(3);

    const related = (relatedData ?? []) as Pick<Product, "id" | "name" | "slug" | "brand" | "thumbnail" | "short_description" | "model_year" | "is_featured">[];

    // Build gallery URLs
    const galleryImages = [
        getStorageUrl(product.thumbnail),
        ...product.images.map((img) => getStorageUrl(img)),
    ];

    return (
        <>
            {/* Breadcrumb + Hero */}
            <section className="py-10 md:py-14 bg-kama-gradient relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container relative z-10">
                    <nav className="flex items-center gap-2 text-sm text-primary-foreground/50 mb-6 flex-wrap">
                        <Link href="/products" className="hover:text-primary-foreground transition-colors">Products</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href={`/products/${categorySlug}`} className="hover:text-primary-foreground transition-colors">{product.category?.name}</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-primary-foreground font-medium">{product.name}</span>
                    </nav>
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground tracking-tight">{product.name}</h1>
                    {product.short_description && (
                        <p className="text-primary-foreground/70 max-w-2xl mt-3 text-base md:text-lg leading-relaxed">{product.short_description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-5">
                        <span className="bg-white/15 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                            {BRAND_LABELS[product.brand] ?? product.brand}
                        </span>
                        {product.model_year && (
                            <span className="text-primary-foreground/50 text-sm">Model {product.model_year}</span>
                        )}
                        {product.is_featured && (
                            <span className="bg-accent/90 text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <Star className="w-3 h-3" fill="currentColor" />
                                Featured
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="py-12 md:py-16">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
                        {/* Left: Image Gallery */}
                        <div className="lg:col-span-3">
                            <ProductGallery
                                thumbnail={getStorageUrl(product.thumbnail)}
                                images={product.images.map((img) => getStorageUrl(img))}
                                name={product.name}
                            />
                        </div>

                        {/* Right: Actions + Quick specs */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* CTA Card */}
                            <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold text-lg text-foreground">Interested in this vehicle?</h2>
                                        <p className="text-muted-foreground text-xs">Get pricing & availability</p>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <Link
                                        href={`/get-quote?product=${product.slug}`}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-kama-blue-dark transition-colors"
                                    >
                                        Get a Quote
                                    </Link>
                                    <a
                                        href="https://wa.me/923008665060"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white font-display font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Phone className="w-4 h-4" />
                                        WhatsApp
                                    </a>
                                    {product.brochure_url && (
                                        <a
                                            href={product.brochure_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-primary text-primary font-display font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Brochure
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Quick features */}
                            {product.features.length > 0 && (
                                <div className="bg-card border rounded-xl p-6 shadow-sm">
                                    <h3 className="font-display font-bold text-lg text-foreground mb-4">Key Features</h3>
                                    <ul className="space-y-2.5">
                                        {product.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Specifications table */}
                    {specEntries.length > 0 && (
                        <div className="mt-14 md:mt-20">
                            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Specifications</h2>
                            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full">
                                    <tbody>
                                        {specEntries.map(([key, value], i) => (
                                            <tr key={key} className={`${i % 2 === 0 ? "bg-muted/30" : ""} border-b last:border-0 border-border/50`}>
                                                <td className="px-6 py-3.5 text-sm font-medium text-foreground capitalize w-1/3 border-r border-border/50">
                                                    {key.replace(/_/g, " ")}
                                                </td>
                                                <td className="px-6 py-3.5 text-sm text-muted-foreground">
                                                    {String(value)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Related products */}
                    {related.length > 0 && (
                        <div className="mt-14 md:mt-20">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-display font-bold text-foreground">More in {product.category?.name}</h2>
                                <Link href={`/products/${categorySlug}`} className="text-primary hover:text-kama-blue-dark text-sm font-medium transition-colors flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {related.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/products/${categorySlug}/${rel.slug}`}
                                        className="group bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                                            <Image
                                                src={getStorageUrl(rel.thumbnail)}
                                                alt={rel.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-display font-bold text-foreground mb-1">{rel.name}</h3>
                                            {rel.short_description && (
                                                <p className="text-muted-foreground text-sm line-clamp-1">{rel.short_description}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back link */}
                    <div className="mt-12">
                        <Link href={`/products/${categorySlug}`} className="inline-flex items-center gap-2 text-primary hover:text-kama-blue-dark font-medium transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to {product.category?.name ?? "Products"}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
