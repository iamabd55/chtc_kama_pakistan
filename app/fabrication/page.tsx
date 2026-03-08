import Image from "next/image";
import HeroSlideshow from "@/components/fabrication/HeroSlideshow";
import {
    Wrench,
    Ambulance,
    Bus,
    Truck,
    Flame,
    Building2,
    FlaskConical,
    HeartPulse,
    Caravan,
    Car,
    Factory,
    ShieldCheck,
    Globe,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Eye,
    Lightbulb,
    Award,
    Users,
    CheckCircle2,
    Store,
    Handshake,
    Settings,
    TrendingUp,
    Calendar,
    Trophy,
    Target,
    Star,
    Sparkles,
    ChevronRight,
} from "lucide-react";

/* ─── Fabrication services ─── */
const fabricationServices = [
    {
        icon: Ambulance,
        title: "Ambulance Fabrication",
        description:
            "Fully equipped ambulance conversions with advanced life-support systems, medical-grade interiors, oxygen supply, stretcher mounts, and emergency lighting for BLS/ALS configurations.",
        accent: "from-primary to-kama-blue-dark",
    },
    {
        icon: Caravan,
        title: "RV & Recreation Vehicle",
        description:
            "Custom RV conversions with luxurious living quarters, sleeping areas, kitchenettes, restrooms, AC, and premium interior finishes — mobile homes on wheels.",
        accent: "from-kama-gold to-amber-700",
    },
    {
        icon: Car,
        title: "Luxury Vehicle Conversion",
        description:
            "Premium luxury interiors with high-end seating, entertainment systems, executive cabins, mood lighting, and bespoke finishes for VIP transport.",
        accent: "from-kama-navy to-slate-800",
    },
    {
        icon: Settings,
        title: "Mobile Workshop",
        description:
            "Fully functional mobile workshop units with generators, welding equipment, tool storage, workbenches, and specialised machinery for remote field operations.",
        accent: "from-primary to-blue-700",
    },
    {
        icon: FlaskConical,
        title: "Mobile Testing Van",
        description:
            "Purpose-built mobile laboratory and testing vans with precision instruments, climate-controlled compartments, and workstations for on-site inspections.",
        accent: "from-indigo-600 to-primary",
    },
    {
        icon: HeartPulse,
        title: "Mobile Health Unit",
        description:
            "Complete mobile clinic conversions with examination rooms, diagnostic equipment, patient beds, washrooms, and medical storage for outreach healthcare.",
        accent: "from-kama-gold to-orange-600",
    },
    {
        icon: Flame,
        title: "Fire & Rescue Vehicle",
        description:
            "Fire-fighting and rescue fabrication with water tanks, pump systems, ladder mounts, emergency equipment storage, and high-visibility markings on heavy-duty chassis.",
        accent: "from-orange-600 to-kama-gold",
    },
    {
        icon: Building2,
        title: "Office & Showroom",
        description:
            "Mobile office and showroom conversions with professional workspaces, display areas, climate control, and connectivity solutions for on-the-go business.",
        accent: "from-slate-700 to-kama-navy",
    },
    {
        icon: Truck,
        title: "Dry & Cargo Van",
        description:
            "Reinforced dry cargo van fabrication with secure loading systems, weatherproof compartments, and optimized cargo space for logistics and transport.",
        accent: "from-primary to-kama-blue-dark",
    },
    {
        icon: ShieldCheck,
        title: "Bullet Proofing",
        description:
            "Armoured vehicle conversions meeting international ballistic standards with reinforced panels, bullet-resistant glass, and run-flat tire systems.",
        accent: "from-kama-navy to-gray-800",
    },
    {
        icon: Factory,
        title: "Refrigeration & Cold Chain",
        description:
            "Mobile refrigeration units with temperature-controlled compartments, insulated cargo areas, and cold chain solutions for food and pharmaceuticals.",
        accent: "from-cyan-600 to-primary",
    },
    {
        icon: Truck,
        title: "Dump & Garbage Vehicles",
        description:
            "Custom dump body and garbage compactor fabrication for municipal and industrial waste management with hydraulic tipping systems.",
        accent: "from-kama-gold to-amber-700",
    },
    {
        icon: Bus,
        title: "Food & Kitchen Truck",
        description:
            "Commercial food truck and mobile kitchen conversions with cooking stations, ventilation, refrigeration, and health-compliant food prep areas.",
        accent: "from-amber-600 to-kama-gold",
    },
    {
        icon: Sparkles,
        title: "Specialized Vehicles",
        description:
            "Bespoke special-purpose fabrication tailored to unique requirements — from mobile command centers to broadcasting vans and survey vehicles.",
        accent: "from-violet-600 to-primary",
    },
];

