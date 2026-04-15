import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Dealer } from "@/lib/supabase/types";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("dealers")
        .select("name, city, province")
        .eq("id", id)
        .single();

    if (!data) return { title: "Dealer Not Found" };

    return buildPageMetadata({
        title: `${data.name} — Find Dealer`,
        description: `${data.name} in ${data.city}, ${data.province}. Contact details and location map.`,
        path: `/find-dealer/${id}`,
        imageAlt: `${data.name} dealer location`,
    });
}

export default async function DealerDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("dealers")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

    if (!data) notFound();

    const dealer = data as Dealer;

    const mapQuery = `${dealer.name}, ${dealer.address}`;
    const embedQuery =
        dealer.lat != null && dealer.lng != null
            ? `${dealer.lat},${dealer.lng} (${dealer.name})`
            : mapQuery;
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(embedQuery)}&z=15&output=embed`;
    const mapsUrl =
        dealer.google_maps_url ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container">
                    <Link href="/find-dealer" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-5 transition-colors" prefetch={false}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Find Dealer
                    </Link>
                    <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.25em] mb-3">Authorized Dealer</p>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-3">{dealer.name}</h1>
                    <p className="text-primary-foreground/70 text-base md:text-lg">{dealer.city}, {dealer.province}</p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
                    <div className="bg-card border rounded-xl overflow-hidden">
                        <div className="relative aspect-[16/9] bg-muted">
                            <iframe
                                src={mapEmbedUrl}
                                className="w-full h-full"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`${dealer.name} map`}
                            />

                            <div className="absolute top-4 left-4 max-w-[360px] bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm p-3 md:p-4">
                                <p className="font-display font-bold text-foreground text-sm md:text-base leading-tight">
                                    {dealer.name}
                                </p>
                                <p className="text-muted-foreground text-xs md:text-sm mt-1 leading-relaxed">
                                    {dealer.address}
                                </p>
                                <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:text-kama-blue-dark transition-colors mt-2"
                                >
                                    View full place details
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <aside className="bg-card border rounded-xl p-6 space-y-4">
                        <h2 className="font-display font-bold text-2xl text-foreground">Dealer Details</h2>

                        <div className="space-y-3 text-sm">
                            <p className="text-muted-foreground flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>{dealer.address}</span>
                            </p>

                            <a href={`tel:${dealer.phone.replace(/[^+\d]/g, "")}`} className="text-foreground flex items-center gap-2 hover:text-primary transition-colors">
                                <Phone className="w-4 h-4 text-primary" />
                                {dealer.phone}
                            </a>

                            {dealer.whatsapp && (
                                <a
                                    href={`https://wa.me/${dealer.whatsapp.replace(/[^\d]/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4 text-primary" />
                                    {dealer.whatsapp}
                                </a>
                            )}

                            {dealer.email && (
                                <a href={`mailto:${dealer.email}`} className="text-foreground hover:text-primary transition-colors block">
                                    {dealer.email}
                                </a>
                            )}
                        </div>

                        <div className="pt-4 border-t space-y-2 text-sm">
                            <p className="text-muted-foreground">
                                <span className="font-medium text-foreground">Type:</span> {dealer.dealer_type}
                            </p>
                            <p className="text-muted-foreground">
                                <span className="font-medium text-foreground">Brands:</span> {dealer.brands?.length ? dealer.brands.join(", ") : "All"}
                            </p>
                            {dealer.working_hours && (
                                <p className="text-muted-foreground">
                                    <span className="font-medium text-foreground">Hours:</span> {dealer.working_hours}
                                </p>
                            )}
                        </div>

                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-kama-blue-dark transition-colors"
                        >
                            Open in Google Maps
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </aside>
                </div>
            </section>
        </>
    );
}
