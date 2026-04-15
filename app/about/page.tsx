import Image from "next/image";
import { Award, Factory, Globe2, Leaf, ShieldCheck, TrendingUp } from "lucide-react";

const highlights = [
    {
        icon: Globe2,
        title: "Global Industrial Heritage",
        desc: "KAMA Auto is a core enterprise under SINOMACH, a Fortune Global 500 group directly overseen by the central government of China.",
    },
    {
        icon: Factory,
        title: "Strong Manufacturing Scale",
        desc: "With total assets exceeding RMB 3.2 billion and a workforce of over 4,000 professionals, KAMA has built deep manufacturing strength.",
    },
    {
        icon: Award,
        title: "Listed and Trusted",
        desc: "Established in 1993 and listed on the Shanghai Stock Exchange in 1998, KAMA has earned long-term trust across international markets.",
    },
    {
        icon: Leaf,
        title: "Future-Ready Mobility",
        desc: "Through continued investment in new energy technologies, KAMA is accelerating the shift toward cleaner and smarter transportation.",
    },
];

const timeline = [
    {
        year: "1993",
        title: "KAMA Auto Founded",
        desc: "KAMA Auto was established and began its journey toward becoming a major commercial vehicle manufacturer.",
    },
    {
        year: "1998",
        title: "Public Listing",
        desc: "KAMA Auto was listed on the Shanghai Stock Exchange, marking an important milestone in corporate growth and governance.",
    },
    {
        year: "2010",
        title: "Strategic Partnership with Dongfeng",
        desc: "Shandong Dongfeng KAMA Vehicle Co., Ltd. was formed through strategic cooperation, with KAMA Auto holding a controlling 51% share.",
    },
    {
        year: "2019",
        title: "Ganzhou Branch Launched",
        desc: "A major expansion focused on innovation and high technology to accelerate the development of new energy vehicles.",
    },
];

const productLines = [
    "Mini Trucks",
    "Light Trucks",
    "Medium Trucks",
    "Electric Vehicles (EVs)",
    "Special-Purpose Vehicles",
];

const reasons = [
    "Over 30 years of experience in commercial vehicle manufacturing",
    "Backed by one of the world’s largest state-owned industrial groups",
    "Continuous progress in electric and green mobility technologies",
    "Reliable products supported by professional technical services",
];

