import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";
import ScrollProgress from "@/components/ScrollProgress";
import ConditionalLayout from "@/components/ConditionalLayout";
import { Poppins, Rajdhani, DM_Sans } from "next/font/google";

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

export const metadata: Metadata = {
    title: "CHTC Kama Pakistan — Commercial Vehicles",
    description:
        "CHTC Kama Pakistan — your trusted partner for commercial vehicles. Light trucks, heavy trucks, vans, buses & special vehicles.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${poppins.variable} ${rajdhani.variable} ${dmSans.variable}`}>
            <body>
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
