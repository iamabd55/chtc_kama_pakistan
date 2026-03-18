"use client";

import { useEffect, useRef } from "react";
import type { Dealer } from "@/lib/supabase/types";

interface DealerGoogleMapProps {
    mapCenter: [number, number];
    dealers: Dealer[];
}

declare global {
    interface Window {
        google?: any;
    }
}

const SCRIPT_ID = "google-maps-script";

const loadGoogleMaps = (apiKey: string) =>
    new Promise<any>((resolve, reject) => {
        if (window.google?.maps) {
            resolve(window.google);
            return;
        }

        const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (existingScript) {
            existingScript.addEventListener("load", () => {
                if (window.google?.maps) resolve(window.google);
                else reject(new Error("Google Maps failed to load"));
            });
            existingScript.addEventListener("error", () => reject(new Error("Google Maps script error")));
            return;
        }

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google?.maps) resolve(window.google);
            else reject(new Error("Google Maps failed to load"));
        };
        script.onerror = () => reject(new Error("Google Maps script error"));
        document.head.appendChild(script);
    });

export default function DealerGoogleMap({ mapCenter, dealers }: DealerGoogleMapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey || !containerRef.current) return;

        let cancelled = false;

        const init = async () => {
            try {
                const g = await loadGoogleMaps(apiKey);
                if (cancelled || !containerRef.current) return;

                mapRef.current = new g.maps.Map(containerRef.current, {
                    center: { lat: mapCenter[0], lng: mapCenter[1] },
                    zoom: 6,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                });
            } catch {
                // Fail silently; parent component provides map context.
            }
        };

        init();

        return () => {
            cancelled = true;
            markersRef.current.forEach((marker) => marker.setMap(null));
            markersRef.current = [];
            mapRef.current = null;
        };
    }, [mapCenter]);

    useEffect(() => {
        if (!mapRef.current || !window.google?.maps) return;

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();

        dealers.forEach((dealer) => {
            const lat = Number(dealer.lat);
            const lng = Number(dealer.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            const marker = new window.google.maps.Marker({
                map: mapRef.current,
                position: { lat, lng },
                title: dealer.name,
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: `<div style=\"font-size:12px;line-height:1.4\"><strong>${dealer.name}</strong><br/>${dealer.city}, ${dealer.province}<br/>${dealer.phone}</div>`,
            });

            marker.addListener("click", () => {
                infoWindow.open({
                    anchor: marker,
                    map: mapRef.current,
                });
            });

            markersRef.current.push(marker);
            bounds.extend({ lat, lng });
        });

        if (!bounds.isEmpty()) {
            mapRef.current.fitBounds(bounds, 80);
        } else {
            mapRef.current.setCenter({ lat: mapCenter[0], lng: mapCenter[1] });
            mapRef.current.setZoom(6);
        }
    }, [dealers, mapCenter]);

    return <div ref={containerRef} className="h-full w-full" aria-label="Dealer map" />;
}
