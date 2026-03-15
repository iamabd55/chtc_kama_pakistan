"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackNavigation() {
    const router = useRouter();
    const pathname = usePathname();

    const handleBack = () => {
        const referrer = document.referrer;

        if (referrer) {
            try {
                const referrerUrl = new URL(referrer);
                const isSameOrigin = referrerUrl.origin === window.location.origin;

                if (isSameOrigin) {
                    const target = `${referrerUrl.pathname}${referrerUrl.search}${referrerUrl.hash}`;

                    if (target && target !== pathname) {
                        router.push(target);
                        return;
                    }
                }
            } catch {
                // Ignore malformed referrer URLs and fall back to home.
            }
        }

        router.push("/");
    };

    return (
        <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="inline-flex h-9 w-9 items-center justify-center text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] hover:text-white transition-colors"
        >
            <ArrowLeft className="w-5 h-5" />
        </button>
    );
}