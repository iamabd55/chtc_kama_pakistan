import { cache } from "react";
import type { SiteSettings } from "@/lib/supabase/types";
import { createPublicServerClient } from "@/lib/supabase/publicServer";

export const getPublicSiteSettings = cache(async (): Promise<SiteSettings | null> => {
    const supabase = createPublicServerClient();

    const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

    return (data as SiteSettings | null) ?? null;
});