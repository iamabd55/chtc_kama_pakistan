"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/supabase/types";
import {
    DEFAULT_PUBLIC_SETTINGS,
    normalizeSiteSettings,
    type PublicSiteSettings,
} from "@/lib/siteSettings";

export type { PublicSiteSettings } from "@/lib/siteSettings";

export function useSiteSettings(initialSettings?: PublicSiteSettings) {
    return useQuery({
        queryKey: ["site_settings_public"],
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from("site_settings")
                .select("*")
                .eq("id", 1)
                .single();

            return normalizeSiteSettings((data as SiteSettings | null) ?? null);
        },
        initialData: initialSettings ?? DEFAULT_PUBLIC_SETTINGS,
    });
}
