"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/**
 * Conditionally renders the public Header/Footer/WhatsApp for main site routes.
 * Admin routes get none of those — they use their own AdminSidebar layout.
 */
export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="flex-1 pt-[60px] md:pt-[88px]">{children}</main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
