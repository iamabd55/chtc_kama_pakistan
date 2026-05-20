"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminSidebar from "./AdminSidebar";
import { adminDb } from "@/lib/supabase/adminClient";
import { AdminThemeProvider, useAdminTheme } from "@/hooks/useAdminTheme";
import { useAdminSession, clearAdminSession } from "@/hooks/useAdminSession";
import {
    Menu,
    X,
    Bell,
    Search,
    LayoutDashboard,
    Package,
    MapPin,
    MessageSquare,
    MoreHorizontal,
    Sun,
    Moon,
    Settings,
    LogOut,
} from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
    title: ReactNode;
    subtitle?: string;
    actions?: ReactNode;
    hideHeaderMeta?: boolean;
    minimalChrome?: boolean;
    useContentCard?: boolean;
}

const bottomNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "Dealers", icon: MapPin, href: "/admin/dealers" },
    { label: "Inquiries", icon: MessageSquare, href: "/admin/inquiries" },
];

/* ── Search Overlay ─────────────────────────────────────── */
const adminSearchLinks = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Products", href: "/admin/products" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Dealers", href: "/admin/dealers" },
    { label: "Inquiries", href: "/admin/inquiries" },
    { label: "News & Posts", href: "/admin/news" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Career Posts", href: "/admin/careers" },
    { label: "Applications", href: "/admin/applications" },
    { label: "Team", href: "/admin/team" },
    { label: "Testimonials", href: "/admin/testimonials" },
    { label: "Site Settings", href: "/admin/settings" },
    { label: "Users", href: "/admin/users" },
];

