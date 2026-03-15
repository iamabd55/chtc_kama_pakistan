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

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CHTC Kama Pakistan",
    url: SITE_URL,
    logo: absoluteUrl("/images/logo.png"),
    email: "info@chtckama.com.pk",
    telephone: "+92 300 8665 060",
    address: {
        "@type": "PostalAddress",
        addressCountry: "PK",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                        <ConditionalLayout>{children}</ConditionalLayout>
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    );
}
