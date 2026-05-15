"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PublicSiteSettings } from "@/lib/siteSettings";

interface AnnouncementBannerProps {
    settings?: PublicSiteSettings;
}

export default function AnnouncementBanner({ settings }: AnnouncementBannerProps) {
    const tickerText = settings?.announcementBannerMessage?.trim();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    if (!settings?.announcementBannerEnabled || !tickerText) {
        return null;
    }

    return (
        <motion.div
            className="w-full overflow-hidden border-b border-amber-300/60 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <style>{`
                @keyframes ticker-scroll {
                    from { transform: translate3d(100vw, 0, 0); }
                    to   { transform: translate3d(-100%, 0, 0); }
                }
                .ticker-text {
                    display: inline-block;
                    white-space: nowrap;
                    font-size: 0.875rem;
                    font-weight: 500;
                    line-height: 1.25rem;
                    animation: ticker-scroll 20s linear infinite;
                    will-change: transform;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
            <div className="py-2.5">
                {mounted && (
                    <span className="ticker-text">
                        {tickerText}
                    </span>
                )}
            </div>
        </motion.div>
    );
}