function SearchOverlay({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const results = query.trim()
        ? adminSearchLinks.filter((l) =>
            l.label.toLowerCase().includes(query.toLowerCase())
        )
        : adminSearchLinks;

    useEffect(() => {
        inputRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close search"
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed top-[10vh] left-1/2 -translate-x-1/2 z-[70] w-full max-w-lg px-4">
                <div className="rounded-2xl border border-white/[0.08] bg-[#1e2230] shadow-2xl overflow-hidden">
                    {/* Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                        <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search admin pages…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && results.length > 0) {
                                    router.push(results[0].href);
                                    onClose();
                                }
                            }}
                            className="flex-1 bg-transparent text-sm text-white/85 placeholder:text-white/30 outline-none"
                        />
                        <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono text-white/40">
                            ESC
                        </kbd>
                    </div>
                    {/* Results */}
                    <div className="max-h-72 overflow-y-auto py-2">
                        {results.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-white/30">
                                No pages found
                            </p>
                        ) : (
                            results.map((item) => (
                                <button
                                    key={item.href}
                                    type="button"
                                    onClick={() => { router.push(item.href); onClose(); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white/90 transition-colors text-left"
                                >
                                    <span className="w-5 h-5 rounded bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white/30">
                                        {item.label[0]}
                                    </span>
                                    {item.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ── Inner layout (uses context) ────────────────────────── */
function AdminLayoutInner({
    children,
    title,
    subtitle,
    actions,
    hideHeaderMeta = false,
    useContentCard = true,
}: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isDark, toggleTheme } = useAdminTheme();
    useAdminSession(); // enforce 1-hour session expiry
    const [loading, setLoading] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [bellOpen, setBellOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);

    const sectionLabel = pathname?.split("/").filter(Boolean).slice(1).join(" / ") || "dashboard";

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await adminDb.auth.getSession();
            if (!session) { router.push("/admin/login"); return; }
            setLoading(false);
        };
        checkAuth();
        const { data: { subscription } } = adminDb.auth.onAuthStateChange((_event, session) => {
            if (!session) router.push("/admin/login");
        });
        return () => subscription.unsubscribe();
    }, [router]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
            if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
        setMobileNavOpen(false);
        setBellOpen(false);
        setAvatarOpen(false);
    }, [pathname]);

    // Global ⌘K / Ctrl+K shortcut
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!mobileNavOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileNavOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }, [mobileNavOpen]);

    const isBottomNavActive = (href: string) => {
        if (href === "/admin/dashboard") return pathname === "/admin/dashboard" || pathname === "/admin";
        return pathname.startsWith(href);
    };

    if (loading) {
        return (
            <div className="admin-dark flex items-center justify-center min-h-screen bg-[#111318]">
                <div className="rounded-xl bg-[#1e2230] border border-white/[0.06] px-8 py-6 flex items-center gap-3 text-white/70">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#e07a2f] border-t-transparent" />
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dark min-h-screen bg-[#111318] text-[#e4e7ec]">
            {/* Search overlay */}
            {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

            {/* Desktop sidebar */}
            <AdminSidebar className="hidden lg:flex fixed" />

            {/* Mobile sidebar drawer */}
            {mobileNavOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close navigation"
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileNavOpen(false)}
                    />
                    <AdminSidebar
                        className="fixed z-50 lg:hidden w-[280px] max-w-[85vw] animate-in slide-in-from-left duration-200"
                        onNavigate={() => setMobileNavOpen(false)}
                        onRequestClose={() => setMobileNavOpen(false)}
                    />
                </>
            )}

            <div className="relative lg:ml-[260px] transition-all duration-300 min-h-screen pb-[68px] lg:pb-0">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-[#111318]/95 backdrop-blur-md border-b border-white/[0.06]">
                    <div className="flex items-center justify-between px-4 md:px-6 h-14 gap-3">
                        {/* Left: hamburger + mobile logo + search trigger */}
                        <div className="flex items-center gap-2 min-w-0">
                            <button
                                type="button"
                                onClick={() => setMobileNavOpen((prev) => !prev)}
                                className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
                            >
                                {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>

                            {/* Mobile logo — logo only, theme-aware */}
                            <Link href="/admin/dashboard" className="lg:hidden flex items-center flex-shrink-0" prefetch={false}>
                                <div className="relative h-7 w-28">
                                    <Image
                                        src={isDark ? "/images/al-nasir-logo-white.webp" : "/images/al-nasir-logo.webp"}
                                        alt="Al Nasir Motors"
                                        fill
                                        className="object-contain object-left"
                                        priority
                                    />
                                </div>
                            </Link>

                            {/* Search trigger — desktop full bar, mobile icon */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 w-56 text-sm text-white/40 hover:bg-white/[0.06] hover:border-white/[0.1] transition-colors"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span className="text-[13px]">Search anything…</span>
                                <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono">⌘ K</kbd>
                            </button>
                        </div>

                        {/* Right: theme toggle + bell + avatar */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Mobile search icon */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-[18px] h-[18px]" />
                            </button>

                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                            </button>

                            {/* Bell with dropdown */}
                            <div ref={bellRef} className="relative">
                                <button
                                    onClick={() => { setBellOpen(o => !o); setAvatarOpen(false); }}
                                    className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                                    aria-label="Notifications"
                                >
                                    <Bell className="w-[18px] h-[18px]" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e07a2f]" />
                                </button>
                                {bellOpen && (
                                    <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-white/[0.08] bg-[#1e2230] shadow-2xl overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                                            <span className="text-sm font-semibold text-white/85">Notifications</span>
                                            <button onClick={() => setBellOpen(false)} className="text-[11px] text-[#e07a2f] hover:underline font-medium">Clear all</button>
                                        </div>
                                        <div className="divide-y divide-white/[0.04]">
                                            {[
                                                { msg: "New inquiry from Abdul Rehman", time: "2 min ago", dot: "bg-[#e07a2f]" },
                                                { msg: "Product \'W-Series\' was updated", time: "1 hr ago", dot: "bg-blue-400" },
                                                { msg: "New job application received", time: "3 hrs ago", dot: "bg-emerald-400" },
                                            ].map((n, i) => (
                                                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                                                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                                                    <div className="min-w-0">
                                                        <p className="text-[13px] text-white/75 leading-snug">{n.msg}</p>
                                                        <p className="text-[11px] text-white/30 mt-0.5">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2.5 border-t border-white/[0.06]">
                                            <Link href="/admin/inquiries" onClick={() => setBellOpen(false)} className="text-[12px] text-[#e07a2f] hover:underline font-medium" prefetch={false}>
                                                View all inquiries →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Avatar with dropdown */}
                            <div ref={avatarRef} className="relative flex items-center gap-2 pl-2 border-l border-white/[0.06]">
                                <button
                                    onClick={() => { setAvatarOpen(o => !o); setBellOpen(false); }}
                                    className="flex items-center gap-2 rounded-lg hover:bg-white/[0.04] px-1.5 py-1 transition-colors"
                                    aria-label="User menu"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#e07a2f] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        AM
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium text-white/70">Admin</span>
                                </button>
                                {avatarOpen && (
                                    <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-white/[0.08] bg-[#1e2230] shadow-2xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-white/[0.06]">
                                            <p className="text-sm font-semibold text-white/85">Admin</p>
                                            <p className="text-[11px] text-white/35 mt-0.5">Al Nasir Motors</p>
                                        </div>
                                        <div className="py-1">
                                            <Link href="/admin/settings" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/65 hover:bg-white/[0.04] hover:text-white/85 transition-colors" prefetch={false}>
                                                <Settings className="w-4 h-4" /> Settings
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    setAvatarOpen(false);
                                                    clearAdminSession();
                                                    await adminDb.auth.signOut();
                                                    router.push("/admin/login");
                                                }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto flex w-full max-w-[1500px] flex-col">
                    {/* Page Header */}
                    <div className="px-4 md:px-6 pt-5 md:pt-6 pb-1">
                        {!hideHeaderMeta && (
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#e07a2f] font-semibold mb-1">
                                {sectionLabel.replace(/\//g, " · ").toUpperCase()} management
                            </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h1 className="font-display text-2xl md:text-[32px] font-extrabold text-white leading-tight tracking-tight">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-sm text-white/40 mt-0.5 max-w-2xl">{subtitle}</p>
                                )}
                            </div>
                            {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="px-4 md:px-6 pb-8 pt-4">
                        {useContentCard ? (
                            <div className="rounded-xl border border-white/[0.06] bg-[#1e2230]/50 p-3 sm:p-4 md:p-5">
                                {children}
                            </div>
                        ) : children}
                    </main>

                    {/* Footer */}
                    <footer className="px-4 md:px-6 pb-6 mt-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-white/[0.04] text-[11px] text-white/25">
                            <p>© 2026 Al Nasir Motors. All rights reserved.</p>
                            <p>Crafted with <span className="text-[#e07a2f]">♥</span> by Al Nasir Motors Digital Team</p>
                        </div>
                    </footer>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="admin-bottom-nav lg:hidden">
                {bottomNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={isBottomNavActive(item.href) ? "active" : ""}
                        prefetch={false}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
                <button
                    onClick={() => setMobileNavOpen(true)}
                >
                    <MoreHorizontal className="w-5 h-5" />
                    <span>More</span>
                </button>
            </nav>
        </div>
    );
}

/* ── Public export: wraps inner layout in the Provider ── */
const AdminLayout = (props: AdminLayoutProps) => (
    <AdminThemeProvider>
        <AdminLayoutInner {...props} />
    </AdminThemeProvider>
);

export default AdminLayout;