/* ─── Core services ─── */
const coreServices = [
    {
        number: "01",
        title: "35 Dealerships",
        description: "Nationwide network of 35 dealerships across Pakistan providing sales, service, and spare parts support.",
        icon: Store,
    },
    {
        number: "02",
        title: "Own Brand Sales",
        description: "Exclusive distribution of Kama, CHTC, Joylong, and Forland vehicles in the Pakistani market.",
        icon: Handshake,
    },
    {
        number: "03",
        title: "After Sales Services",
        description: "Nation-wide 3S/2S workshops and mobile service units covering Lahore, Karachi, Faisalabad, Islamabad, Peshawar, Quetta, AJK & Gilgit.",
        icon: Wrench,
    },
    {
        number: "04",
        title: "Custom Fabrication",
        description: "World-class vehicle customization and body fabrication through Al-Bashir Custom Fabrication.",
        icon: Factory,
    },
];

/* ─── Dealerships & ventures ─── */
const dealerships = [
    "Al-Nasir Motors",
    "Lahore Central Motors (PVT) Ltd",
    "Toyota Faisalabad Motors",
    "Toyota Lyallpur Motors",
    "Toyota Chenab Motors",
    "Toyota Sargodha Motors",
    "Forland Central Motors",
    "Joylong Motors Pakistan (PVT) Ltd",
    "JAC Al-Nasir Motors",
    "West Canal Residences",
    "Grand Atrium Mall",
    "Al-Bashir Custom Fabrication",
    "Al-Bashir Developers",
];

/* ─── Manufacturer partnerships ─── */
const manufacturers = [
    {
        name: "Shandong Kama Automobiles Manufacturing Co. Ltd.",
        products: "4x2 Rigid, Light trucks and dumper trucks from 1 ton to 10 ton",
    },
    {
        name: "CHTC — China High Tech Energy Auto Company Ltd.",
        products: "Middle-sized AC and non-AC buses, Coasters, School Buses",
    },
    {
        name: "Jiangsu Joylong Automobiles Co. Ltd.",
        products: "Hiace vans in different sizes and engines, Coasters, Electric vehicles",
    },
    {
        name: "Asia Star Buses Manufacture Co. Ltd.",
        products: "Big sized urban/intercity high class air-conditioned buses from 9 to 12 meter",
    },
];

