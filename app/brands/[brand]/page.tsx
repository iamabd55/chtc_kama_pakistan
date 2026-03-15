import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStorageUrl } from "@/lib/supabase/storage";
import type { Product } from "@/lib/supabase/types";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ brand: string }>;
}

type BrandSlug = "kama" | "kinwin" | "joylong";

interface BrandConfig {
    name: string;
    logo: string;
    heroTitle: string;
    heroDescription: string;
    summary: string;
    highlights: string[];
    officialUrl?: string;
}

const BRAND_CONFIG: Record<BrandSlug, BrandConfig> = {
    kama: {
        name: "Kama",
        logo: "/images/kama-round.png",
        heroTitle: "CHTC Kama",
        heroDescription:
            "Flagship commercial vehicle lineup for Pakistan, from compact mini trucks to heavy-duty and EV solutions.",
        summary:
            "Kama is our core in-market brand. This page helps buyers quickly compare available models and move directly into quote and dealer flows.",
        highlights: ["Mini, Light, Dumper and EV trucks", "Local after-sales and parts support", "Built for Pakistan operating conditions"],
    },
    kinwin: {
        name: "Kinwin",
        logo: "/images/kinwin logo.jpg",
        heroTitle: "CHTC Kinwin",
        heroDescription:
            "Passenger bus platform focused on comfort, reliability, and long-route efficiency for private and fleet operators.",
        summary:
            "Kinwin supports transport use cases including labor movement, intercity operations, and institutional fleets with modern bus options.",
        highlights: ["9m and 12.5m bus range", "Fleet-ready passenger configurations", "Quotation and delivery support in Pakistan"],
    },
    joylong: {
        name: "Joylong",
        logo: "/images/joylong-logo.png",
        heroTitle: "Joylong",
        heroDescription:
            "Passenger-focused vehicles designed for commercial mobility, tourism, and institutional transport applications.",
        summary:
            "Joylong is positioned for premium passenger mobility. Local product availability may vary by shipment and current allocation.",
        highlights: ["Passenger comfort-first platform", "Commercial and institutional utility", "Lead capture for upcoming availability"],
    },
};

type BrandProduct = Pick<
    Product,
    "id" | "name" | "slug" | "brand" | "thumbnail" | "short_description" | "model_year" | "is_featured"
> & {
    category: { name: string; slug: string } | null;
};

export async function generateMetadata({ params }: PageProps) {
    const { brand } = await params;
    const key = brand as BrandSlug;
    const config = BRAND_CONFIG[key];

    if (!config) {
        return { title: "Brand Not Found" };
    }

    return {
        title: `${config.heroTitle} — CHTC Brands Pakistan`,
        description: config.heroDescription,
    };
}

export default async function BrandDetailPage({ params }: PageProps) {
    const { brand } = await params;
    const key = brand as BrandSlug;
    const config = BRAND_CONFIG[key];

    if (!config) notFound();

    const supabase = await createClient();

    const { data } = await supabase
        .from("products")
        .select("id, name, slug, brand, thumbnail, short_description, model_year, is_featured, category:categories(name, slug)")
        .eq("is_active", true)
        .eq("brand", key)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

    const products = (data ?? []) as BrandProduct[];
    const categoryCount = new Set(products.map((p) => p.category?.slug).filter(Boolean)).size;

    return (
        <>
            <section className="py-14 md:py-20 bg-kama-gradient relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_230px] gap-8 items-center">
                        <div>
                            <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Brand Profile</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground tracking-tight mb-4">
                                {config.heroTitle}
                            </h1>
                            <p className="text-primary-foreground/75 max-w-2xl text-base md:text-lg leading-relaxed mb-6">
                                {config.heroDescription}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-primary-foreground/80 text-sm">
                                <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">{products.length} Models</span>
                                <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">{categoryCount} Categories</span>
                                <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">Pakistan Sales Support</span>
                            </div>
                        </div>

                        <div className="hidden sm:flex lg:justify-end">
                            <div className="bg-white/95 rounded-xl border border-white/30 shadow-md px-5 py-4 w-44 h-28 flex items-center justify-center">
                                <Image
                                    src={config.logo}
                                    alt={`${config.name} logo`}
                                    width={150}
                                    height={60}
                                    className="w-auto h-12 object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-14 border-b bg-background">
                <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-display font-bold text-foreground mb-3">Brand Overview</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">{config.summary}</p>
                        <ul className="space-y-2">
                            {config.highlights.map((item) => (
                                <li key={item} className="text-sm text-foreground/90">• {item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-card border rounded-xl p-5 space-y-3">
                        <h3 className="font-display font-bold text-lg text-foreground">Next Step</h3>
                        <p className="text-sm text-muted-foreground">
                            For current availability, pricing and delivery, contact our local sales team.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/get-quote"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-kama-blue-dark transition-colors"
                            >
                                Get Quotation
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/find-dealer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-md text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                            >
                                Find Dealer
                            </Link>
                            {config.officialUrl && (
                                <a
                                    href={config.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-md text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                                >
                                    Visit Official Site
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20">
                <div className="container">
                    <div className="flex items-end justify-between gap-4 mb-8">
                        <div>
                            <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.2em] mb-2">Available in Pakistan</p>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">{config.name} Lineup</h2>
                        </div>
                        {products.length > 0 && (
                            <Link href="/products" className="text-sm font-medium text-primary hover:text-kama-blue-dark transition-colors">
                                View all products
                            </Link>
                        )}
                    </div>

                    {products.length === 0 ? (
                        <div className="bg-card border rounded-xl p-8 md:p-12 text-center">
                            <h3 className="text-2xl font-display font-bold text-foreground mb-3">Products Coming Soon</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                                We are onboarding the {config.name} catalog for Pakistan. Share your requirement and our team will provide current options.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-kama-blue-dark transition-colors"
                            >
                                Contact Sales
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={product.category ? `/products/${product.category.slug}/${product.slug}` : "/products"}
                                    className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                        <Image
                                            src={getStorageUrl(product.thumbnail)}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {product.is_featured && (
                                            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-display font-bold text-lg text-foreground leading-tight">{product.name}</h3>
                                            <ArrowRight className="w-4 h-4 text-primary mt-1 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                        {product.short_description && (
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.short_description}</p>
                                        )}
                                        <div className="flex items-center gap-2.5 text-xs">
                                            {product.category?.name && (
                                                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                                                    {product.category.name}
                                                </span>
                                            )}
                                            {product.model_year && <span className="text-muted-foreground">{product.model_year}</span>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
