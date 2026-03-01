import Link from "next/link";

const brands = [
    { name: "Kama", initial: "K", desc: "The flagship CHTC brand in Pakistan offering a comprehensive range of light and heavy commercial vehicles. Known for durability, fuel efficiency, and competitive pricing.", color: "from-primary to-kama-blue-dark" },
    { name: "Joylong", initial: "J", desc: "Premium passenger vans and minibuses designed for comfort, safety, and durability. Ideal for corporate, tourism, and public transport applications.", color: "from-accent to-kama-gold" },
    { name: "Kinwin", initial: "K", desc: "Specialised vehicles for niche industry needs, including custom-built solutions for logistics, construction, and municipal services.", color: "from-kama-navy to-primary" },
];

export default function BrandsPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">CHTC Brands</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Three brands, one commitment — delivering the right vehicle for every need in Pakistan.</p>
                </div>
            </section>
            <section className="py-20">
                <div className="container max-w-4xl space-y-8">
                    {brands.map((brand) => (
                        <div key={brand.name} className="bg-card border rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-lg transition-shadow">
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${brand.color} flex items-center justify-center shrink-0`}>
                                <span className="text-3xl font-display font-bold text-primary-foreground">{brand.initial}</span>
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-2xl text-foreground mb-2">{brand.name}</h3>
                                <p className="text-muted-foreground leading-relaxed">{brand.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
