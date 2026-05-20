"use client";

import Link from "next/link";
import Image from "next/image";
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
    X,
    MessageCircle,
    Users,
    UserCog,
    Activity,
    BarChart3,
    Sun,
    Moon,
} from "lucide-react";
import { adminDb } from "@/lib/supabase/adminClient";
import { cn } from "@/lib/utils";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import { clearAdminSession } from "@/hooks/useAdminSession";

interface AdminSidebarProps {
    className?: string;
    onNavigate?: () => void;
    onRequestClose?: () => void;
}

const menuGroups = [
    {
        label: "Admin",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
            { label: "Products", icon: Package, href: "/admin/products" },
            { label: "Categories", icon: FolderTree, href: "/admin/categories" },
            { label: "Dealers", icon: MapPin, href: "/admin/dealers" },
            { label: "Inquiries", icon: MessageSquare, href: "/admin/inquiries" },
            { label: "News & Posts", icon: Newspaper, href: "/admin/news" },
        ],
    },
    {
        label: "Analytics",
        items: [
            { label: "Overview", icon: Activity, href: "/admin/analytics" },
            { label: "Reports", icon: BarChart3, href: "/admin/analytics" },
        ],
    },
    {
        label: "People",
        items: [
            { label: "Career Posts", icon: Briefcase, href: "/admin/careers" },
            { label: "Applications", icon: FileText, href: "/admin/applications" },
            { label: "Team", icon: Users, href: "/admin/team" },
            { label: "Testimonials", icon: MessageCircle, href: "/admin/testimonials" },
        ],
    },
    {
        label: "Settings",
        items: [
            { label: "Site Settings", icon: Settings, href: "/admin/settings" },
            { label: "Users", icon: UserCog, href: "/admin/users" },
        ],
    },
];

const AdminSidebar = ({ className, onNavigate, onRequestClose }: AdminSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const { isDark, toggleTheme } = useAdminTheme();

    const isActive = (href: string) => {
        if (href === "/admin/dashboard") return pathname === "/admin/dashboard" || pathname === "/admin";
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        clearAdminSession();
        await adminDb.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <aside className={cn(
            "inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-[#1a1e2e] text-white border-r border-white/[0.06]",
            className
        )}>
            {/* Brand */}
            <div className="relative px-5 py-4 border-b border-white/[0.06]">
                {onRequestClose && (
                    <button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={onRequestClose}
                        className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                <div className="flex items-center gap-3 pr-8 lg:pr-0">
                    {/* Theme-aware logo — white version on dark bg, dark version on light bg */}
                    <div className="relative w-36 h-10 flex-shrink-0">
                        <Image
                            src={isDark ? "/images/al-nasir-logo-white.webp" : "/images/al-nasir-logo.webp"}
                            alt="Al Nasir Motors"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="relative flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {menuGroups.map((group) => (
                    <div key={group.label} className="mb-4">
                        <p className="px-5 mb-2 text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold">{group.label}</p>
                        <ul className="space-y-0.5 px-3">
                            {group.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href + item.label}>
                                        <Link href={item.href}
                                            onClick={onNavigate}
                                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${active
                                                ? "bg-[#e07a2f]/10 text-[#e07a2f]"
                                                : "text-white/55 hover:text-white/85 hover:bg-white/[0.04]"
                                                }`}
                                            prefetch={false}>
                                            {active && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#e07a2f]" />
                                            )}
                                            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                                            <span className="truncate text-[13px] font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom actions: theme toggle + sign out */}
            <div className="relative border-t border-white/[0.06] p-3 space-y-1">
                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {isDark ? (
                        <>
                            <Sun className="w-[18px] h-[18px] flex-shrink-0" />
                            <span>Light Mode</span>
                        </>
                    ) : (
                        <>
                            <Moon className="w-[18px] h-[18px] flex-shrink-0" />
                            <span>Dark Mode</span>
                        </>
                    )}
                </button>

                {/* Sign out */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
                >
                    <LogOut className="w-[18px] h-[18px]" />
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
