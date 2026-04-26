"use client";

import React from "react";
import type { PublicSiteSettings } from "@/hooks/useSiteSettings";

const WHATSAPP_NUMBER = "923008665060";
const DEFAULT_MESSAGE = "Hello! I'm interested in Al Nasir Motors Pakistan vehicles. Can you help me?";

interface WhatsAppButtonProps {
    settings?: PublicSiteSettings;
}

export default function WhatsAppButton({ settings }: WhatsAppButtonProps) {
    const whatsappRaw = settings?.whatsappNumber ?? WHATSAPP_NUMBER;
    const whatsappNumber = whatsappRaw.replace(/[^\d]/g, "") || WHATSAPP_NUMBER;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group fixed bottom-7 right-7 z-[9999] flex items-center gap-0 rounded-full bg-[linear-gradient(135deg,#25D366,#128C7E)] px-[14px] py-[14px] text-white no-underline shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hover:scale-105 hover:gap-2.5 hover:pl-[18px] hover:pr-6 hover:shadow-[0_8px_32px_rgba(37,211,102,0.45)]"
        >
            {/* WhatsApp SVG Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                style={{
                    width: "28px",
                    height: "28px",
                    flexShrink: 0,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                }}
            >
                <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.502 1.14 6.746 3.072 9.378L1.062 31.24l6.076-1.97A15.908 15.908 0 0 0 16.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.014-3.168 2.28-.846.18-1.952.324-5.674-1.22-4.762-1.974-7.824-6.806-8.062-7.12-.228-.314-1.918-2.554-1.918-4.872s1.214-3.456 1.644-3.928c.43-.472.94-.59 1.252-.59.312 0 .626.004.898.016.288.014.674-.11 1.054.804.39.94 1.33 3.244 1.446 3.48.118.236.196.51.04.824-.158.314-.236.51-.472.784-.236.274-.496.612-.708.822-.236.236-.482.492-.208.964.274.472 1.218 2.012 2.616 3.262 1.796 1.606 3.31 2.102 3.782 2.338.472.236.746.196 1.02-.118.274-.314 1.176-1.37 1.49-1.842.314-.472.628-.39 1.06-.236.43.158 2.734 1.29 3.206 1.526.472.236.784.354.902.548.116.196.116 1.12-.274 2.22z" />
            </svg>

            {/* Tooltip text on hover */}
            <span
                className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold tracking-[0.3px] opacity-0 transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:max-w-[200px] group-hover:opacity-100"
            >
                Chat with us
            </span>
        </a>
    );
}

