import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { CareerPost } from "@/lib/supabase/types";

interface CareerDetailPageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ submitted?: string; error?: string }>;
}

export default async function CareerDetailPage({ params, searchParams }: CareerDetailPageProps) {
    const { id } = await params;
    const resolved = searchParams ? await searchParams : undefined;
    const isSubmitted = resolved?.submitted === "1";
    const hasError = resolved?.error === "1";

    const supabase = await createClient();
    const { data } = await supabase
        .from("career_posts")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

    if (!data) notFound();

    const job = data as CareerPost;

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container max-w-5xl">
                    <Link href="/careers" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">
                        ← Back to Careers
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mt-3 mb-3">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/75">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                        <span className="uppercase tracking-wide bg-white/15 px-2 py-0.5 rounded-full">{job.job_type}</span>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container max-w-5xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
                    <div className="space-y-6">
                        <article className="bg-card border rounded-xl p-6 md:p-7">
                            <h2 className="font-display font-bold text-xl text-foreground mb-3">Role Overview</h2>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.description}</p>
                        </article>

                        {job.requirements.length > 0 && (
                            <article className="bg-card border rounded-xl p-6 md:p-7">
                                <h2 className="font-display font-bold text-xl text-foreground mb-3">Requirements</h2>
                                <ul className="space-y-2.5">
                                    {job.requirements.map((item, idx) => (
                                        <li key={idx} className="text-muted-foreground flex items-start gap-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )}

                        {job.responsibilities.length > 0 && (
                            <article className="bg-card border rounded-xl p-6 md:p-7">
                                <h2 className="font-display font-bold text-xl text-foreground mb-3">Responsibilities</h2>
                                <ul className="space-y-2.5">
                                    {job.responsibilities.map((item, idx) => (
                                        <li key={idx} className="text-muted-foreground flex items-start gap-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )}
                    </div>

                    <aside className="bg-card border rounded-xl p-6 md:p-7 h-fit lg:sticky lg:top-24">
                        <h2 className="font-display font-bold text-xl text-foreground mb-4">Apply for this role</h2>

                        {isSubmitted && (
                            <div className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                                Application submitted successfully.
                            </div>
                        )}

                        {hasError && (
                            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                                We could not submit your application. Please check required fields and try again.
                            </div>
                        )}

                        <form method="post" action="/api/careers/apply" className="space-y-3">
                            <input type="hidden" name="career_post_id" value={job.id} />

                            <input
                                name="applicant_name"
                                type="text"
                                required
                                placeholder="Full Name *"
                                className="w-full px-4 py-2.5 border rounded-md bg-background text-foreground"
                            />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="Email *"
                                className="w-full px-4 py-2.5 border rounded-md bg-background text-foreground"
                            />
                            <input
                                name="phone"
                                type="tel"
                                required
                                placeholder="Phone *"
                                className="w-full px-4 py-2.5 border rounded-md bg-background text-foreground"
                            />
                            <input
                                name="cv_file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="w-full px-4 py-2.5 border rounded-md bg-background text-foreground"
                            />
                            <input
                                name="cv_url"
                                type="url"
                                placeholder="CV URL (optional if file uploaded)"
                                className="w-full px-4 py-2.5 border rounded-md bg-background text-foreground"
                            />
                            <textarea
                                name="cover_letter"
                                rows={4}
                                placeholder="Cover Letter"
                                className="w-full px-4 py-2.5 border rounded-md bg-background text-foreground"
                            />

                            <button
                                type="submit"
                                className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-kama-blue-dark transition-colors"
                            >
                                Submit Application
                            </button>
                        </form>
                    </aside>
                </div>
            </section>
        </>
    );
}
