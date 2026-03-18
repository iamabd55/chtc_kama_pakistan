import Link from "next/link";
import { Briefcase, MapPin, CalendarDays, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { CareerPost } from "@/lib/supabase/types";

export default async function CareersPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("career_posts")
        .select("*")
        .eq("is_active", true)
        .order("deadline", { ascending: true });

    const jobs = (data ?? []) as CareerPost[];

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Careers</h1>
                    <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-3">
                        Build your future with Al Nasir Motors Pakistan. We are always looking for passionate professionals in sales, after-sales,
                        technical operations, and customer support.
                    </p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Driven by Al Nasir Motors
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container max-w-4xl space-y-8">
                    {jobs.length === 0 ? (
                        <div className="bg-card border rounded-lg p-7 sm:p-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-2xl text-foreground mb-2">No Current Openings</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We do not have active vacancies right now. New opportunities will be listed here once posted by HR.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <article key={job.id} className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div>
                                            <h2 className="font-display font-bold text-2xl text-foreground mb-1">{job.title}</h2>
                                            <p className="text-sm text-muted-foreground">{job.department}</p>
                                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                                <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                                <span className="uppercase tracking-wide font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{job.job_type}</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/careers/${job.id}`}
                                            className="inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-kama-blue-dark transition-colors"
                                        >
                                            View & Apply
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-primary" />
                            <h3 className="font-display font-bold text-lg text-foreground">Why Join Al Nasir Motors Pakistan</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Our teams work on commercial transport solutions across Pakistan, with a strong focus on quality, ownership, and customer impact.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

