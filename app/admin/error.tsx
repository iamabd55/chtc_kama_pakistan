"use client";

import { useEffect } from "react";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin panel error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border rounded-2xl p-8 text-center shadow-lg">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                    Admin Panel Error
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                    Something went wrong in the admin panel. Try reloading the page.
                </p>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={reset}
                        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-kama-blue-dark transition-colors"
                    >
                        Reload
                    </button>
                    <a
                        href="/admin/dashboard"
                        className="w-full py-2.5 rounded-lg border text-sm font-semibold hover:bg-muted transition-colors inline-block"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
