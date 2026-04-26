import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Activity, Users, Settings } from "lucide-react";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import type { TeamMember, ClientLogo, Certification } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

export const revalidate = 300;

type TeamMemberWithTeam = TeamMember & {
    team?: {
        id: string;
        name: string;
        slug: string;
    } | null;
};

interface AboutSectionPageProps {
    params: Promise<{ section: string }>;
}

const teamMembers = [
    {
        name: "Mr. Bashir Uddin Malik",
        role: "Founder",
        photo_url: "/images/al-bcf/core-team/founder.webp",
        bio: "Pioneer automotive leader whose vision established the group and laid the foundation for nationwide dealership growth.",
    },
    {
        name: "Zaheer Ud Din Malik",
        role: "Chairman",
        photo_url: "/images/al-bcf/core-team/chairman.webp",
        bio: "Leads strategic direction and long-term growth of Al Nasir Motors Pakistan operations.",
    },
    {
        name: "Muneeb Ibrahim",
        role: "CEO",
        photo_url: "/images/al-bcf/core-team/ceo.webp",
        bio: "Oversees execution, operational performance, and business transformation across departments.",
    },
    {
        name: "Shaukat Hayat",
        role: "Director",
        photo_url: "/images/al-bcf/core-team/director-1-Shaukat-hayat.webp",
        bio: "Supports governance and enterprise management across core business units.",
    },
    {
        name: "M. Izhar Ul Haq",
        role: "Director Sales & Marketing",
        photo_url: "/images/al-bcf/core-team/director-2-M-Izhar-ul-haq.webp",
        bio: "Leads sales and marketing strategy, dealer engagement, and market expansion activities.",
    },
];

const clients = [
    {
        name: "NADRA",
        logo_url: "/images/al-bcf/nadra_logo.webp",
        website_url: null,
    },
    {
        name: "Punjab Police",
        logo_url: "/images/al-bcf/punjab-police-logo-png.webp",
        website_url: null,
    },
    {
        name: "HBL",
        logo_url: "/images/al-bcf/HBL-Device-Logo-sponsorship.webp",
        website_url: null,
    },
    {
        name: "Orient",
        logo_url: "/images/al-bcf/orient-logo.svg",
        website_url: null,
    },
];

const certifications = [
    { title: "ISO 9001:2015 (Quality Management)", description: "International standard for quality management systems." },
    { title: "PQR (Pakistan Quality Standards)", description: "Certified compliance with national automotive manufacturing standards." },
    { title: "Euro II / Euro IV Emission Standards", description: "Adherence to environmental protocols for commercial vehicles." },
    { title: "Health & Safety Compliance", description: "Workplace and operational safety certifications." },
];

const preferWebpUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith("/")) {
        return url.replace(/\.(png|jpe?g)$/i, ".webp");
    }

    return getStorageUrl(url);
};

