"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    MessageSquare,
    Newspaper,
    Briefcase,
    MapPin,
    Settings,
    LogOut,
    FileText,
    ShieldCheck,
    Sparkles,
    Rocket,
    X,
    Images,
    Award,
    Users,
    MessageCircleMore,
    UserCog,
} from "lucide-react";
import { adminDb } from "@/lib/supabase/adminClient";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    className?: string;
    onNavigate?: () => void;
    onRequestClose?: () => void;
}

const menuGroups = [
    {
        label: "Overview",
        items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", hint: "Overview" }],
    },
    {
        label: "Commerce",
        items: [
            { label: "Products", icon: Package, href: "/admin/products", hint: "Inventory" },
            { label: "Categories", icon: FolderTree, href: "/admin/categories", hint: "Taxonomy" },
            { label: "Dealers", icon: MapPin, href: "/admin/dealers", hint: "Network" },
        ],
    },
    {
        label: "Customer Ops",
        items: [
            { label: "Inquiries", icon: MessageSquare, href: "/admin/inquiries", hint: "Leads" },
            { label: "News & Posts", icon: Newspaper, href: "/admin/news", hint: "Content" },
        ],
    },
    {
        label: "People",
        items: [
            { label: "Career Posts", icon: Briefcase, href: "/admin/careers", hint: "Hiring" },
            { label: "Applications", icon: FileText, href: "/admin/applications", hint: "Recruitment" },
            { label: "Team", icon: Users, href: "/admin/team", hint: "Leadership" },
            { label: "Admin Users", icon: UserCog, href: "/admin/users", hint: "RBAC" },
            { label: "Site Settings", icon: Settings, href: "/admin/settings", hint: "Global" },
        ],
    },
    {
        label: "Content",
        items: [
            { label: "Client Logos", icon: Images, href: "/admin/clients", hint: "Trust" },
            { label: "Gallery", icon: Images, href: "/admin/gallery", hint: "Media" },
            { label: "Certifications", icon: Award, href: "/admin/certifications", hint: "Compliance" },
            { label: "Testimonials", icon: MessageCircleMore, href: "/admin/testimonials", hint: "Moderation" },
        ],
    },
];

const AdminSidebar = ({ className, onNavigate, onRequestClose }: AdminSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (href: string) => {
        if (href === "/admin/dashboard") return pathname === "/admin/dashboard" || pathname === "/admin";
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await adminDb.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <aside className={cn(
            "inset-y-0 left-0 z-50 w-[300px] flex flex-col bg-[linear-gradient(180deg,#06172f_0%,#0a1730_36%,#101521_100%)] text-white border-r border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]",
            className
        )}>
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.24),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(211,151,70,0.28),transparent_30%)]" />

            {/* Brand */}
            <div className="relative px-5 py-5 border-b border-white/10">
                {onRequestClose && (
                    <button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={onRequestClose}
                        className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors lg:hidden"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/55 font-semibold mb-2">Control Center</p>
                    <Image
                        src="/images/logo-white.png"
                        alt="CHTC Kama"
                        width={170}
                        height={52}
                        className="h-8 w-auto object-contain"
                    />
                    <p className="text-xs text-white/70 mt-2 tracking-[0.08em] uppercase">CHTC Kama Pakistan</p>
                    <p className="font-display text-lg font-bold tracking-wide mt-2">Admin Workspace</p>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/80">
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        Secure Session
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-emerald-200">LIVE</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="relative flex-1 py-4 overflow-y-auto">
                {menuGroups.map((group) => (
                    <div key={group.label} className="mb-4">
                        <p className="px-5 mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 font-semibold">{group.label}</p>
                        <ul className="space-y-1 px-3">
                            {group.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={onNavigate}
                                            className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${active
                                                ? "bg-gradient-to-r from-primary/90 to-primary text-white shadow-lg shadow-primary/20"
                                                : "text-white/70 hover:text-white hover:bg-white/8"
                                                }`}
                                        >
                                            <span className="flex items-center gap-3 min-w-0">
                                                <span className={`flex items-center justify-center w-8 h-8 rounded-lg border ${active ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10 group-hover:bg-white/10"}`}>
                                                    <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                                                </span>
                                                <span className="truncate text-sm font-medium">{item.label}</span>
                                            </span>
                                            <span className={`text-[10px] uppercase tracking-wide ${active ? "text-white/80" : "text-white/45 group-hover:text-white/70"}`}>
                                                {item.hint}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer actions */}
            <div className="relative border-t border-white/10 p-3">
                <div className="mb-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 flex items-center gap-2 text-xs text-white/75">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Premium Control Mode
                </div>
                <div className="mb-2 rounded-xl bg-primary/20 border border-primary/30 px-3 py-2 text-xs text-primary-foreground/90 flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5" />
                    Ready for Live Ops
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-white/85 bg-white/8 hover:bg-white/14 border border-white/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
