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
    searchParams?: Promise<{ submitted?: string; error?: string }>;
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
        title: product.meta_title ?? `${product.name} — Al Nasir Motors Pakistan`,
        description: product.meta_desc ?? product.short_description ?? `Learn more about the ${product.name}.`,
    };
}

const BRAND_LABELS: Record<string, string> = {
    kama: "Kama",
    kinwin: "Kinwin",
    chtc: "CHTC",
    joylong: "Joylong",
};

const STORAGE_GALLERY_BY_SLUG: Record<string, string> = {
    "coaster-c7": "products/chtc/coaster-c7",
    "labor-bus-9m": "products/kinwin/labor-bus-9m",
};

const SEAT_LAYOUT_BY_SLUG: Record<string, string> = {
    "bus-12m": "products/kinwin/bus-12m",
};

function getImageLabel(path: string): string {
    const filename = path.split("/").pop() ?? "image";
    const withoutExt = filename.replace(/\.[^/.]+$/, "");
    return withoutExt
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
    const { category: categorySlug, slug } = await params;
    const resolved = searchParams ? await searchParams : undefined;
    const isSubmitted = resolved?.submitted === "1";
    const hasError = resolved?.error === "1";
    const supabase = await createClient();

    // Fetch product with category
    const { data: productData } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single();

    if (!productData) notFound();

    const product = productData as Product & { category: Category };

    const { data: siteSettingsData } = await supabase
        .from("site_settings")
        .select("whatsapp_number")
        .eq("id", 1)
        .single();

    const whatsappNumber = String(siteSettingsData?.whatsapp_number ?? "923008665060").replace(/[^\d]/g, "") || "923008665060";

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

    const dbExtraImages = Array.from(new Set((product.images ?? []).filter(Boolean)));
    const storageGalleryPath = dbExtraImages.length === 0 ? STORAGE_GALLERY_BY_SLUG[product.slug] : undefined;

    let storageExtraImagePaths: string[] = [];
    if (storageGalleryPath) {
        const thumbnailName = product.thumbnail.split("/").pop()?.toLowerCase();

        const { data: storageFiles } = await supabase.storage
            .from("images")
            .list(storageGalleryPath, {
                limit: 100,
                sortBy: { column: "name", order: "asc" },
            });

        storageExtraImagePaths = (storageFiles ?? [])
            .map((file) => file.name)
            .filter((name) => {
                const lower = name.toLowerCase();
                if (thumbnailName && lower === thumbnailName) return false;
                if (/-main\.(png|jpe?g|webp|avif)$/i.test(lower)) return false;
                return /\.(png|jpe?g|webp|avif)$/i.test(name);
            })
            .map((name) => `${storageGalleryPath}/${name}`);
    }

    const seatLayoutFolder = SEAT_LAYOUT_BY_SLUG[product.slug];
    let seatLayoutImagePath: string | null = null;
    if (seatLayoutFolder) {
        const { data: layoutFiles } = await supabase.storage
            .from("images")
            .list(seatLayoutFolder, {
                limit: 100,
                sortBy: { column: "name", order: "asc" },
            });

        const seatLayoutFile = (layoutFiles ?? []).find((file) =>
            /seat-layout-diagram\.(png|jpe?g|webp|avif)$/i.test(file.name)
        );

        if (seatLayoutFile) {
            seatLayoutImagePath = `${seatLayoutFolder}/${seatLayoutFile.name}`;
        }
    }

    const galleryExtraImages = dbExtraImages.length > 0 ? dbExtraImages : storageExtraImagePaths;

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
                                images={galleryExtraImages.map((img) => getStorageUrl(img))}
                                name={product.name}
                                preserveMainImage={product.slug === "coaster-c7"}
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
                                        href={`https://wa.me/${whatsappNumber}`}
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

                            <div className="bg-card border rounded-xl p-6 shadow-sm">
                                <h3 className="font-display font-bold text-lg text-foreground mb-4">Send Product Inquiry</h3>

                                {isSubmitted && (
                                    <div className="mb-3 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-700">
                                        Your inquiry has been submitted.
                                    </div>
                                )}

                                {hasError && (
                                    <div className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700">
                                        Could not submit inquiry. Please try again.
                                    </div>
                                )}

                                <form method="post" action="/api/inquiries/product" className="space-y-2.5">
                                    <input type="hidden" name="product_id" value={product.id} />
                                    <input type="hidden" name="product_slug" value={product.slug} />
                                    <input type="hidden" name="return_url" value={`/products/${categorySlug}/${product.slug}`} />
                                    <input name="full_name" type="text" required placeholder="Full Name *" className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm" />
                                    <input name="phone" type="tel" required placeholder="Phone *" className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm" />
                                    <input name="email" type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm" />
                                    <input name="city" type="text" required placeholder="City *" className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm" />
                                    <textarea name="message" rows={3} placeholder="Your requirement" className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm" />
                                    <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground font-display font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-kama-blue-dark transition-colors">
                                        Submit Inquiry
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {galleryExtraImages.length > 0 && (
                        <div className="mt-14 md:mt-20">
                            <div className="mb-7">
                                <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.25em] mb-2">Visual Tour</p>
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Interior, Driving & Exterior Gallery</h2>
                                <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-3xl">
                                    Explore detailed interior, driving and exterior views of the {product.name}.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                {galleryExtraImages.map((path, index) => (
                                    <figure
                                        key={path}
                                        className={`group relative overflow-hidden rounded-xl border bg-muted ${
                                            index === 0 ? "md:col-span-2 aspect-[16/8]" : "aspect-[16/10]"
                                        }`}
                                    >
                                        <Image
                                            src={getStorageUrl(path)}
                                            alt={`${product.name} ${getImageLabel(path)}`}
                                            fill
                                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                            sizes={index === 0 ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 100vw, 40vw"}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-85" />
                                        <figcaption className="absolute bottom-3 left-3 right-3 text-white text-xs md:text-sm font-medium tracking-wide">
                                            {getImageLabel(path)}
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    )}

                    {seatLayoutImagePath && (
                        <div className="mt-14 md:mt-20">
                            <div className="mb-7">
                                <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.25em] mb-2">Planning & Comfort</p>
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">12.5m Bus Seat Layout Diagram</h2>
                                <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-3xl">
                                    A clear top-view layout to understand cabin flow, seating distribution and entry zones.
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-gradient-to-b from-muted/40 to-background p-4 md:p-6 shadow-sm">
                                <div className="relative w-full aspect-[21/8] rounded-xl overflow-hidden bg-card border">
                                    <Image
                                        src={getStorageUrl(seatLayoutImagePath)}
                                        alt={`${product.name} seat layout diagram`}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

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