export default async function AboutSectionPage({ params }: AboutSectionPageProps) {
        const resolveLogoUrl = (logoUrl: string) => (logoUrl.startsWith("/") ? logoUrl : getStorageUrl(logoUrl));

    const { section: rawSection } = await params;
    const supabase = createPublicServerClient();
    const isLeadershipRoute = rawSection === "leadership";

    const canonicalSection =
        rawSection === "leadership"
            ? "team"
            : rawSection === "quality"
                ? "certifications"
                : rawSection;

    const sectionTitle =
        rawSection === "leadership"
            ? "Leadership & Team"
            : rawSection === "quality"
                ? "Quality & Certifications"
                : canonicalSection;

    if (!["team", "clients", "certifications"].includes(canonicalSection)) {
        notFound();
    }

    const teamRows = (await supabase
        .from("team_members")
        .select("*, team:teams(id, name, slug)")
        .eq("is_active", true)
        .order("display_order")).data as TeamMemberWithTeam[] | null;

    const visibleTeamRows = isLeadershipRoute
        ? (teamRows || []).filter((member) => member.team?.slug === "leadership")
        : (teamRows || []);

    const teamFallback = teamMembers.map((m, idx) => ({
        id: `fallback-${idx}`,
        team_id: "fallback-leadership",
        name: m.name,
        role: m.role,
        photo_url: m.photo_url,
        bio: m.bio,
        display_order: idx,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));

    const teamData = visibleTeamRows.length > 0 ? visibleTeamRows : teamFallback;

    const clientRows = (await supabase
        .from("client_logos")
        .select("*")
        .eq("is_active", true)
        .order("display_order")).data as ClientLogo[] | null;

    const clientFallback = clients.map((c, idx) => ({
        id: `fallback-${idx}`,
        name: c.name,
        logo_url: c.logo_url,
        website_url: c.website_url,
        display_order: idx,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));

    const clientData = clientRows && clientRows.length > 0 ? clientRows : clientFallback;

    const certificationRows = (await supabase
        .from("certifications")
        .select("*")
        .eq("is_active", true)
        .order("display_order")).data as Certification[] | null;

    const certificationFallback = certifications.map((c, idx) => ({
        id: `fallback-${idx}`,
        title: c.title,
        thumbnail_url: null,
        document_url: null,
        description: c.description,
        display_order: idx,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));

    const certificationData =
        certificationRows && certificationRows.length > 0
            ? certificationRows
            : certificationFallback;

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4 capitalize">{sectionTitle}</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">
                        {canonicalSection === "team" && "Leadership team driving Al Nasir Motors Pakistan operations."}
                        {canonicalSection === "clients" && "Trusted organizations and transport programs we serve."}
                        {canonicalSection === "certifications" && "Compliance and quality certifications for our operations and products."}
                    </p>
                </div>
            </section>
            <section className="py-20">
                <div className="container max-w-4xl">
                    {canonicalSection === "team" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {teamData.map((member) => (
                                <article key={member.name} className="rounded-xl border bg-card p-5">
                                    {member.photo_url && (
                                        <Image
                                            src={preferWebpUrl(member.photo_url)}
                                            alt={member.name}
                                            width={260}
                                            height={325}
                                            sizes="(max-width: 640px) 100vw, 260px"
                                            className="w-full max-w-[260px] aspect-[4/5] object-cover rounded-lg mb-4"
                                         loading="lazy" />
                                    )}
                                    <h2 className="font-display font-bold text-lg text-foreground">{member.name}</h2>
                                    <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                                    {member.bio && <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>}
                                </article>
                            ))}
                        </div>
                    )}

                    {canonicalSection === "clients" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {clientData.map((client) => (
                                <article key={client.id} className="rounded-xl border bg-card p-5 flex items-center gap-4">
                                    <Image
                                        src={resolveLogoUrl(client.logo_url)}
                                        alt={client.name}
                                        width={48}
                                        height={48}
                                        sizes="48px"
                                        className="w-12 h-12 rounded-md object-cover bg-muted"
                                     loading="lazy" />
                                    <p className="font-semibold text-foreground">{client.name}</p>
                                </article>
                            ))}
                        </div>
                    )}

                    {canonicalSection === "certifications" && (
                        <div className="space-y-12">
                            {/* Commitment Statement */}
                            <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Commitment to Quality</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    At Al Nasir Motors, we adhere to the highest international standards for automotive excellence. Our operations are guided by rigorous quality control protocols to ensure every vehicle delivered meets Pakistan’s safety and environmental regulations.
                                </p>
                            </div>

                            {/* Certifications List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {certificationData.map((cert, index) => (
                                    <article key={cert.title || index} className="rounded-xl border bg-card p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-foreground text-lg mb-2">{cert.title}</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{cert.description || "Document available for verification."}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-[0.7rem] font-bold tracking-widest uppercase border border-green-200 shadow-sm">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Verified
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Process Section */}
                            <div className="mt-16">
                                <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">Our Compliance Process</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-8 rounded-xl border bg-card text-center hover:border-primary/30 transition-colors shadow-sm cursor-default">
                                        <div className="w-12 h-12 mx-auto bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-foreground mb-3 tracking-tight">Pre-Delivery Inspection</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Every vehicle undergoes a comprehensive 50-point quality check before release.</p>
                                    </div>
                                    <div className="p-8 rounded-xl border bg-card text-center hover:border-primary/30 transition-colors shadow-sm cursor-default">
                                        <div className="w-12 h-12 mx-auto bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-foreground mb-3 tracking-tight">Safety Testing</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Strict adherence to local and international road safety protocols.</p>
                                    </div>
                                    <div className="p-8 rounded-xl border bg-card text-center hover:border-primary/30 transition-colors shadow-sm cursor-default">
                                        <div className="w-12 h-12 mx-auto bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-foreground mb-3 tracking-tight">After-Sales Compliance</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Ensuring long-term operational compliance and scheduled maintenance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
