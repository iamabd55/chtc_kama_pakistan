import type { SiteSettings } from "@/lib/supabase/types";

export type PublicSiteSettings = {
    whatsappNumber: string;
    salesEmail: string;
    supportEmail: string;
    officePhone: string;
    officeAddress: string;
    companyTagline: string;
    footerText: string;
    socialLinks: Record<string, string>;
};

export const DEFAULT_PUBLIC_SETTINGS: PublicSiteSettings = {
    whatsappNumber: "+923008665060",
    salesEmail: "sales@alnasirmotors.com.pk",
    supportEmail: "info@alnasirmotors.com.pk",
    officePhone: "+92 300 8665 060",
    officeAddress: "Al Nasir Motors Pakistan, Lahore, Punjab, Pakistan",
    companyTagline: "Driven by Al Nasir Motors",
    footerText: "© 2026 Al Nasir Motors Pakistan. All rights reserved.",
    socialLinks: {},
};

export function normalizeSiteSettings(data: SiteSettings | null): PublicSiteSettings {
    if (!data) return DEFAULT_PUBLIC_SETTINGS;

    const socialLinks =
        data.social_links && typeof data.social_links === "object"
            ? (Object.fromEntries(
                  Object.entries(data.social_links).filter(
                      ([, value]) => typeof value === "string" && value.trim().length > 0
                  )
              ) as Record<string, string>)
            : {};

    return {
        whatsappNumber: data.whatsapp_number || DEFAULT_PUBLIC_SETTINGS.whatsappNumber,
        salesEmail: data.sales_email || DEFAULT_PUBLIC_SETTINGS.salesEmail,
        supportEmail: data.support_email || DEFAULT_PUBLIC_SETTINGS.supportEmail,
        officePhone: data.office_phone || DEFAULT_PUBLIC_SETTINGS.officePhone,
        officeAddress: data.office_address || DEFAULT_PUBLIC_SETTINGS.officeAddress,
        companyTagline: data.company_tagline || DEFAULT_PUBLIC_SETTINGS.companyTagline,
        footerText: data.footer_text || DEFAULT_PUBLIC_SETTINGS.footerText,
        socialLinks,
    };
}

