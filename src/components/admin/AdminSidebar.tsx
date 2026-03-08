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
    ChevronLeft,
    ChevronRight,
    FileText,
} from "lucide-react";
import { useState } from "react";
import { adminDb } from "@/lib/supabase/adminClient";
import Image from "next/image";

const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "Categories", icon: FolderTree, href: "/admin/categories" },
    { label: "Inquiries", icon: MessageSquare, href: "/admin/inquiries" },
    { label: "News & Posts", icon: Newspaper, href: "/admin/news" },
    { label: "Career Posts", icon: Briefcase, href: "/admin/careers" },
    { label: "Applications", icon: FileText, href: "/admin/applications" },
    { label: "Dealers", icon: MapPin, href: "/admin/dealers" },
    { label: "Site Settings", icon: Settings, href: "/admin/settings" },
];

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
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
        <aside
            className={`fixed top-0 left-0 h-screen bg-kama-navy flex flex-col transition-all duration-300 z-50 ${collapsed ? "w-[68px]" : "w-[260px]"
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                <Image
                    src="/images/logo-white.png"
                    alt="CHTC Kama"
                    width={32}
                    height={32}
                    className="h-8 w-auto flex-shrink-0"
                />
                {!collapsed && (
                    <span className="font-display text-primary-foreground text-lg font-bold tracking-wide truncate">
                        ADMIN
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1 px-2">
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group ${active
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                        }`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon
                                        className={`w-5 h-5 flex-shrink-0 ${active ? "" : "group-hover:text-accent"}`}
                                    />
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom controls */}
            <div className="border-t border-white/10 p-2 space-y-1">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-white/40 hover:text-white/70 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                    {!collapsed && <span className="text-xs">Collapse</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
