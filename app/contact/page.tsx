import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const contactInfo = [
    { icon: MapPin, title: "Office Address", lines: ["CHTC Kama Pakistan", "Lahore, Punjab, Pakistan"] },
    { icon: Phone, title: "Phone", lines: ["+92 300 8665 060"] },
    { icon: Mail, title: "Email", lines: ["info@chtckama.com.pk", "sales@chtckama.com.pk"] },
    { icon: Clock, title: "Business Hours", lines: ["Mon – Fri: 9:00 AM – 6:00 PM", "Sat: 9:00 AM – 2:00 PM"] },
    { icon: MessageCircle, title: "WhatsApp", lines: ["+92 300 8665 060"] },
];

export default function ContactPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Contact Us</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto mb-3">Get in touch with our team via form, phone, email, or WhatsApp.</p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Drive Smart, Drive{" "}
                        <span className="slogan-kama text-xs">KAMA</span>
                    </p>
                </div>
            </section>
            <section className="py-20">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-card border rounded-lg p-8">
                            <h2 className="font-display font-bold text-2xl text-foreground mb-6">Send us a Message</h2>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                    <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                <select className="w-full px-4 py-3 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Select Subject</option>
                                    <option>Product Inquiry</option>
                                    <option>After Sales Support</option>
                                    <option>Dealer Inquiry</option>
                                    <option>Career Inquiry</option>
                                    <option>Other</option>
                                </select>
                                <textarea rows={4} placeholder="Your Message" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
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
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
