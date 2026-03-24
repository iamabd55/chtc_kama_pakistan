import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const brands = [
    {
        name: "Kama",
        slug: "kama",
        logo: "/images/kama-round.png",
        desc: "Flagship CHTC commercial vehicle brand in Pakistan with full local lineup and support.",
    },
    {
        name: "Kinwin",
        slug: "kinwin",
        logo: "/images/kinwin logo.jpg",
        desc: "Passenger bus-focused platform for fleet, labor transport, and intercity operations.",
    },
    {
        name: "Joylong",
        slug: "joylong",
        logo: "/images/joylong-logo.png",
        desc: "Joylong has a dedicated official Pakistan website for complete product information and updates.",
    },
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
                        <Link
                            key={brand.name}
                            href={`/brands/${brand.slug}`}
                            className="group bg-card border rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-lg transition-shadow"
                        >
                            <div className="bg-muted rounded-xl border w-32 h-20 p-3 flex items-center justify-center shrink-0">
                                <Image
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    width={128}
                                    height={56}
                                    className="w-auto h-10 object-contain"
                                    unoptimized
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-display font-bold text-2xl text-foreground mb-2">{brand.name}</h3>
                                <p className="text-muted-foreground leading-relaxed">{brand.desc}</p>
                            </div>
                            <div className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:translate-x-0.5 transition-transform">
                                {brand.slug === "joylong" ? "Visit Official Website" : "Explore"}
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
