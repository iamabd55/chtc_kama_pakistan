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
        <div className="admin-dark min-h-screen flex items-center justify-center bg-[#111318] p-4">
            <div className="w-full max-w-md bg-[#1e2230] border border-white/[0.06] rounded-2xl p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <h2 className="font-display text-xl font-bold text-white/85 mb-2">
                    Admin Panel Error
                </h2>
                <p className="text-white/40 text-sm mb-6">
                    Something went wrong in the admin panel. Try reloading the page.
                </p>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={reset}
                        className="w-full py-2.5 rounded-lg bg-[#e07a2f] text-white text-sm font-semibold hover:bg-[#c96a25] transition-colors"
                    >
                        Reload
                    </button>
                    <a
                        href="/admin/dashboard"
                        className="w-full py-2.5 rounded-lg border border-white/[0.06] text-white/70 text-sm font-semibold hover:bg-white/[0.04] transition-colors inline-block"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
