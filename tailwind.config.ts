import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 — config is now CSS-native (see app/globals.css @theme block).
 *
 * This file is retained for tooling compatibility (e.g. editor IntelliSense,
 * shadcn CLI). It is NOT consumed at build time — all design tokens have been
 * migrated to @theme in globals.css.
 */
export default {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
} satisfies Config;
