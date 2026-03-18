import type { Metadata } from "next";

type Section = {
    title: string;
    paragraphs: string[];
};

const sections: Section[] = [
    {
        title: "Acceptance of Terms",
        paragraphs: [
            "By accessing or using this website (the Site), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use this Site.",
            "These terms govern your relationship with Al Nasir Motors Pakistan (the Company, we, us, or our) in connection with your use of this Site.",
        ],
    },
    {
        title: "Site Operator",
        paragraphs: [
            "This Site is operated by Al Nasir Motors Pakistan for users in Pakistan. Product specifications, pricing, and availability may vary and may be updated without prior notice.",
            "For official correspondence regarding these terms, please use the contact channels listed on our Contact page.",
        ],
    },
    {
        title: "Intellectual Property",
        paragraphs: [
            "All materials on this Site, including text, graphics, images, logos, videos, layout, and software, are protected by copyright, trademark, and other intellectual property laws.",
            "You may not copy, reproduce, modify, republish, distribute, transmit, display, sell, or exploit any content from this Site for commercial use without prior written consent from the Company.",
            "Limited personal, non-commercial use is permitted only if all ownership notices remain intact and the source is acknowledged.",
        ],
    },
    {
        title: "Disclaimer and Limitation of Liability",
        paragraphs: [
            "The content on this Site is provided for general information purposes only. While we aim to keep information accurate and current, we make no express or implied warranties regarding completeness, accuracy, reliability, merchantability, fitness for a particular purpose, or non-infringement.",
            "To the maximum extent permitted by applicable law, the Company is not liable for any direct, indirect, incidental, special, or consequential loss or damage arising from your use of, or inability to use, this Site.",
            "We are not responsible for loss caused by malware, viruses, distributed denial-of-service attacks, or other technically harmful material that may affect your devices, software, data, or systems.",
            "Any third-party links are provided for convenience only. We do not control and are not responsible for the content, policies, or practices of third-party websites.",
        ],
    },
    {
        title: "Business and Consumer Use",
        paragraphs: [
            "If you use this Site for business purposes, you acknowledge that we are not liable for loss of profit, revenue, contracts, anticipated savings, goodwill, or business opportunity.",
            "If you are a consumer, you agree to use this Site for lawful and personal purposes only and not for unauthorized commercial activity.",
        ],
    },
    {
        title: "Changes to Terms and Site Operations",
        paragraphs: [
            "We may revise these Terms of Service, the Privacy Policy, and other Site policies at any time. Updated versions become effective when posted on this page.",
            "We may modify, suspend, or discontinue any part of this Site at any time, including for maintenance, technical updates, security reasons, or operational requirements.",
        ],
    },
    {
        title: "Governing Law and Jurisdiction",
        paragraphs: [
            "These Terms of Service are governed by the laws of Pakistan. Any dispute or claim arising out of or in connection with this Site will be subject to the exclusive jurisdiction of the courts of Pakistan.",
            "This Site is intended for users in Pakistan. We make no representation that the content is appropriate or available in other jurisdictions.",
        ],
    },
];

export const metadata: Metadata = {
    title: "Terms of Service | Al Nasir Motors Pakistan",
    description: "Read the Terms of Service for Al Nasir Motors Pakistan website usage, intellectual property, disclaimers, and governing law.",
};

export default function TermsPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Terms of Service</h1>
                    <p className="text-primary-foreground/75 max-w-2xl mx-auto mb-3">
                        Please review these terms carefully before using the Al Nasir Motors Pakistan website.
                    </p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Driven by Al Nasir Motors
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container max-w-4xl">
                    <div className="bg-card border rounded-lg p-6 sm:p-8 md:p-10">
                        <p className="text-sm text-muted-foreground mb-8">Effective date: March 15, 2026</p>

                        <div className="space-y-10">
                            {sections.map((section) => (
                                <section key={section.title}>
                                    <h2 className="font-display font-bold text-2xl text-foreground mb-4">{section.title}</h2>
                                    <div className="space-y-4">
                                        {section.paragraphs.map((paragraph) => (
                                            <p key={paragraph} className="text-muted-foreground leading-relaxed">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                If you need clarification regarding these terms, please contact us through the details provided on the Contact page.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
