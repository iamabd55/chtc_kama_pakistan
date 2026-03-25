import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://www.alnasirmotors.com.pk";

const FALLBACK_OG_IMAGE_PATH = "/opengraph-image";

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

export const EFFECTIVE_SITE_URL = normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    FALLBACK_SITE_URL
);

export function absoluteUrl(pathname: string): string {
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${EFFECTIVE_SITE_URL}${path}`;
}

export const DEFAULT_OG_IMAGE = absoluteUrl(FALLBACK_OG_IMAGE_PATH);

type BuildPageMetadataInput = {
    title: string;
    description: string;
    path?: string;
    type?: "website" | "article";
    image?: string;
    imageAlt?: string;
};

export function buildPageMetadata({
    title,
    description,
    path = "/",
    type = "website",
    image,
    imageAlt = "Al Nasir Motors Pakistan",
}: BuildPageMetadataInput): Metadata {
    const imageUrl = image ?? DEFAULT_OG_IMAGE;

    return {
        title,
        description,
        alternates: {
            canonical: path,
        },
        openGraph: {
            type,
            locale: "en_PK",
            url: path,
            siteName: "Al Nasir Motors Pakistan",
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: imageAlt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}
