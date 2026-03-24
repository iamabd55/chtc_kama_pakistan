"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProductsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Products error:", error);
    }, [error]);

    return (
        <section className="min-h-[60vh] flex items-center justify-center py-20">
            <div className="container max-w-lg text-center">
                <div className="bg-card border rounded-2xl p-10 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                        Could Not Load Products
                    </h2>
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                        We encountered an issue loading the product catalog. Please try
                        again or browse our other pages.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={reset}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-kama-blue-dark transition-colors"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border text-sm font-semibold hover:bg-muted transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
