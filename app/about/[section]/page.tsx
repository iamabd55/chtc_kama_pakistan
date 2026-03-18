import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TeamMember, ClientLogo, Certification } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

interface AboutSectionPageProps {
    params: Promise<{ section: string }>;
}

const teamMembers = [
    {
        name: "Mr. Bashir Uddin Malik",
        role: "Founder",
        photo_url: "/images/al-bcf/core-team/founder.png",
        bio: "Pioneer automotive leader whose vision established the group and laid the foundation for nationwide dealership growth.",
    },
    {
        name: "Zaheer Ud Din Malik",
        role: "Chairman",
        photo_url: "/images/al-bcf/core-team/chairman.png",
        bio: "Leads strategic direction and long-term growth of Al Nasir Motors Pakistan operations.",
    },
    {
        name: "Muneeb Ibrahim",
        role: "CEO",
        photo_url: "/images/al-bcf/core-team/ceo.png",
        bio: "Oversees execution, operational performance, and business transformation across departments.",
    },
    {
        name: "Shaukat Hayat",
        role: "Director",
        photo_url: "/images/al-bcf/core-team/director-1-Shaukat-hayat.png",
        bio: "Supports governance and enterprise management across core business units.",
    },
    {
        name: "M. Izhar Ul Haq",
        role: "Director Sales & Marketing",
        photo_url: "/images/al-bcf/core-team/director-2-M-Izhar-ul-haq.png",
        bio: "Leads sales and marketing strategy, dealer engagement, and market expansion activities.",
    },
];

const clients = [
    "Logistics Fleet Operators",
    "Municipal Transport Authorities",
    "Institutional Transport Programs",
    "Private Commercial Fleets",
];

const certifications = [
    { title: "ISO Quality Compliance", file: "/images/logo.png" },
    { title: "Vehicle Safety Certification", file: "/images/logo.png" },
    { title: "Emission Compliance Record", file: "/images/logo.png" },
];

export default async function AboutSectionPage({ params }: AboutSectionPageProps) {
    const { section: rawSection } = await params;
    const supabase = await createClient();

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
        .select("*")
        .eq("is_active", true)
        .order("display_order")).data as TeamMember[] | null;

    const teamFallback = teamMembers.map((m, idx) => ({
        id: `fallback-${idx}`,
        name: m.name,
        role: m.role,
        photo_url: m.photo_url,
        bio: m.bio,
        display_order: idx,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));

    const teamData = teamRows && teamRows.length > 0 ? teamRows : teamFallback;

    const clientRows = (await supabase
        .from("client_logos")
        .select("*")
        .eq("is_active", true)
        .order("display_order")).data as ClientLogo[] | null;

    const clientFallback = clients.map((c, idx) => ({
        id: `fallback-${idx}`,
        name: c,
        logo_url: "logo.png",
        website_url: null,
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
        thumbnail_url: c.file,
        document_url: c.file,
        description: null,
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
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={member.photo_url.startsWith("/") ? member.photo_url : getStorageUrl(member.photo_url)}
                                            alt={member.name}
                                            className="w-full max-w-[260px] aspect-[4/5] object-cover rounded-lg mb-4"
                                        />
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
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={getStorageUrl(client.logo_url)} alt={client.name} className="w-12 h-12 rounded-md object-cover bg-muted" />
                                    <p className="font-semibold text-foreground">{client.name}</p>
                                </article>
                            ))}
                        </div>
                    )}

                    {canonicalSection === "certifications" && (
                        <div className="space-y-4">
                            {certificationData.map((cert) => (
                                <article key={cert.title} className="rounded-xl border bg-card p-5 flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="font-semibold text-foreground">{cert.title}</h2>
                                        <p className="text-sm text-muted-foreground">{cert.description || "Document available for verification."}</p>
                                    </div>
                                    <Link
                                        href={cert.document_url || cert.thumbnail_url || "/images/logo.png"}
                                        target="_blank"
                                        className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-muted transition-colors"
                                    >
                                        Download
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
