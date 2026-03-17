import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TeamMember, ClientLogo, Certification } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

interface AboutSectionPageProps {
    params: Promise<{ section: string }>;
}

const teamMembers = [
    { name: "Zaheer Ud Din Malik", role: "Chairman" },
    { name: "Muneeb Ibrahim", role: "CEO" },
    { name: "Shaukat Hayat", role: "Director" },
    { name: "M. Izhar Ul Haq", role: "Director" },
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
    const { section } = await params;
    const supabase = await createClient();

    if (!["team", "clients", "certifications"].includes(section)) {
        notFound();
    }

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4 capitalize">{section}</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">
                        {section === "team" && "Leadership team driving CHTC Kama Pakistan operations."}
                        {section === "clients" && "Trusted organizations and transport programs we serve."}
                        {section === "certifications" && "Compliance and quality certifications for our operations and products."}
                    </p>
                </div>
            </section>
            <section className="py-20">
                <div className="container max-w-4xl">
                    {section === "team" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {((await supabase
                                .from("team_members")
                                .select("*")
                                .eq("is_active", true)
                                .order("display_order")).data as TeamMember[] | null ?? teamMembers.map((m, idx) => ({
                                id: `fallback-${idx}`,
                                name: m.name,
                                role: m.role,
                                photo_url: null,
                                bio: null,
                                display_order: idx,
                                is_active: true,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                            }))).map((member) => (
                                <article key={member.name} className="rounded-xl border bg-card p-5">
                                    <h2 className="font-display font-bold text-lg text-foreground">{member.name}</h2>
                                    <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                                    {member.bio && <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>}
                                </article>
                            ))}
                        </div>
                    )}

                    {section === "clients" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {((await supabase
                                .from("client_logos")
                                .select("*")
                                .eq("is_active", true)
                                .order("display_order")).data as ClientLogo[] | null ?? clients.map((c, idx) => ({
                                id: `fallback-${idx}`,
                                name: c,
                                logo_url: "logo.png",
                                website_url: null,
                                display_order: idx,
                                is_active: true,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                            }))).map((client) => (
                                <article key={client.id} className="rounded-xl border bg-card p-5 flex items-center gap-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={getStorageUrl(client.logo_url)} alt={client.name} className="w-12 h-12 rounded-md object-cover bg-muted" />
                                    <p className="font-semibold text-foreground">{client.name}</p>
                                </article>
                            ))}
                        </div>
                    )}

                    {section === "certifications" && (
                        <div className="space-y-4">
                            {((await supabase
                                .from("certifications")
                                .select("*")
                                .eq("is_active", true)
                                .order("display_order")).data as Certification[] | null ?? certifications.map((c, idx) => ({
                                id: `fallback-${idx}`,
                                title: c.title,
                                thumbnail_url: c.file,
                                document_url: c.file,
                                description: null,
                                display_order: idx,
                                is_active: true,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                            }))).map((cert) => (
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
