import { Briefcase, Mail, Users } from "lucide-react";

export default function CareersPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Careers</h1>
                    <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-3">
                        Build your future with CHTC Kama Pakistan. We are always looking for passionate professionals in sales, after-sales,
                        technical operations, and customer support.
                    </p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Drive Smart, Drive <span className="slogan-kama text-xs">KAMA</span>
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container max-w-4xl space-y-8">
                    <div className="bg-card border rounded-lg p-7 sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-display font-bold text-2xl text-foreground mb-2">No Current Openings</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We do not have any active vacancies at the moment. New opportunities are announced here as soon as positions
                                    become available across our commercial, technical, and support teams.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card border rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-5 h-5 text-primary" />
                                <h3 className="font-display font-bold text-lg text-foreground">Why Join CHTC Kama Pakistan</h3>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                At CHTC Kama Pakistan, we value ownership, teamwork, and continuous learning. Our people work on meaningful
                                projects that support businesses and transport networks across Pakistan. As we expand, we seek professionals
                                who are committed to quality, customer service, and long-term impact.
                            </p>
                        </div>

                        <div className="bg-card border rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Mail className="w-5 h-5 text-primary" />
                                <h3 className="font-display font-bold text-lg text-foreground">Share Your Profile</h3>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                You can still send your CV to our HR team for future consideration. When a suitable role opens, shortlisted
                                candidates will be contacted.
                            </p>
                            <a
                                href="mailto:info@chtckama.com.pk?subject=Career%20Application%20-%20CHTC%20Kama"
                                className="inline-flex px-5 py-2.5 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors"
                            >
                                Email Your CV
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
