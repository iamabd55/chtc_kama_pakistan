"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AdminTheme = "dark" | "light";
const STORAGE_KEY = "admin-theme";

interface AdminThemeContextValue {
    theme: AdminTheme;
    isDark: boolean;
    toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue>({
    theme: "dark",
    isDark: true,
    toggleTheme: () => {},
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<AdminTheme>("dark");
    const [mounted, setMounted] = useState(false);

    // Read from localStorage once on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as AdminTheme | null;
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
        }
        setMounted(true);
    }, []);

    // Sync to localStorage + html attribute whenever theme changes
    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, theme);
        document.documentElement.setAttribute("data-admin-theme", theme);
    }, [theme, mounted]);

    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return (
        <AdminThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme }}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export function useAdminTheme() {
    return useContext(AdminThemeContext);
}
