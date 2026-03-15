const FALLBACK_SITE_URL = "https://www.chtckama.com.pk";

function normalizeSiteUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return FALLBACK_SITE_URL;

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
        const parsed = new URL(withProtocol);
        return parsed.toString().replace(/\/$/, "");
    } catch {
        return FALLBACK_SITE_URL;
    }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL);

export function absoluteUrl(pathname: string): string {
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${SITE_URL}${path}`;
}
