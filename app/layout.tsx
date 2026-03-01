import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";

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
        <html lang="en">
            <body>
                <Providers>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main className="flex-1 pt-[88px]">{children}</main>
                            <Footer />
                        </div>
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    );
}
