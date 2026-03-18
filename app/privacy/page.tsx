import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

type Section = {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
};

const sections: Section[] = [
    {
        title: "Scope and Commitment",
        paragraphs: [
            "This Privacy Policy explains how Al Nasir Motors Pakistan (we, us, or our) collects, uses, stores, and protects personal information when you use this website (the Site).",
            "This policy should be read together with our Terms of Service available on this Site.",
            "We are committed to handling your personal information in accordance with applicable laws of Pakistan.",
        ],
    },
    {
        title: "Information We Collect",
        paragraphs: [
            "We may collect information that you provide directly through forms, inquiries, emails, dealership requests, quotation requests, job applications, newsletter subscriptions, or other interactions with us.",
            "We may also receive relevant information from our affiliates, authorized dealers, business partners, social media channels, and service providers where permitted by law.",
        ],
        bullets: [
            "Identity details: name, age, date of birth, gender, and profile image (where applicable).",
            "Contact details: phone number, email address, residential or mailing address, and city.",
            "Product and service details: vehicle model of interest, quotation details, service/dealer preferences, and related communications.",
            "Technical and usage details: IP address, browser type, device information, visited pages, and interaction data collected through cookies or analytics tools.",
        ],
    },
    {
        title: "How We Use Your Information",
        paragraphs: [
            "We process personal information lawfully and fairly for legitimate business and customer support purposes.",
        ],
        bullets: [
            "To respond to your inquiries, provide quotes, and arrange dealership or after-sales follow-up.",
            "To improve our products, services, website content, and customer experience.",
            "To send administrative updates, service messages, and promotional communications (where you have consented or where otherwise legally permitted).",
            "To conduct analytics, internal reporting, record updates, and market research.",
            "To comply with legal obligations, enforce policies, and protect our rights.",
        ],
    },
    {
        title: "Promotional Communications and Your Choices",
        paragraphs: [
            "Where required, we will request your consent before sending promotional emails, SMS, or similar communications.",
            "You may opt out at any time by using the unsubscribe option in a message or by contacting us through the Contact page.",
            "Operational and service-related notices may still be sent where necessary for account, inquiry, order, or service management.",
        ],
    },
    {
        title: "Disclosure of Personal Information",
        paragraphs: [
            "We do not sell your personal information. We may share personal information only when necessary and legally permitted.",
        ],
        bullets: [
            "Within Al Nasir Motors Pakistan and affiliated entities for customer support and operational purposes.",
            "With authorized dealers, distributors, and service partners to fulfill your requests.",
            "With technology, hosting, analytics, and communication service providers acting on our instructions.",
            "With legal, tax, audit, and professional advisors where required.",
            "With regulators, courts, or authorities when required by law or to protect legal rights.",
        ],
    },
    {
        title: "Data Security",
        paragraphs: [
            "We implement reasonable technical and organizational safeguards to protect personal information against unauthorized access, alteration, disclosure, misuse, or loss.",
            "No transmission over the internet and no storage system can be guaranteed as 100% secure. While we take appropriate precautions, absolute security cannot be guaranteed.",
        ],
    },
    {
        title: "Cookies and Tracking",
        paragraphs: [
            "This Site uses cookies and similar technologies to improve functionality, understand user behavior, and enhance browsing experience.",
            "Cookies help us understand which pages are useful, measure traffic, and optimize website performance.",
            "You can manage or disable cookies from your browser settings. Some parts of the Site may not function properly if cookies are disabled.",
        ],
    },
    {
        title: "Third-Party Links",
        paragraphs: [
            "This Site may contain links to external websites that are not operated by us. We are not responsible for the content, security, or privacy practices of third-party sites.",
            "We encourage you to review the privacy policies of any third-party websites you visit.",
        ],
    },
    {
        title: "Data Retention",
        paragraphs: [
            "We retain personal information only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law.",
            "When data is no longer required, we take reasonable steps to securely delete or anonymize it.",
        ],
    },
    {
        title: "Policy Updates",
        paragraphs: [
            "We may revise this Privacy Policy from time to time. Any changes become effective when the updated version is posted on this page.",
            "We recommend reviewing this page periodically to stay informed about how we protect your information.",
        ],
    },
    {
        title: "Contact Us",
        paragraphs: [
            "If you have questions, concerns, or requests related to this Privacy Policy or your personal information, please contact us through the details provided on our Contact page.",
        ],
    },
];

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read how Al Nasir Motors Pakistan collects, uses, protects, and manages your personal information.",
    alternates: {
        canonical: "/privacy",
    },
    openGraph: {
        title: "Privacy Policy | Al Nasir Motors Pakistan",
        description: "Read how Al Nasir Motors Pakistan collects, uses, protects, and manages your personal information.",
        url: "/privacy",
        type: "article",
        images: [
            {
                url: absoluteUrl("/privacy/opengraph-image"),
                width: 1200,
                height: 630,
                alt: "Al Nasir Motors Pakistan Privacy Policy",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy | Al Nasir Motors Pakistan",
        description: "Read how Al Nasir Motors Pakistan collects, uses, protects, and manages your personal information.",
        images: [absoluteUrl("/privacy/opengraph-image")],
    },
};

export default function PrivacyPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Privacy Policy</h1>
                    <p className="text-primary-foreground/75 max-w-2xl mx-auto mb-3">
                        Learn how Al Nasir Motors Pakistan handles your information when you use our website.
                    </p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Driven by Al Nasir Motors
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container max-w-4xl">
                    <div className="bg-card border rounded-lg p-6 sm:p-8 md:p-10">
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-10">
                            <p>Established: March 15, 2026</p>
                            <p>Last updated: March 15, 2026</p>
                        </div>

                        <div className="space-y-10">
                            {sections.map((section) => (
                                <section key={section.title}>
                                    <h2 className="font-display font-bold text-2xl text-foreground mb-4">{section.title}</h2>

                                    {section.paragraphs ? (
                                        <div className="space-y-4">
                                            {section.paragraphs.map((paragraph) => (
                                                <p key={paragraph} className="text-muted-foreground leading-relaxed">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    ) : null}

                                    {section.bullets ? (
                                        <ul className="mt-4 space-y-3 list-disc pl-5">
                                            {section.bullets.map((bullet) => (
                                                <li key={bullet} className="text-muted-foreground leading-relaxed">
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
