"use client";

import { useEffect, useRef } from "react";
import type { Dealer } from "@/lib/supabase/types";

interface DealerLeafletMapProps {
    mapCenter: [number, number];
    dealers: Dealer[];
}

export default function DealerLeafletMap({ mapCenter, dealers }: DealerLeafletMapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any>(null);
    const layerRef = useRef<any>(null);
    const leafletRef = useRef<any>(null);

    const paintDealers = (L: any, currentDealers: Dealer[], center: [number, number]) => {
        if (!mapRef.current || !layerRef.current) return;

        layerRef.current.clearLayers();

        currentDealers.forEach((dealer) => {
            const lat = Number(dealer.lat);
            const lng = Number(dealer.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            const marker = L.circleMarker([lat, lng], {
                radius: 7,
                color: "#0b4ea2",
                fillColor: "#0b4ea2",
                fillOpacity: 0.8,
            }).addTo(layerRef.current);

            marker.bindPopup(
                `<div class="text-sm"><p class="font-semibold">${dealer.name}</p><p>${dealer.city}, ${dealer.province}</p><p>${dealer.phone}</p></div>`
            );
        });

        mapRef.current.setView(center, mapRef.current.getZoom(), { animate: false });
    };

    useEffect(() => {
        let cancelled = false;

        const initMap = async () => {
            if (!containerRef.current) return;

            const L = await import("leaflet");
            if (cancelled || !containerRef.current) return;

            const container = containerRef.current as any;

            // HMR can preserve DOM nodes between mounts; clear any stale Leaflet id.
            if (container._leaflet_id) {
                delete container._leaflet_id;
            }

            leafletRef.current = L;

            mapRef.current = L.map(container, { zoomControl: true, scrollWheelZoom: true }).setView(mapCenter, 6);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            layerRef.current = L.layerGroup().addTo(mapRef.current);
            paintDealers(L, dealers, mapCenter);
        };

        initMap();

        return () => {
            cancelled = true;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            layerRef.current = null;
            leafletRef.current = null;

            if (containerRef.current) {
                const container = containerRef.current as any;
                if (container._leaflet_id) {
                    delete container._leaflet_id;
                }
            }
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        const updateMap = async () => {
            if (!mapRef.current || !layerRef.current) return;

            const L = leafletRef.current ?? (await import("leaflet"));
            if (cancelled || !mapRef.current || !layerRef.current) return;

            leafletRef.current = L;
            paintDealers(L, dealers, mapCenter);
        };

        updateMap();

        return () => {
            cancelled = true;
        };
    }, [dealers, mapCenter]);

    return <div ref={containerRef} className="h-full w-full z-0" aria-label="Dealer map" />;
}
