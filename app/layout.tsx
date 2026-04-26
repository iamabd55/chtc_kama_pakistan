import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import ScrollProgress from "@/components/ScrollProgress";
import ConditionalLayout from "@/components/ConditionalLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Poppins, Rajdhani, DM_Sans } from "next/font/google";
import { normalizeSiteSettings } from "@/lib/siteSettings";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : null;

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700", "800"],
    variable: "--font-poppins",
    display: "swap",
});

const rajdhani = Rajdhani({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-rajdhani",
    display: "swap",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    icons: {
        icon: "/favicon.ico",
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
    const initialSettings = normalizeSiteSettings(await getPublicSiteSettings());

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Al Nasir Motors Pakistan",
        url: SITE_URL,
        logo: absoluteUrl("/images/logo.webp"),
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
            className={`${poppins.variable} ${rajdhani.variable} ${dmSans.variable}`}
        >
            <head>
                {/* Preconnect to external resources for performance */}
                {supabaseOrigin && <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />}
                {supabaseOrigin && <link rel="dns-prefetch" href={supabaseOrigin} />}
            </head>
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                <GoogleAnalytics />
                <ScrollProgress />
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <ConditionalLayout initialSettings={initialSettings}>{children}</ConditionalLayout>
                </TooltipProvider>
            </body>
        </html>
    );
}

