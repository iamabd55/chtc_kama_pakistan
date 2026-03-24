"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { adminDb } from "@/lib/supabase/adminClient";
import { Menu, ShieldCheck, Sparkles, X } from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
    title: ReactNode;
    subtitle?: string;
    actions?: ReactNode;
    hideHeaderMeta?: boolean;
    minimalChrome?: boolean;
    useContentCard?: boolean;
}

const AdminLayout = ({
    children,
    title,
    subtitle,
    actions,
    hideHeaderMeta = false,
    minimalChrome = false,
    useContentCard = true,
}: AdminLayoutProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const sectionLabel = pathname?.split("/").filter(Boolean).slice(1).join(" / ") || "dashboard";
    const now = new Date();
    const stamp = now.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await adminDb.auth.getSession();
            if (!session) {
                router.push("/admin/login");
                return;
            }
            setLoading(false);
        };
        checkAuth();

        const {
            data: { subscription },
        } = adminDb.auth.onAuthStateChange((_event, session) => {
            if (!session) router.push("/admin/login");
        });

        return () => subscription.unsubscribe();
    }, [router]);

    useEffect(() => {
        setMobileNavOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!mobileNavOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMobileNavOpen(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [mobileNavOpen]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(145deg,#eef2f9_0%,#f7f9fc_45%,#edf2f8_100%)]">
                <div className="rounded-2xl border bg-white/70 backdrop-blur px-8 py-6 shadow-xl flex items-center gap-3 text-slate-700">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    Loading admin workspace...
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen relative overflow-x-clip ${
                minimalChrome
                    ? "bg-[#F8F9FA]"
                    : "bg-[linear-gradient(145deg,#eef2f9_0%,#f7f9fc_45%,#edf2f8_100%)]"
            }`}
        >
            {!minimalChrome && (
                <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_5%_10%,rgba(14,92,190,0.12),transparent_26%),radial-gradient(circle_at_94%_14%,rgba(214,146,59,0.12),transparent_25%)]" />
            )}
            <AdminSidebar className="hidden lg:flex fixed" />

            {mobileNavOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close navigation"
                        className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-[1px] lg:hidden"
                        onClick={() => setMobileNavOpen(false)}
                    />
                    <AdminSidebar
                        className="fixed z-50 lg:hidden w-[86vw] max-w-[320px]"
                        onNavigate={() => setMobileNavOpen(false)}
                        onRequestClose={() => setMobileNavOpen(false)}
                    />
                </>
            )}

            <div className="relative lg:ml-[300px] transition-all duration-300 min-h-screen">
                <header className="sticky top-0 z-40 px-4 md:px-8 pt-4 md:pt-6">
                    <div
                        className={`rounded-2xl border px-5 md:px-7 py-4 md:py-5 ${
                            minimalChrome
                                ? "border-slate-200 bg-white shadow-sm"
                                : "border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(9,26,57,0.08)]"
                        }`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="mb-3 lg:hidden">
                                    <button
                                        type="button"
                                        onClick={() => setMobileNavOpen((prev) => !prev)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                                    >
                                        {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                                        Menu
                                    </button>
                                </div>
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase text-primary">
                                    Al Nasir Motors Pakistan
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-1">{sectionLabel}</p>
                                <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-sm md:text-base text-slate-600 mt-1">
                                        {subtitle}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 flex-wrap md:justify-end">
                                {!hideHeaderMeta && (
                                    <>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-300/40 bg-emerald-100/70 text-emerald-900 text-xs font-semibold">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Secure Session
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300/40 bg-amber-100/70 text-amber-900 text-xs font-semibold">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {stamp}
                                        </div>
                                    </>
                                )}
                                {actions && <div className="flex items-center gap-3">{actions}</div>}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="px-4 md:px-8 pb-8 md:pb-10 pt-5 md:pt-6">
                    {useContentCard ? (
                        <div className="rounded-2xl border border-slate-200/70 bg-white/45 backdrop-blur-sm p-4 md:p-6 shadow-[0_8px_30px_rgba(9,26,57,0.06)]">
                            {children}
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

