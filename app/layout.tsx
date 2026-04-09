import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import Providers from "./providers";
import ScrollProgress from "@/components/ScrollProgress";
import ConditionalLayout from "@/components/ConditionalLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Poppins, Rajdhani, DM_Sans, Orbitron, Vujahday_Script, Manjari, Inter } from "next/font/google";
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

const vujahdayScript = Vujahday_Script({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-vujahday-script",
    display: "swap",
});

const manjari = Manjari({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-manjari",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "700", "800"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    icons: {
        icon: [
            { url: "/images/al-nasir-logo.png", type: "image/png" },
            { url: "/favicon.ico", sizes: "any" },
        ],
        shortcut: ["/images/al-nasir-logo.png"],
        apple: [{ url: "/images/al-nasir-logo.png", type: "image/png" }],
    },
    title: {
        default: "Al Nasir Motors Pakistan — Commercial Vehicles",
        template: "%s | Al Nasir Motors Pakistan",
    },
    description: "Al Nasir Motors Pakistan — your trusted partner for commercial vehicles. Light trucks, heavy trucks, vans, buses and special vehicles.",
    applicationName: "Al Nasir Motors Pakistan",
    category: "Automotive",
    keywords: [
        "Al Nasir Motors Pakistan",
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
        siteName: "Al Nasir Motors Pakistan",
        title: "Al Nasir Motors Pakistan — Commercial Vehicles",
        description: "Explore Al Nasir Motors Pakistan lineup including mini trucks, light trucks, EV trucks, buses, and special-purpose vehicles.",
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Al Nasir Motors Pakistan commercial vehicles",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Al Nasir Motors Pakistan — Commercial Vehicles",
        description: "Explore Al Nasir Motors Pakistan lineup including mini trucks, light trucks, EV trucks, buses, and special-purpose vehicles.",
        images: [DEFAULT_OG_IMAGE],
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
        name: "Al Nasir Motors Pakistan",
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
        <html
            lang="en"
            className={`${poppins.variable} ${rajdhani.variable} ${dmSans.variable} ${orbitron.variable} ${vujahdayScript.variable} ${manjari.variable} ${inter.variable}`}
        >
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                <GoogleAnalytics />
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

