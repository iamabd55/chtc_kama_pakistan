"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackNavigation from "@/components/BackNavigation";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { PublicSiteSettings } from "@/lib/siteSettings";

/**
 * Conditionally renders the public Header/Footer/WhatsApp for main site routes.
 * Admin routes get none of those — they use their own AdminSidebar layout.
 */
export default function ConditionalLayout({
    children,
    initialSettings,
}: {
    children: React.ReactNode;
    initialSettings?: PublicSiteSettings;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const isHome = pathname === "/";
    const { data: siteSettings } = useSiteSettings(initialSettings);

    useEffect(() => {
        if (typeof window === "undefined" || isAdmin) {
            return;
        }

        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";

        return () => {
            window.history.scrollRestoration = previous;
        };
    }, [isAdmin]);

    useEffect(() => {
        if (isAdmin) {
            return;
        }

        if (typeof window === "undefined") {
            return;
        }

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const raf = window.requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });
        });

        return () => window.cancelAnimationFrame(raf);
    }, [pathname, isAdmin]);

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header settings={siteSettings} />
            <main className="relative flex-1 pt-24 md:pt-28">
                {!isHome ? (
                    <div className="absolute left-0 right-0 top-[104px] md:top-[120px] z-20 pointer-events-none">
                        <div className="container pointer-events-auto">
                            <BackNavigation />
                        </div>
                    </div>
                ) : null}
                {children}
            </main>
            <Footer settings={siteSettings} />
            <WhatsAppButton settings={siteSettings} />
        </>
    );
}
