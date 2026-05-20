import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Briefcase, Building2, Upload, FileText, User, Mail, Phone, MessageSquare, DollarSign } from "lucide-react";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import type { CareerPost } from "@/lib/supabase/types";

export const revalidate = 300;

interface CareerDetailPageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ submitted?: string; error?: string; duplicate?: string }>;
}

export async function generateStaticParams() {
    const supabase = createPublicServerClient();
    const { data } = await supabase
        .from("career_posts")
        .select("id")
        .eq("is_active", true);

    return (data ?? [])
        .map((post) => post.id)
        .filter((id): id is string => Boolean(id))
        .map((id) => ({ id }));
}

export default async function CareerDetailPage({ params, searchParams }: CareerDetailPageProps) {
    const { id } = await params;
    const resolved = searchParams ? await searchParams : undefined;
    const isSubmitted = resolved?.submitted === "1";
    const hasError = resolved?.error === "1";
    const isDuplicate = resolved?.duplicate === "1";

    const supabase = createPublicServerClient();
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
            {/* ── Hero ── */}
            <section className="py-16 bg-kama-gradient">
                <div className="container max-w-5xl">
                    <Link href="/careers" className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors mb-5" prefetch={false}>
                        ← Back to Careers
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mt-1 mb-4">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/75">
                        <span className="inline-flex items-center gap-1.5"><Building2 className="w-4 h-4" />{job.department}</span>
                        <span className="text-white/30">·</span>
                        <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
                        <span className="text-white/30">·</span>
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />Deadline: {new Date(job.deadline).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</span>
                        <span className="uppercase tracking-wide text-xs font-semibold bg-white/15 px-2.5 py-1 rounded-full">{job.job_type}</span>
                        {job.salary_range && (
                            <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs"><DollarSign className="w-3.5 h-3.5" />{job.salary_range}</span>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Content + Apply ── */}
            <section className="py-12 md:py-16">
                <div className="container max-w-5xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">

                    {/* Left: Job Details */}
                    <div className="space-y-6">
                        <article className="bg-card border rounded-xl p-6 md:p-7">
                            <h2 className="font-display font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" /> Role Overview
                            </h2>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.description}</p>
                        </article>

                        {job.requirements.length > 0 && (
                            <article className="bg-card border rounded-xl p-6 md:p-7">
                                <h2 className="font-display font-bold text-xl text-foreground mb-3">Requirements</h2>
                                <ul className="space-y-2.5">
                                    {job.requirements.map((item, idx) => (
                                        <li key={idx} className="text-muted-foreground flex items-start gap-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
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
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )}
                    </div>

                    {/* Right: Apply Form */}
                    <aside className="bg-card border rounded-xl p-6 md:p-7 h-fit lg:sticky lg:top-24">
                        <h2 className="font-display font-bold text-xl text-foreground mb-1">Apply for this role</h2>
                        <p className="text-xs text-muted-foreground mb-5">Fill in your details below. All fields marked <span className="text-destructive font-semibold">*</span> are required.</p>

                        {/* Status banners */}
                        {isSubmitted && (
                            <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                                ✓ Your application has been submitted successfully. We&apos;ll be in touch!
                            </div>
                        )}
                        {hasError && (
                            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                                ✗ Submission failed. Please check all required fields and try again.
                            </div>
                        )}
                        {isDuplicate && (
                            <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                                ⚠ You have already applied for this position with this email address.
                            </div>
                        )}

                        <form method="post" action="/api/careers/apply" encType="multipart/form-data" className="space-y-4">
                            <input type="hidden" name="career_post_id" value={job.id} />

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label htmlFor="apply-name" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <User className="w-3.5 h-3.5" /> Full Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    id="apply-name"
                                    name="applicant_name"
                                    type="text"
                                    required
                                    placeholder="Muhammad Ali Khan"
                                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label htmlFor="apply-email" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Mail className="w-3.5 h-3.5" /> Email Address <span className="text-destructive">*</span>
                                </label>
                                <input
                                    id="apply-email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label htmlFor="apply-phone" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Phone className="w-3.5 h-3.5" /> Phone Number <span className="text-destructive">*</span>
                                </label>
                                <input
                                    id="apply-phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="+92 300 0000000"
                                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                />
                            </div>

                            {/* CV Upload */}
                            <div className="space-y-1.5">
                                <label htmlFor="apply-cv-file" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Upload className="w-3.5 h-3.5" /> Upload CV <span className="text-muted-foreground font-normal normal-case">(PDF, DOC, DOCX)</span>
                                </label>
                                <input
                                    id="apply-cv-file"
                                    name="cv_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-foreground text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                />
                            </div>

                            {/* CV URL */}
                            <div className="space-y-1.5">
                                <label htmlFor="apply-cv-url" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <FileText className="w-3.5 h-3.5" /> CV / Portfolio URL <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                                </label>
                                <input
                                    id="apply-cv-url"
                                    name="cv_url"
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                />
                                <p className="text-[11px] text-muted-foreground">Upload a file OR paste a link — at least one is required for your application.</p>
                            </div>

                            {/* Cover Letter */}
                            <div className="space-y-1.5">
                                <label htmlFor="apply-cover" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <MessageSquare className="w-3.5 h-3.5" /> Cover Letter <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                                </label>
                                <textarea
                                    id="apply-cover"
                                    name="cover_letter"
                                    rows={4}
                                    placeholder="Tell us why you're a great fit for this role…"
                                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-y"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-kama-blue-dark active:scale-[0.98] transition-all text-sm"
                            >
                                Submit Application →
                            </button>
                        </form>
                    </aside>
                </div>
            </section>
        </>
    );
}
