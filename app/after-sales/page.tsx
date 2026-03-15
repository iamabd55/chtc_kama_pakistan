import Link from "next/link";
import { Shield, Wrench, Phone, Calendar } from "lucide-react";

const services = [
    { icon: Wrench, title: "Spare Parts", desc: "Genuine CHTC Kama spare parts available at all authorized service centers nationwide." },
    { icon: Calendar, title: "Scheduled Maintenance", desc: "Regular maintenance schedules to keep your vehicle running at peak performance." },
    { icon: Shield, title: "Warranty", desc: "Comprehensive warranty coverage on all new CHTC Kama vehicles." },
    { icon: Phone, title: "Service Appointment", desc: "Book a service appointment online or call our helpline." },
];

export default function AfterSalesPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">After Sales</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto mb-3">Spare parts, scheduled maintenance, warranty information, and service appointments.</p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Drive Smart, Drive{" "}
                        <span className="slogan-kama text-xs">KAMA</span>
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
