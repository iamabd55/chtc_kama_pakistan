import Link from "next/link";
import { Shield, Wrench, Phone, Calendar } from "lucide-react";

const services = [
    { icon: Wrench, title: "Spare Parts", desc: "Genuine spare parts available at all authorized Al Nasir Motors service centers nationwide." },
    { icon: Calendar, title: "Scheduled Maintenance", desc: "Regular maintenance schedules to keep your vehicle running at peak performance." },
    { icon: Shield, title: "Warranty", desc: "Comprehensive warranty coverage on all new Al Nasir Motors vehicles." },
    { icon: Phone, title: "Service Appointment", desc: "Book a service appointment online or call our helpline." },
];

interface AfterSalesPageProps {
    searchParams?: Promise<{ submitted?: string; error?: string; ref?: string }>;
}

export default async function AfterSalesPage({ searchParams }: AfterSalesPageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const isSubmitted = resolved?.submitted === "1";
    const hasError = resolved?.error === "1";
    const inquiryReference = resolved?.ref?.trim() ?? "";

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">After Sales</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto mb-3">Spare parts, scheduled maintenance, warranty information, and service appointments.</p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Driven by Al Nasir Motors
                    </p>
                </div>
            </section>
            <section className="py-20">
                <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((item) => (
                        <div key={item.title} className="bg-card border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                <item.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-display font-bold text-foreground mb-3">{item.title}</h3>
                            <p className="text-muted-foreground text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="py-16">
                <div className="container max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-10 items-start">
                        <aside className="rounded-3xl border bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-6 md:p-8 lg:sticky lg:top-24">
                            <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.25em] mb-3">Track & Support</p>
                            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground leading-tight mb-3">Service requests should never disappear into a form.</h2>
                            <p className="text-sm md:text-base text-muted-foreground leading-6 mb-6">
                                Every after-sales request gets a public reference so customers can check progress without calling first.
                            </p>

                            <div className="rounded-2xl bg-white/75 border p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Status flow</p>
                                <div className="space-y-2 text-sm text-slate-700">
                                    <p><span className="font-semibold text-emerald-700">Received</span> - request logged</p>
                                    <p><span className="font-semibold text-amber-700">In Review</span> - team checking details</p>
                                    <p><span className="font-semibold text-blue-700">Responded</span> - customer reply sent</p>
                                </div>
                            </div>

                            <a href="/track-inquiry" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-display font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-kama-blue-dark">
                                Track Service Request
                            </a>
                        </aside>

                        <div className="rounded-3xl border bg-card p-6 md:p-8 lg:p-10 shadow-sm">
                            <h2 className="font-display font-bold text-2xl text-foreground mb-4">Service & Parts Request</h2>

                            {isSubmitted && (
                                <div className="mb-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-800">
                                    <p className="font-semibold">Your request has been submitted.</p>
                                    {inquiryReference && <span className="mt-1 block font-semibold">Reference: {inquiryReference}</span>}
                                    <a href={`/track-inquiry${inquiryReference ? `?ref=${encodeURIComponent(inquiryReference)}` : ""}`} className="mt-2 inline-flex text-xs font-semibold uppercase tracking-wider text-green-900 underline underline-offset-4">
                                        Open tracker
                                    </a>
                                </div>
                            )}

                            {hasError && (
                                <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                                    We could not submit your request. Please try again.
                                </div>
                            )}

                            <form method="post" action="/api/inquiries/after-sales" className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input name="full_name" type="text" required placeholder="Full Name *" className="w-full px-4 py-3 border rounded-md bg-background text-foreground" />
                                    <input name="phone" type="tel" required placeholder="Phone Number *" className="w-full px-4 py-3 border rounded-md bg-background text-foreground" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input name="email" type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-md bg-background text-foreground" />
                                    <input name="city" type="text" required placeholder="City *" className="w-full px-4 py-3 border rounded-md bg-background text-foreground" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <select name="request_type" required defaultValue="" className="w-full px-4 py-3 border rounded-md bg-background text-foreground">
                                        <option value="" disabled>Request Type *</option>
                                        <option value="service">Service Request</option>
                                        <option value="parts">Spare Parts Inquiry</option>
                                    </select>
                                    <input name="product" type="text" placeholder="Vehicle / Model" className="w-full px-4 py-3 border rounded-md bg-background text-foreground" />
                                </div>
                                <textarea name="message" rows={4} placeholder="Issue / Parts Needed" className="w-full px-4 py-3 border rounded-md bg-background text-foreground" />

                                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors">
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-muted">
                <div className="container text-center">
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4">Need Service Support?</h2>
                    <p className="text-muted-foreground mb-6">Contact our after sales team or visit your nearest dealer.</p>
                    <Link href="/contact" prefetch={false} className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors">
                        Contact Us
                    </Link>
                </div>
            </section>
        </>
    );
}
