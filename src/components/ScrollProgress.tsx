"use client";

import { useEffect, useRef } from "react";

const ScrollProgress = () => {
    const barRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let rafId = 0;

        const updateProgress = () => {
            rafId = 0;

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll <= 0 ? 0 : Math.min(window.scrollY / maxScroll, 1);

            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${progress})`;
            }
        };

        const queueUpdate = () => {
            if (rafId !== 0) {
                return;
            }

            rafId = window.requestAnimationFrame(updateProgress);
        };

        queueUpdate();
        window.addEventListener("scroll", queueUpdate, { passive: true });
        window.addEventListener("resize", queueUpdate);

        return () => {
            window.removeEventListener("scroll", queueUpdate);
            window.removeEventListener("resize", queueUpdate);

            if (rafId !== 0) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none">
            <div
                ref={barRef}
                className="h-full origin-left will-change-transform"
                style={{
                    transform: "scaleX(0)",
                    background: "linear-gradient(90deg, hsl(211, 99%, 32%), hsl(27, 63%, 43%), hsl(35, 80%, 55%))",
                }}
            />
        </div>
    );
};

export default ScrollProgress;
