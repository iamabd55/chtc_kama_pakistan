import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/supabase/types";
import GalleryClient from "@/components/gallery/GalleryClient";

import { Suspense } from "react";

export default function GalleryPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Gallery</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Product photos, events, facility images, and customer delivery pictures.</p>
                </div>
            </section>
            <section className="py-20">
                <div className="container">
                    <Suspense fallback={<GallerySkeleton />}>
                        <GalleryLoader />
                    </Suspense>
                </div>
            </section>
        </>
    );
}

function GallerySkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted rounded-xl aspect-square" />
            ))}
        </div>
    );
}

async function GalleryLoader() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

    const fallback: GalleryItem[] = [
        {
            id: "fallback-product-1",
            title: "Light Commercial Vehicle",
            image_url: "vehicle-light-truck.jpg",
            category: "product",
            display_order: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: "fallback-product-2",
            title: "Heavy Duty Truck",
            image_url: "vehicle-heavy-truck.jpg",
            category: "product",
            display_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    const items = ((data as GalleryItem[] | null) ?? []).length > 0 ? ((data as GalleryItem[]) ?? []) : fallback;

    return <GalleryClient items={items} />;
}