export default function AboutPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">About Al Nasir Motors</h1>
                    <p className="text-primary-foreground/75 max-w-3xl mx-auto mb-3 text-base md:text-lg">
                        Discover excellence with KAMA Auto, a globally recognized force in commercial vehicles, built on engineering depth,
                        strategic vision, and decades of manufacturing leadership.
                    </p>
                    <p className="font-display font-semibold text-[11px] uppercase tracking-[0.25em] text-white/40">
                        Driven by Al Nasir Motors
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container max-w-5xl space-y-14">
                    <div className="bg-card border rounded-lg p-7 md:p-10">
                        <h2 className="font-display font-bold text-3xl text-foreground mb-5">Founding Legacy in Pakistan</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Al-Bashir Group has been in the automotive business for more than half a century. Our chairman,
                                Mr. Bashir Uddin Malik (Basheeruddin Malik), began his journey in spare parts sales under
                                Al-Nasir Motors, a name known for quality and excellence.
                            </p>
                            <p>
                                His strong reputation helped build a rapid national footprint in parts sales, and he later became
                                one of the first preferred partners for Toyota and Hino as a pioneer dealer.
                            </p>
                            <p>
                                With consistent year-on-year growth and strong operational performance, the group developed one of
                                the largest dealership footprints in the Toyota network (Toyota Faisalabad, Sargodha, Lyallpur,
                                and Chenab) and grew into one of the largest dealership groups in the country across passenger and
                                commercial vehicle segments.
                            </p>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-7 md:p-10">
                        <h2 className="font-display font-bold text-3xl text-foreground mb-6">Leadership Spotlight</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <article className="rounded-xl border bg-background p-5">
                                <Image
                                    src="/images/al-bcf/core-team/founder.webp"
                                    alt="Mr. Bashir Uddin Malik, Founder"
                                    width={280}
                                    height={350}
                                    sizes="(max-width: 640px) 100vw, 280px"
                                    className="w-full max-w-[280px] aspect-[4/5] object-cover rounded-lg mb-4"
                                 loading="lazy" />
                                <h3 className="font-display font-bold text-xl text-foreground">Mr. Bashir Uddin Malik</h3>
                                <p className="text-sm text-primary font-semibold mt-1">Founder</p>
                                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                                    A pioneer in Pakistan&apos;s automotive dealership ecosystem whose long-standing market reputation,
                                    disciplined expansion strategy, and customer-first approach shaped the foundation of Al-Bashir Group.
                                </p>
                            </article>

                            <article className="rounded-xl border bg-background p-5">
                                <Image
                                    src="/images/al-bcf/core-team/director-2-M-Izhar-ul-haq.webp"
                                    alt="Mr. M. Izhar Ul Haq, Director Sales and Marketing"
                                    width={280}
                                    height={350}
                                    sizes="(max-width: 640px) 100vw, 280px"
                                    className="w-full max-w-[280px] aspect-[4/5] object-cover rounded-lg mb-4"
                                 loading="lazy" />
                                <h3 className="font-display font-bold text-xl text-foreground">Mr. M. Izhar Ul Haq</h3>
                                <p className="text-sm text-primary font-semibold mt-1">Director Sales & Marketing</p>
                                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                                    Leads sales and marketing with a strong focus on network growth, customer engagement, and
                                    commercial mobility adoption across Pakistan.
                                </p>
                            </article>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-7 md:p-10">
                        <h2 className="font-display font-bold text-3xl text-foreground mb-5">A Legacy of Growth and Global Confidence</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Established in 1993, KAMA Auto quickly emerged as a prominent name in the commercial vehicle sector and was
                                publicly listed on the Shanghai Stock Exchange in 1998. As a core enterprise under SINOMACH, a Fortune Global
                                500 industrial giant, KAMA combines the stability of large-scale state-backed industry with the agility needed
                                for modern transport markets.
                            </p>
                            <p>
                                Today, with total assets surpassing RMB 3.2 billion and more than 4,000 employees, KAMA stands among the
                                world&apos;s notable commercial vehicle manufacturers, trusted by businesses seeking reliability, efficiency, and
                                long-term value.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {highlights.map((item) => (
                            <div key={item.title} className="bg-card border rounded-lg p-6">
                                <item.icon className="w-8 h-8 text-primary mb-3" />
                                <h3 className="font-display font-bold text-xl text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2 className="font-display font-bold text-3xl text-foreground mb-6">Innovative Partnerships and Strategic Expansion</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                            <p>
                                In October 2010, KAMA and Dongfeng formed Shandong Dongfeng KAMA Vehicle Co., Ltd., a strategic venture that
                                strengthened production capability and expanded market reach. KAMA Auto retains a controlling 51% share,
                                reflecting long-term commitment to growth through collaboration.
                            </p>
                            <p>
                                In August 2019, the Ganzhou branch was completed and put into operation, leveraging regional advantages and
                                high-technology manufacturing to accelerate progress in new energy vehicles and sustainable mobility.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {timeline.map((item) => (
                                <div key={item.year} className="bg-card border rounded-lg p-5">
                                    <p className="text-primary font-display font-bold text-sm uppercase tracking-wider mb-2">{item.year}</p>
                                    <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-7 md:p-10">
                        <h2 className="font-display font-bold text-3xl text-foreground mb-5">Comprehensive Product Range for Every Need</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            KAMA offers a wide and practical lineup designed for diverse business operations, from urban logistics and regional
                            delivery to passenger movement and specialized applications.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {productLines.map((line) => (
                                <div key={line} className="px-4 py-3 rounded-md border bg-background text-sm font-medium text-foreground">
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card border rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <h3 className="font-display font-bold text-xl text-foreground">Quality You Can Trust</h3>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                As an ISO9001-certified commercial vehicle enterprise, KAMA aligns every stage of development with market needs,
                                engineering discipline, and strict quality standards. The result is dependable performance backed by comprehensive
                                technical service.
                            </p>
                        </div>

                        <div className="bg-card border rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <h3 className="font-display font-bold text-xl text-foreground">Why Choose KAMA Auto</h3>
                            </div>
                            <ul className="space-y-2 list-disc pl-5">
                                {reasons.map((reason) => (
                                    <li key={reason} className="text-muted-foreground text-sm leading-relaxed">
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="text-center bg-kama-gradient rounded-lg p-8 md:p-10">
                        <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-foreground mb-3">Al Nasir Motors Pakistan</h2>
                        <p className="text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                            In Pakistan, we bring this global legacy to local businesses through reliable products, strong after-sales support,
                            and a long-term commitment to transport excellence. Our mission is simple: deliver vehicles that move businesses
                            forward with confidence.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