export default function FabricationPage() {
    return (
        <>
            {/* ═══════════════════════════ HERO ═══════════════════════════ */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                {/* Slideshow background */}
                <HeroSlideshow />
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                {/* Diagonal gold accent */}
                <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-kama-gold/10 rounded-full blur-3xl" />
                <div className="absolute -top-10 -left-10 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />

                <div className="container relative text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-kama-gold-light px-5 py-2 rounded-full text-sm font-semibold mb-8 border border-white/20">
                        <Wrench className="w-4 h-4 text-kama-gold" />
                        <span>Powered by Lahore Central Motors</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                        Al-Bashir Custom<br />
                        <span className="text-gradient-gold">Fabrication</span>
                    </h1>

                    <p className="text-blue-100 max-w-2xl mx-auto text-lg md:text-xl mb-4 font-light">
                        Turning Your Dreams Into Reality
                    </p>
                    <p className="text-blue-200/70 max-w-xl mx-auto text-sm mb-10">
                        Pakistan&apos;s premier vehicle fabrication facility specializing in ambulances, luxury vehicles, fire engines, mobile health units, workshops, and 10+ more customised solutions on wheels.
                    </p>

                    {/* Hero stats strip */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <Calendar className="w-4 h-4 text-kama-gold" />
                                <span className="text-3xl font-display font-bold text-white">1987</span>
                            </div>
                            <span className="text-blue-200/70 text-xs uppercase tracking-wider">Established</span>
                        </div>
                        <div className="w-px bg-white/20 hidden md:block" />
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <Trophy className="w-4 h-4 text-kama-gold" />
                                <span className="text-3xl font-display font-bold text-white">#1</span>
                            </div>
                            <span className="text-blue-200/70 text-xs uppercase tracking-wider">In Pakistan</span>
                        </div>
                        <div className="w-px bg-white/20 hidden md:block" />
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <Star className="w-4 h-4 text-kama-gold" />
                                <span className="text-3xl font-display font-bold text-white">#3</span>
                            </div>
                            <span className="text-blue-200/70 text-xs uppercase tracking-wider">In South Asia</span>
                        </div>
                        <div className="w-px bg-white/20 hidden md:block" />
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <TrendingUp className="w-4 h-4 text-kama-gold" />
                                <span className="text-3xl font-display font-bold text-white">90%</span>
                            </div>
                            <span className="text-blue-200/70 text-xs uppercase tracking-wider">Market Share</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ AL-BASHIR HIGHLIGHT ═══════════════════════════ */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-kama-gold to-primary" />
                <div className="container max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                        {/* Left — Text */}
                        <div>
                            <span className="text-kama-gold font-semibold text-sm uppercase tracking-widest mb-3 block">About Us</span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-kama-navy mb-6 leading-tight">
                                Al-Bashir Custom<br />Fabrication
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                We specialize in creating customized vehicles including ambulances, mortuary vehicles, fire &amp; rescue vehicles, mobile health units, and recreational &amp; luxury vehicles. Every AL-BCF project is developed with the intention of redefining new standards in quality.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="bg-kama-blue-light/50 rounded-xl p-5 border border-primary/10">
                                    <h4 className="font-display font-bold text-primary mb-2 flex items-center gap-2">
                                        <Target className="w-4 h-4" /> Quality Concept
                                    </h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        When we speak of safety, quality is not an option — it is a necessity. Every AL-BCF project is built to last, redefining new standards in quality.
                                    </p>
                                </div>
                                <div className="bg-kama-gold-light/50 rounded-xl p-5 border border-kama-gold/10">
                                    <h4 className="font-display font-bold text-kama-gold mb-2 flex items-center gap-2">
                                        <Trophy className="w-4 h-4" /> Ranking in Major
                                    </h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Our conversions are ranked <strong className="text-foreground">3rd in South Asia</strong> and <strong className="text-foreground">1st in Pakistan</strong> with <strong className="text-foreground">90% market share</strong> nationwide.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right — Visual highlight card */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-kama-navy via-primary to-kama-blue-dark rounded-2xl p-10 text-white relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 w-32 h-32 bg-kama-gold/20 rounded-full blur-2xl" />
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                                <div className="relative">
                                    <Wrench className="w-12 h-12 text-kama-gold mb-6" />
                                    <h3 className="text-2xl font-display font-bold mb-3">Why Choose AL-BCF?</h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Established in 1987 — over 35 years of expertise",
                                            "#1 ranked fabricator in Pakistan",
                                            "#3 ranked in South Asia",
                                            "90% market share throughout Pakistan",
                                            "14+ vehicle fabrication categories",
                                            "Powered by Lahore Central Motors Pvt. Ltd",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-blue-100 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-kama-gold mt-0.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ VALUABLE CLIENTS (Premium) ═══════════════════════════ */}
            <section className="py-16 bg-kama-navy relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-kama-gold/10 rounded-full blur-3xl" />

                <div className="container max-w-5xl relative">
                    <div className="text-center mb-10">
                        <span className="text-kama-gold font-semibold text-xs uppercase tracking-[0.2em] mb-3 block">Trusted Nationwide</span>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                            Our Valuable <span className="text-kama-gold">Clients</span>
                        </h2>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        {[
                            { src: "/images/al-bcf/CHANGAN AUTO LOGO (2).png", alt: "Changan Auto", w: 150, h: 75 },
                            { src: "/images/al-bcf/logo-2.png", alt: "Client Logo", w: 130, h: 75 },
                            { src: "/images/al-bcf/orient-logo.svg", alt: "Orient", w: 130, h: 65 },
                            { src: "/images/al-bcf/punjab-police-logo-png.png", alt: "Punjab Police", w: 70, h: 85 },
                        ].map((client) => (
                            <div
                                key={client.alt}
                                className="bg-white rounded-2xl px-8 py-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <Image
                                    src={client.src}
                                    alt={client.alt}
                                    width={client.w}
                                    height={client.h}
                                    className="object-contain max-h-16"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ OUR SERVICES (Images) ═══════════════════════════ */}
            <section className="py-20 bg-gray-50">
                <div className="container max-w-6xl">
                    <div className="text-center mb-14">
                        <span className="text-kama-gold font-semibold text-sm uppercase tracking-widest mb-3 block">Specialized Solutions</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                            Our <span className="text-primary">Services</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            From life-saving ambulances to fire &amp; rescue vehicles — explore our key fabrication specialties.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { src: "/images/al-bcf/services/ambulance-service.jpg", title: "Ambulance Service", desc: "Fully equipped ambulance conversions with advanced life-support systems and medical-grade interiors." },
                            { src: "/images/al-bcf/services/fire-and-rescue-vehicles.jpg", title: "Fire & Rescue Vehicles", desc: "Custom fire-fighting vehicle fabrication with water tanks, pump systems, and emergency equipment." },
                            { src: "/images/al-bcf/services/mortuary-vehicles.jpg", title: "Mortuary Vehicles", desc: "Purpose-built mortuary and ambulance mortuary vehicles with refrigerated compartments and dignified interiors." },
                        ].map((service) => (
                            <div key={service.title} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={service.src}
                                        alt={service.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-kama-navy/60 to-transparent" />
                                    <h3 className="absolute bottom-4 left-5 right-5 font-display font-bold text-white text-xl">{service.title}</h3>
                                </div>
                                <div className="p-5">
                                    <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ VISION — 3 pillars ═══════════════════════════ */}
            <section className="py-20 bg-gray-50">
                <div className="container max-w-5xl">
                    <div className="text-center mb-14">
                        <span className="text-kama-gold font-semibold text-sm uppercase tracking-widest mb-3 block">Our Foundation</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                            Vision &amp; <span className="text-primary">Values</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border border-primary/10 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-kama-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-display font-bold text-lg text-kama-navy mb-3">Our Vision</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Become the <strong className="text-primary">fabricator of choice</strong> for Pakistan by establishing Al-Bashir Custom Fabrication as the premier purveyor of customized solutions on wheels.
                            </p>
                        </div>
                        <div className="bg-white border border-kama-gold/10 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-gradient-to-br from-kama-gold to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-kama-gold/20">
                                <Lightbulb className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-display font-bold text-lg text-kama-navy mb-3">Innovation</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Driven through cutting-edge fabrication technologies and modern engineering techniques to deliver world-class vehicle customizations.
                            </p>
                        </div>
                        <div className="bg-white border border-primary/10 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-gradient-to-br from-kama-navy to-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-kama-navy/20">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-display font-bold text-lg text-kama-navy mb-3">Uncompromising Quality</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Every fabrication project meets the highest standards with rigorous quality control, premium materials, and customer satisfaction guaranteed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ FABRICATION SERVICES ═══════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="container max-w-6xl">
                    <div className="text-center mb-14">
                        <span className="text-kama-gold font-semibold text-sm uppercase tracking-widest mb-3 block">What We Build</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                            Our <span className="text-primary">Fabrication</span> Services
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We specialize in 14+ types of vehicle fabrication and customization, transforming commercial chassis into purpose-built solutions for every industry.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {fabricationServices.map((service) => (
                            <div
                                key={service.title}
                                className="group relative bg-white border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                {/* Top accent bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.accent} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                    <service.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-display font-bold text-kama-navy text-lg mb-2">{service.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ AL-BASHIR GROUP BACKGROUND ═══════════════════════════ */}
            <section className="py-20 bg-gray-50">
                <div className="container max-w-5xl">
                    <div className="text-center mb-12">
                        <span className="text-kama-gold font-semibold text-sm uppercase tracking-widest mb-3 block">Our Legacy</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                            About <span className="text-primary">Al-Bashir</span> Group
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl border p-8 md:p-10 mb-10 shadow-sm">
                        <p className="text-muted-foreground leading-relaxed text-base mb-5">
                            Al-Bashir Group has been in the automotive business for more than <strong className="text-kama-navy">half a century</strong>. Our chairman, <strong className="text-kama-navy">Mr. Bashir Uddin Malik&apos;s</strong> journey started off with spare parts sales under the guise of <strong className="text-kama-navy">Al-Nasir Motors</strong>, a name that was synonymous with quality and excellence. Al-Nasir&apos;s strong reputation paved the way to a rapid national footprint growth in parts sales.
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-base mb-5">
                            Mr. Bashir Uddin Malik&apos;s success in parts sales led to his entry into the <strong className="text-kama-navy">Toyota family</strong>, starting off with a dealership in Faisalabad (<strong className="text-kama-navy">Toyota Faisalabad</strong>). Toyota Faisalabad&apos;s stellar performance increased Indus Motor&apos;s confidence, which eventually translated into two more dealerships — <strong className="text-kama-navy">Toyota Sargodha</strong> and <strong className="text-kama-navy">Toyota Lyallpur</strong>, and more recently <strong className="text-kama-navy">Toyota Chenab</strong>.
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-base">
                            With his strong reputation in the automotive industry, Mr. Bashir Uddin was a sought-after resource. <strong className="text-kama-navy">Hinopak Motors Ltd</strong> approached him with a proposition for a <strong className="text-kama-navy">3S dealership covering Punjab</strong>, which was accepted, and since then <strong className="text-kama-navy">Lahore Central Motors Pvt. Ltd</strong> have given a year-on-year growth.
                        </p>
                    </div>

                    {/* Leadership */}
                    <h3 className="font-display font-bold text-foreground text-xl mb-6 text-center">Leadership</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-white rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-kama-gold to-amber-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-kama-navy">Basheer Ud Din Malik <span className="text-muted-foreground font-normal text-sm">(Late)</span></h4>
                                <p className="text-kama-gold text-sm font-semibold">Founder</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-kama-gold to-amber-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-kama-navy">Zaheer Ud Din Malik</h4>
                                <p className="text-kama-gold text-sm font-semibold">Chairman</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-kama-blue-dark flex items-center justify-center flex-shrink-0 shadow-md">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-kama-navy">Muneeb Ibrahim</h4>
                                <p className="text-primary text-sm font-semibold">CEO</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-kama-blue-dark flex items-center justify-center flex-shrink-0 shadow-md">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-kama-navy">Shaukat Hayat &amp; M. Izhar Ul Haq</h4>
                                <p className="text-primary text-sm font-semibold">Directors</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ CORE SERVICES ═══════════════════════════ */}
            <section className="py-20 bg-kama-gradient text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-kama-gold/10 rounded-full blur-3xl" />
                <div className="container max-w-5xl relative">
                    <div className="text-center mb-14">
                        <span className="text-kama-gold font-semibold text-sm uppercase tracking-widest mb-3 block">What We Offer</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold">
                            Our <span className="text-kama-gold">Services</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {coreServices.map((service) => (
                            <div key={service.number} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:border-kama-gold/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-kama-gold to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-white font-display font-bold text-xl">{service.number}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-white text-lg mb-2">{service.title}</h3>
                                        <p className="text-blue-100/80 text-sm leading-relaxed">{service.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ DEALERSHIPS & DISTRIBUTION ═══════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="container max-w-5xl">
                    <div className="text-center mb-14">
                        <span className="text-kama-gold font-semibold text-sm uppercase tracking-widest mb-3 block">Distribution Network</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                            Dealership &amp; <span className="text-primary">Own Brand</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            <strong className="text-kama-navy">Joylong Motors Pakistan (PVT) Limited</strong> is the <strong className="text-kama-navy">Sole Distributor</strong> of the following international automobile manufacturers for the Pakistan market.
                        </p>
                    </div>

                    {/* Manufacturers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                        {manufacturers.map((m) => (
                            <div key={m.name} className="bg-gray-50 border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                                <h4 className="font-display font-bold text-kama-navy mb-2 text-sm">{m.name}</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    <span className="font-semibold text-primary">Products:</span> {m.products}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Dealerships List */}
                    <div className="bg-gray-50 border rounded-2xl p-8">
                        <h3 className="font-display font-bold text-kama-navy text-xl mb-6 text-center">Dealerships &amp; Ventures</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {dealerships.map((d) => (
                                <div key={d} className="flex items-center gap-2.5 py-1">
                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-muted-foreground text-sm">{d}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ NATIONWIDE COVERAGE ═══════════════════════════ */}
            <section className="py-16 bg-gray-50">
                <div className="container max-w-5xl">
                    <div className="text-center mb-10">
                        <span className="text-kama-gold font-semibold text-sm uppercase tracking-widest mb-3 block">Coverage</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                            After Sales <span className="text-primary">Services</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Nation-wide 3S/2S dealership coverage with mobile workshop support across all major cities of Pakistan.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {["Lahore", "Karachi", "Faisalabad", "Islamabad", "Peshawar", "Quetta", "AJK", "Gilgit"].map((city) => (
                            <div key={city} className="bg-white border rounded-xl p-4 text-center hover:border-primary/40 hover:shadow-md transition-all group">
                                <MapPin className="w-5 h-5 text-primary mx-auto mb-2 group-hover:text-kama-gold transition-colors" />
                                <span className="font-display font-bold text-kama-navy text-sm">{city}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ CONTACT CTA ═══════════════════════════ */}
            <section className="py-20 bg-kama-gradient text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="absolute -top-16 right-1/4 w-60 h-60 bg-kama-gold/15 rounded-full blur-3xl" />

                <div className="container max-w-4xl text-center relative">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-white/20">
                        <Globe className="w-4 h-4 text-kama-gold" />
                        <span className="text-blue-100">www.al-bcf.com</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Al-Bashir Custom Fabrication</h2>
                    <p className="text-blue-100/80 mb-10 text-lg">Get in touch for custom fabrication inquiries and quotations</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
                            <MapPin className="w-6 h-6 text-kama-gold mx-auto mb-3" />
                            <p className="text-sm text-blue-100">19 KM Multan Road, Lahore</p>
                            <p className="text-xs text-blue-200/60 mt-1">Lahore Central Motors Pvt Ltd</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
                            <Phone className="w-6 h-6 text-kama-gold mx-auto mb-3" />
                            <p className="text-xs text-blue-200/60 mb-1">Sales &amp; Marketing</p>
                            <p className="text-sm text-white font-semibold">+92-310-7777655</p>
                            <p className="text-xs text-blue-200/60 mt-1">06-07-08</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
                            <Mail className="w-6 h-6 text-kama-gold mx-auto mb-3" />
                            <p className="text-sm text-white font-semibold">info@al-bcf.com</p>
                            <p className="text-sm text-white font-semibold">sales@al-bcf.com</p>
                        </div>
                    </div>

                    <a
                        href="https://www.al-bcf.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-kama-gold to-amber-500 text-kama-navy font-display font-bold text-sm uppercase tracking-wider rounded-xl hover:from-amber-400 hover:to-kama-gold transition-all shadow-lg hover:shadow-kama-gold/30 hover:scale-[1.02]"
                    >
                        <Globe className="w-5 h-5" />
                        Visit www.al-bcf.com
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </section>
        </>
    );
}
