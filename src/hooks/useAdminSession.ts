"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminDb } from "@/lib/supabase/adminClient";
import { toast } from "@/hooks/use-toast";

const SESSION_KEY = "admin_session_start";
const SESSION_DURATION_MS = 60 * 60 * 1000;      // 1 hour
const WARN_BEFORE_MS = 5 * 60 * 1000;             // warn at 55 min mark
const CHECK_INTERVAL_MS = 30 * 1000;              // check every 30 s

/** Call this on every admin page (inside AdminLayout) to enforce a 1-hour session. */
export function useAdminSession() {
    const router = useRouter();
    const warnedRef = useRef(false);

    useEffect(() => {
        const expireSession = async () => {
            localStorage.removeItem(SESSION_KEY);
            await adminDb.auth.signOut();
            toast({
                title: "Session expired",
                description: "You have been signed out after 1 hour for security.",
                variant: "destructive",
            });
            router.push("/admin/login");
        };

        const checkSession = () => {
            const startStr = localStorage.getItem(SESSION_KEY);
            if (!startStr) return; // no timestamp means not tracked yet — leave Supabase to handle it

            const elapsed = Date.now() - parseInt(startStr, 10);

            // Hard expiry — sign out
            if (elapsed >= SESSION_DURATION_MS) {
                expireSession();
                return;
            }

            // 5-minute warning — show once
            if (!warnedRef.current && elapsed >= SESSION_DURATION_MS - WARN_BEFORE_MS) {
                warnedRef.current = true;
                const remaining = Math.ceil((SESSION_DURATION_MS - elapsed) / 60000);
                toast({
                    title: "Session expiring soon",
                    description: `Your session will expire in ${remaining} minute${remaining !== 1 ? "s" : ""}. Save your work.`,
                });
            }
        };

        // Run immediately on mount
        checkSession();

        // Then keep checking every 30 seconds
        const interval = setInterval(checkSession, CHECK_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [router]);
}

/** Call this immediately after a successful login to stamp the session start time. */
export function stampAdminSession() {
    localStorage.setItem(SESSION_KEY, Date.now().toString());
}

/** Call this on manual logout to clear the session stamp. */
export function clearAdminSession() {
    localStorage.removeItem(SESSION_KEY);
}
