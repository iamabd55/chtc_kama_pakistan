"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/supabase/types";
import {
    DEFAULT_PUBLIC_SETTINGS,
    normalizeSiteSettings,
    type PublicSiteSettings,
} from "@/lib/siteSettings";

export type { PublicSiteSettings } from "@/lib/siteSettings";

export function useSiteSettings(initialSettings?: PublicSiteSettings, enabled = true) {
    const baseSettings = initialSettings ?? DEFAULT_PUBLIC_SETTINGS;
    const [fetchedData, setFetchedData] = useState<PublicSiteSettings | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let cancelled = false;

        const fetchSettings = async () => {
            try {
                const supabase = createClient();
                const { data: settingsData } = await supabase
                    .from("site_settings")
                    .select("*")
                    .eq("id", 1)
                    .single();

                if (!cancelled) {
                    setFetchedData(normalizeSiteSettings((settingsData as SiteSettings | null) ?? null));
                }
            } catch {
                // Keep existing settings when the client fetch fails.
            }
        };

        void fetchSettings();

        return () => {
            cancelled = true;
        };
    }, [enabled]);

    return { data: fetchedData ?? baseSettings };
}
