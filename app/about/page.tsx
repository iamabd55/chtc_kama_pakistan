import { Target, Eye, Award, Users } from "lucide-react";

const values = [
    { icon: Target, title: "Our Mission", desc: "To become Pakistan's most trusted commercial vehicle brand by delivering world-class products and after-sales support." },
    { icon: Eye, title: "Our Vision", desc: "Empowering businesses across Pakistan with reliable, efficient, and innovative transportation solutions." },
    { icon: Award, title: "Quality", desc: "ISO-certified manufacturing processes ensuring every vehicle meets international quality standards." },
    { icon: Users, title: "Our Team", desc: "A passionate team of automotive professionals dedicated to customer satisfaction and continuous improvement." },
];

export default function AboutPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">About CHTC Kama</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Company story, CHTC Group background, mission, and values.</p>
                </div>
            </section>
            <section className="py-20">
                <div className="container max-w-4xl">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                            CHTC Kama Pakistan is the official representative of China Hi-Tech Group Corporation (CHTC) — one of China&apos;s largest state-owned automotive conglomerates. With over 50 years of manufacturing heritage, CHTC produces a comprehensive range of commercial vehicles including light trucks, heavy trucks, vans, buses, and special-purpose vehicles.
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-lg mb-12">
                            In Pakistan, CHTC Kama is committed to delivering robust, fuel-efficient, and competitively priced commercial vehicles backed by a nationwide dealer and service network.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        {values.map((item) => (
                            <div key={item.title} className="bg-card border rounded-lg p-8">
                                <item.icon className="w-10 h-10 text-primary mb-4" />
                                <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
