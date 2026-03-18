import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/supabase/types";

interface ContactPageProps {
    searchParams?: Promise<{
        submitted?: string;
        error?: string;
    }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const isSubmitted = resolved?.submitted === "1";
    const hasError = resolved?.error === "1";

    const supabase = await createClient();
    const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

    const settings = data as SiteSettings | null;
    const socialLinks = settings?.social_links && typeof settings.social_links === "object"
        ? (Object.entries(settings.social_links).filter(([, value]) => typeof value === "string" && value.trim().length > 0) as Array<[string, string]>)
        : [];

    const mapSrc = settings?.google_maps_embed || "https://maps.google.com/maps?q=Lahore%2C%20Pakistan&z=13&output=embed";

    const contactInfo = [
        {
            icon: MapPin,
            title: "Office Address",
            lines: [
                "Al Nasir Motors Pakistan",
                settings?.office_address || "Lahore, Punjab, Pakistan",
            ],
        },
        {
            icon: Phone,
            title: "Phone",
            lines: [settings?.office_phone || "+92 300 8665 060"],
        },
        {
            icon: Mail,
            title: "Email",
            lines: [
                settings?.support_email || "info@alnasirmotors.com.pk",
                settings?.sales_email || "sales@alnasirmotors.com.pk",
            ],
        },
        {
            icon: Clock,
            title: "Business Hours",
            lines: ["Mon – Fri: 9:00 AM – 6:00 PM", "Sat: 9:00 AM – 2:00 PM"],
        },
        {
            icon: MessageCircle,
            title: "WhatsApp",
            lines: [settings?.whatsapp_number || "+92 300 8665 060"],
        },
    ];

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Contact Us</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto mb-3">Get in touch with our team via form, phone, email, or WhatsApp.</p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Driven by Al Nasir Motors
                    </p>
                </div>
            </section>
            <section className="py-20">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-card border rounded-lg p-8">
                            <h2 className="font-display font-bold text-2xl text-foreground mb-6">Send us a Message</h2>
                            {isSubmitted && (
                                <div className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                                    Thanks. Your inquiry has been submitted and our team will contact you shortly.
                                </div>
                            )}
                            {hasError && (
                                <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                                    We could not submit your inquiry right now. Please try again.
                                </div>
                            )}
                            <form className="space-y-4" method="post" action="/api/inquiries/contact">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input name="full_name" type="text" placeholder="Full Name *" required className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                    <input name="email" type="email" placeholder="Email Address" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <input name="phone" type="tel" placeholder="Phone Number *" required className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                <input name="city" type="text" placeholder="City *" required className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                <select name="subject" className="w-full px-4 py-3 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="other">
                                    <option value="product">Product Inquiry</option>
                                    <option value="brochure">Brochure Request</option>
                                    <option value="service">After Sales Support</option>
                                    <option value="dealer">Dealer Inquiry</option>
                                    <option value="career">Career Inquiry</option>
                                    <option value="other">Other</option>
                                </select>
                                <textarea name="message" rows={4} placeholder="Your Message" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            {contactInfo.map((item) => (
                                <div key={item.title} className="flex gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-foreground mb-1">{item.title}</h3>
                                        {item.lines.map((line) => (
                                            <p key={line} className="text-muted-foreground text-sm">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {socialLinks.length > 0 && (
                                <div className="pt-2">
                                    <h3 className="font-display font-semibold text-foreground mb-2">Social Links</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {socialLinks.map(([platform, url]) => (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wide hover:bg-muted transition-colors"
                                            >
                                                {platform}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 bg-card border rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="font-display font-bold text-xl text-foreground">Office Map</h2>
                        </div>
                        <div className="relative aspect-[16/7] bg-muted">
                            <iframe
                                src={mapSrc}
                                className="w-full h-full"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Office map"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

