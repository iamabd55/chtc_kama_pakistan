import type { Metadata } from "next";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

// Admin route group layout — intentionally minimal.
// The public Header/Footer/WhatsApp are excluded via ConditionalLayout
// in the root app/layout.tsx based on the /admin path prefix.
export default function AdminAreaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `(function(){try{var t=localStorage.getItem('admin-theme')||'light';if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-admin-theme',t);}}catch(e){}})();`,
                }}
            />
            {children}
        </>
    );
}
