import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import Providers from "./providers";
import ScrollProgress from "@/components/ScrollProgress";
import ConditionalLayout from "@/components/ConditionalLayout";
import { Poppins, Rajdhani, DM_Sans, Orbitron } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/supabase/types";
import { normalizeSiteSettings } from "@/lib/siteSettings";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
    display: "swap",
});

const rajdhani = Rajdhani({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-rajdhani",
    display: "swap",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    display: "swap",
});

const orbitron = Orbitron({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-orbitron",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "CHTC Kama Pakistan — Commercial Vehicles",
        template: "%s | CHTC Kama Pakistan",
    },
    description: "CHTC Kama Pakistan — your trusted partner for commercial vehicles. Light trucks, heavy trucks, vans, buses and special vehicles.",
    applicationName: "CHTC Kama Pakistan",
    category: "Automotive",
    keywords: [
        "CHTC Kama Pakistan",
        "commercial vehicles Pakistan",
        "mini truck Pakistan",
        "light truck Pakistan",
        "dumper truck Pakistan",
        "EV truck Pakistan",
        "bus Pakistan",
        "find dealer Pakistan",
    ],
    openGraph: {
        type: "website",
        locale: "en_PK",
        url: "/",
        siteName: "CHTC Kama Pakistan",
        title: "CHTC Kama Pakistan — Commercial Vehicles",
        description: "Explore CHTC Kama Pakistan lineup including mini trucks, light trucks, EV trucks, buses, and special-purpose vehicles.",
        images: [
            {
                url: absoluteUrl("/images/hero/kama-hero.png"),
                width: 1200,
                height: 630,
                alt: "CHTC Kama Pakistan commercial vehicles",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "CHTC Kama Pakistan — Commercial Vehicles",
        description: "Explore CHTC Kama Pakistan lineup including mini trucks, light trucks, EV trucks, buses, and special-purpose vehicles.",
        images: [absoluteUrl("/images/hero/kama-hero.png")],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

    const initialSettings = normalizeSiteSettings((data as SiteSettings | null) ?? null);

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CHTC Kama Pakistan",
        url: SITE_URL,
        logo: absoluteUrl("/images/logo.png"),
        email: initialSettings.supportEmail,
        telephone: initialSettings.officePhone,
        address: {
            "@type": "PostalAddress",
            streetAddress: initialSettings.officeAddress,
            addressCountry: "PK",
        },
    };

    return (
        <html lang="en" className={`${poppins.variable} ${rajdhani.variable} ${dmSans.variable} ${orbitron.variable}`}>
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                <Providers>
                    <ScrollProgress />
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <ConditionalLayout initialSettings={initialSettings}>{children}</ConditionalLayout>
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    );
}
