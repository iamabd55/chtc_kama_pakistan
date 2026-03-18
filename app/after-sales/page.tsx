import Link from "next/link";
import { Shield, Wrench, Phone, Calendar } from "lucide-react";

const services = [
    { icon: Wrench, title: "Spare Parts", desc: "Genuine spare parts available at all authorized Al Nasir Motors service centers nationwide." },
    { icon: Calendar, title: "Scheduled Maintenance", desc: "Regular maintenance schedules to keep your vehicle running at peak performance." },
    { icon: Shield, title: "Warranty", desc: "Comprehensive warranty coverage on all new Al Nasir Motors vehicles." },
    { icon: Phone, title: "Service Appointment", desc: "Book a service appointment online or call our helpline." },
];

interface AfterSalesPageProps {
    searchParams?: Promise<{ submitted?: string; error?: string }>;
}

export default async function AfterSalesPage({ searchParams }: AfterSalesPageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const isSubmitted = resolved?.submitted === "1";
    const hasError = resolved?.error === "1";

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
                <div className="container max-w-3xl">
                    <div className="bg-card border rounded-xl p-8">
                        <h2 className="font-display font-bold text-2xl text-foreground mb-4">Service & Parts Request</h2>

                        {isSubmitted && (
                            <div className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                                Your request has been submitted. Our after-sales team will contact you shortly.
                            </div>
                        )}

                        {hasError && (
                            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
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
            </section>
            <section className="py-16 bg-muted">
                <div className="container text-center">
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4">Need Service Support?</h2>
                    <p className="text-muted-foreground mb-6">Contact our after sales team or visit your nearest dealer.</p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors">
                        Contact Us
                    </Link>
                </div>
            </section>
        </>
    );
}
