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
        "@id": `${SITE_URL}/#organization`,
        name: "Al Nasir Motors Pakistan",
        url: SITE_URL,
        logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/images/logo.webp"),
            width: 300,
            height: 60,
        },
        email: initialSettings.supportEmail,
        telephone: initialSettings.officePhone,
        address: {
            "@type": "PostalAddress",
            streetAddress: initialSettings.officeAddress,
            addressLocality: "Lahore",
            addressRegion: "Punjab",
            addressCountry: "PK",
        },
        sameAs: [
            "https://www.facebook.com/alnasirmotors",
        ],
    };

    // WebSite schema — enables the Google Sitelinks Search Box
    const webSiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Al Nasir Motors Pakistan",
        description: "Your trusted partner for commercial vehicles in Pakistan — mini trucks, light trucks, EV trucks, buses and special-purpose vehicles.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    // SiteNavigationElement schema — signals Google which pages should
    // appear as sitelinks under the main search result
    const navSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Al Nasir Motors Pakistan — Main Navigation",
        itemListElement: [
            {
                "@type": "SiteNavigationElement",
                position: 1,
                name: "Products",
                description: "Browse our full lineup of mini trucks, light trucks, EV trucks and buses.",
                url: absoluteUrl("/products"),
            },
            {
                "@type": "SiteNavigationElement",
                position: 2,
                name: "Find a Dealer",
                description: "Locate your nearest Al Nasir Motors authorized dealer across Pakistan.",
                url: absoluteUrl("/find-dealer"),
            },
            {
                "@type": "SiteNavigationElement",
                position: 3,
                name: "Get a Quote",
                description: "Request a price quote for any commercial vehicle in our range.",
                url: absoluteUrl("/get-quote"),
            },
            {
                "@type": "SiteNavigationElement",
                position: 4,
                name: "After Sales",
                description: "Spare parts, scheduled maintenance, warranty and service appointments.",
                url: absoluteUrl("/after-sales"),
            },
            {
                "@type": "SiteNavigationElement",
                position: 5,
                name: "CHTC Brands",
                description: "Explore KAMA, Kinwin and Joylong brand lineups available in Pakistan.",
                url: absoluteUrl("/brands"),
            },
            {
                "@type": "SiteNavigationElement",
                position: 6,
                name: "Contact Us",
                description: "Get in touch with our team via phone, email, WhatsApp, or our contact form.",
                url: absoluteUrl("/contact"),
            },
        ],
    };

    // LocalBusiness schema — improves the Google Knowledge Panel
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "AutoDealer",
        "@id": `${SITE_URL}/#localbusiness`,
        name: "Al Nasir Motors Pakistan",
        url: SITE_URL,
        telephone: initialSettings.officePhone || "+92 300 8665 060",
        email: initialSettings.supportEmail || "info@alnasirmotors.com.pk",
        image: absoluteUrl("/images/logo.webp"),
        logo: absoluteUrl("/images/logo.webp"),
        address: {
            "@type": "PostalAddress",
            streetAddress: initialSettings.officeAddress || "19-KM Multan Road",
            addressLocality: "Lahore",
            addressRegion: "Punjab",
            addressCountry: "PK",
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Saturday"],
                opens: "09:00",
                closes: "14:00",
            },
        ],
        priceRange: "$$",
        currenciesAccepted: "PKR",
        paymentAccepted: "Cash, Bank Transfer",
        areaServed: {
            "@type": "Country",
            name: "Pakistan",
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
                {/* Structured Data — all four schemas for maximum Google rich result coverage */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
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

