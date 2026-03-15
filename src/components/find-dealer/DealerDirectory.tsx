"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, ExternalLink, Search } from "lucide-react";
import type { Dealer } from "@/lib/supabase/types";

interface DealerDirectoryProps {
    dealers: Dealer[];
}

const PROVINCES: Dealer["province"][] = ["Punjab", "Sindh", "KPK", "Balochistan", "AJK", "GB", "ICT"];

export default function DealerDirectory({ dealers }: DealerDirectoryProps) {
    const [query, setQuery] = useState("");
    const [province, setProvince] = useState<string>("all");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return dealers.filter((d) => {
            if (province !== "all" && d.province !== province) return false;
            if (!q) return true;
            return (
                d.name.toLowerCase().includes(q) ||
                d.city.toLowerCase().includes(q) ||
                d.province.toLowerCase().includes(q)
            );
        });
    }, [dealers, province, query]);

    const cityStats = useMemo(() => {
        const counts = new Map<string, number>();
        for (const dealer of filtered) {
            counts.set(dealer.city, (counts.get(dealer.city) ?? 0) + 1);
        }
        return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [filtered]);

    return (
        <section className="py-12">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
                    <aside className="space-y-4 lg:sticky lg:top-24">
                        <div className="bg-card border rounded-xl p-5">
                            <h2 className="font-display font-bold text-xl text-foreground mb-4">Search Dealers</h2>
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="City, dealer name..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                            <select
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="all">All Provinces</option>
                                {PROVINCES.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-card border rounded-xl p-5">
                            <h3 className="font-display font-bold text-lg text-foreground mb-3">Cities</h3>
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {cityStats.map(([city, count]) => (
                                    <div key={city} className="flex items-center justify-between text-sm">
                                        <span className="text-foreground">{city}</span>
                                        <span className="text-muted-foreground">{count}</span>
                                    </div>
                                ))}
                                {cityStats.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No dealers match your filters.</p>
                                )}
                            </div>
                        </div>
                    </aside>

                    <div>
                        <div className="mb-4 text-sm text-muted-foreground">
                            {filtered.length} dealer{filtered.length !== 1 ? "s" : ""} found
                        </div>

                        {filtered.length === 0 ? (
                            <div className="bg-card border rounded-xl p-10 text-center">
                                <p className="text-muted-foreground">No dealers found for current filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {filtered.map((dealer) => {
                                    const mapsQuery = `${dealer.name}, ${dealer.address}`;
                                    const mapsUrl =
                                        dealer.google_maps_url ||
                                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

                                    return (
                                        <article key={dealer.id} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div>
                                                    <h3 className="font-display font-bold text-lg text-foreground">{dealer.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{dealer.city}, {dealer.province}</p>
                                                </div>
                                                <span className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary uppercase font-semibold tracking-wide">
                                                    {dealer.dealer_type}
                                                </span>
                                            </div>

                                            <div className="space-y-2.5 text-sm">
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
                                            </div>

                                            <div className="mt-4 pt-4 border-t flex items-center justify-between gap-3">
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                                    {dealer.brands?.length ? dealer.brands.join(", ") : "All Brands"}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        href={`/find-dealer/${dealer.id}`}
                                                        className="text-sm font-medium text-primary hover:text-kama-blue-dark transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <a
                                                        href={mapsUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-kama-blue-dark transition-colors"
                                                    >
                                                        Open Map
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
