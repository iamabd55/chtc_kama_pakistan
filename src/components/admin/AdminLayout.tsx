"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { adminDb } from "@/lib/supabase/adminClient";

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

const AdminLayout = ({
    children,
    title,
    subtitle,
    actions,
}: AdminLayoutProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/50">
            <AdminSidebar />
            <div className="ml-[260px] transition-all duration-300">
                {/* Sticky top header */}
                <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-display text-2xl font-bold text-foreground">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {actions && (
                            <div className="flex items-center gap-3">{actions}</div>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <main className="p-8">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
