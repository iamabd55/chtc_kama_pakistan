import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/fabrication/HeroSlideshow";
import {
    Ambulance,
    Flame,
    ShieldCheck,
    Heart,
    Globe,
    ArrowUpRight,
    MapPin,
    Phone,
    Mail,
    Star,
} from "lucide-react";

const services = [
    { icon: Ambulance, label: "Ambulances", color: "bg-red-50 text-red-500 border-red-100" },
    { icon: Flame, label: "Fire & Rescue", color: "bg-orange-50 text-orange-500 border-orange-100" },
    { icon: ShieldCheck, label: "Mortuary Vehicles", color: "bg-slate-50 text-slate-500 border-slate-100" },
    { icon: Heart, label: "Mobile Health Units", color: "bg-emerald-50 text-emerald-500 border-emerald-100" },
];

const teamFounders = [
    { name: "Basheer Ud Din Malik", suffix: "(Late)", role: "Founder", src: "/images/al-bcf/core-team/founder.webp" },
    { name: "Zaheer Ud Din Malik", role: "Chairman", src: "/images/al-bcf/core-team/chairman.webp" },
];

const teamLeaders = [
    { name: "Muneeb Ibrahim", role: "CEO", src: "/images/al-bcf/core-team/ceo.webp" },
    { name: "Shaukat Hayat", role: "Director", src: "/images/al-bcf/core-team/director-1-Shaukat-hayat.webp" },
    { name: "M. Izhar Ul Haq", role: "Director", src: "/images/al-bcf/core-team/director-2-M-Izhar-ul-haq.webp" },
];

const clients = [
    { src: "/images/al-bcf/CHANGAN AUTO LOGO (2).webp", alt: "Changan Auto", w: 120, h: 55 },
    { src: "/images/al-bcf/logo-2.webp", alt: "Go", w: 100, h: 55 },
    { src: "/images/al-bcf/orient-logo.svg", alt: "Orient", w: 100, h: 50 },
    { src: "/images/al-bcf/punjab-police-logo-png.webp", alt: "Punjab Police", w: 55, h: 65 },
    { src: "/images/al-bcf/Aleem-Dar-logo-1.webp", alt: "Aleem Dar", w: 100, h: 55 },
    { src: "/images/al-bcf/HBL-Device-Logo-sponsorship.webp", alt: "HBL", w: 90, h: 55 },
    { src: "/images/al-bcf/forland-seeklogo.webp", alt: "Forland", w: 100, h: 55 },
    { src: "/images/al-bcf/nadra_logo.webp", alt: "NADRA", w: 100, h: 55 },
];

export default function FabricationPage() {
    return (
        <div className="bg-white">

            {/* ══════════════════════════════════════════
                HERO — split layout (image left, text right)
                - Completely different from dark home hero
            ══════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-white border-b border-gray-100">
                <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh] lg:min-h-[75vh]">

                        {/* Left — image panel */}
                        <div className="relative order-2 lg:order-1 h-56 sm:h-72 lg:h-auto lg:-ml-8">
                            <HeroSlideshow />
                            {/* Diagonal clip on right edge (desktop only) */}
                            <div className="hidden lg:block absolute inset-y-0 -right-8 w-20 bg-white"
                                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 40% 0)" }} />
                            {/* Gold bottom line */}
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kama-gold/0 via-kama-gold to-kama-gold/0 lg:hidden" />
                        </div>

                        {/* Right — content */}
                        <div className="order-1 lg:order-2 flex flex-col justify-center py-12 sm:py-16 lg:py-20 lg:pl-16">
                            {/* Eyebrow */}
                            <div className="flex items-center gap-3 mb-5">
                                <span className="h-px w-8 bg-kama-gold" />
                                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-kama-gold">
                                    A Lahore Central Motors Venture
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-kama-navy leading-[1.05] tracking-tight mb-5">
                                Al-Bashir<br />
                                Custom{" "}
                                <span className="relative inline-block">
                                    Fabrication
                                    <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-kama-gold to-amber-400 rounded-full" />
                                </span>
                            </h1>

                            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                                Pakistan&apos;s <strong className="text-kama-navy">#1 vehicle fabrication facility</strong> — turning specialized vehicle visions into reality since 1987.
                            </p>

                            {/* Stat row */}
                            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10">
                                {[
                                    { val: "1987", desc: "Established" },
                                    { val: "#1 PK", desc: "#3 South Asia" },
                                    { val: "90%", desc: "Market Share" },
                                ].map((s) => (
                                    <div key={s.desc} className="flex flex-col">
                                        <span className="font-display font-black text-2xl text-kama-navy">{s.val}</span>
                                        <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">{s.desc}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Primary CTA */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="https://www.al-bcf.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-kama-navy text-white font-display font-bold text-sm uppercase tracking-[0.12em] rounded-xl hover:bg-kama-gold hover:text-kama-navy transition-all duration-300 shadow-lg shadow-kama-navy/20 hover:shadow-kama-gold/25"
                                >
                                    <Globe className="w-4 h-4" />
                                    Visit AL-BCF.com
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                                <Link href="#team"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-600 font-display font-bold text-sm uppercase tracking-[0.12em] rounded-xl hover:border-kama-navy hover:text-kama-navy transition-all duration-300"
                                 prefetch={false}>
                                    Meet the Team
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SERVICES — pill chips + service image cards
            ══════════════════════════════════════════ */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">

                    {/* Section header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-kama-gold mb-2">Fabrication Specialties</p>
                            <h2 className="text-3xl sm:text-4xl font-display font-black text-kama-navy">What We Build</h2>
                        </div>
                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed sm:text-right">
                            14+ specialized vehicle types — all purpose-built, all world-class.
                        </p>
                    </div>

                    {/* 2-col image cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {[
                            {
                                src: "/images/al-bcf/services/ambulance-service.webp",
                                label: "Ambulances",
                                desc: "Advanced life-support systems & medical-grade interiors.",
                                accent: "border-l-4 border-red-400",
                            },
                            {
                                src: "/images/al-bcf/services/fire-and-rescue-vehicles.webp",
                                label: "Fire & Rescue",
                                desc: "Integrated water tanks, pump systems & emergency gear.",
                                accent: "border-l-4 border-orange-400",
                            },
                            {
                                src: "/images/al-bcf/services/mortuary-vehicles.webp",
                                label: "Mortuary Vehicles",
                                desc: "Refrigerated compartments and dignified interiors.",
                                accent: "border-l-4 border-slate-400",
                            },
                            {
                                src: "/images/al-bcf/services/ambulance-service.webp",
                                label: "Mobile Health Units",
                                desc: "Fully functional mobile clinics for remote communities.",
                                accent: "border-l-4 border-emerald-400",
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className={`group flex items-stretch bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${item.accent}`}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden">
                                    <Image
                                        src={item.src}
                                        alt={item.label}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="144px"
                                     loading="lazy" />
                                </div>
                                {/* Text */}
                                <div className="flex flex-col justify-center p-4 sm:p-5">
                                    <h3 className="font-display font-black text-kama-navy text-base sm:text-lg mb-1">{item.label}</h3>
                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pill extras */}
                    <div className="flex flex-wrap gap-2">
                        {["Luxury Coaches", "Mobile Workshops", "Armoured Vehicles", "Recreational Vans", "Command Centers", "+ More"].map((tag) => (
                            <span
                                key={tag}
                                className="px-3.5 py-1.5 text-xs font-bold text-gray-500 bg-gray-100 rounded-full uppercase tracking-wider"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CREDENTIAL STRIP — gold background banner
            ══════════════════════════════════════════ */}
            <section className="bg-kama-navy py-10 sm:py-12 overflow-hidden">
                <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                        {[
                            { val: "1987", label: "Year Founded" },
                            { val: "#1", label: "Fabricator in Pakistan" },
                            { val: "#3", label: "Ranked in South Asia" },
                            { val: "90%", label: "National Market Share" },
                        ].map((s) => (
                            <div key={s.label} className="text-center sm:text-left border-l-0 sm:border-l border-white/10 sm:pl-6 first:border-l-0 first:pl-0">
                                <p className="font-display font-black text-3xl sm:text-4xl text-kama-gold mb-1">{s.val}</p>
                                <p className="text-white/50 text-[11px] uppercase tracking-wider font-semibold">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CLIENTS — infinite marquee
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-white border-b border-gray-100 overflow-hidden">
                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-100%); }
                    }
                    .animate-marquee {
                        animation: marquee 35s linear infinite;
                        min-width: 100%;
                    }
                    .group:hover .animate-marquee {
                        animation-play-state: paused;
                    }
                `}</style>
                <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-gray-300 mb-10">
                        Trusted by Industry Leaders
                    </p>
                    
                    {/* Marquee Wrapper with edge fade masks */}
                    <div className="relative flex overflow-hidden group py-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                        <div className="flex gap-24 lg:gap-36 pr-24 lg:pr-36 animate-marquee flex-shrink-0 items-center justify-around">
                            {clients.map((c) => (
                                <div key={c.alt} className="flex items-center justify-center shrink-0">
                                    <Image
                                        src={c.src}
                                        alt={c.alt}
                                        width={c.w * 1.5}
                                        height={c.h * 1.5}
                                        className="object-contain max-h-14 opacity-70 hover:opacity-100 transition-opacity duration-300"
                                     loading="lazy" />
                                </div>
                            ))}
                        </div>
                        {/* Duplicate for seamless loop */}
                        <div className="flex gap-24 lg:gap-36 pr-24 lg:pr-36 animate-marquee flex-shrink-0 items-center justify-around" aria-hidden="true">
                            {clients.map((c) => (
                                <div key={`dup-${c.alt}`} className="flex items-center justify-center shrink-0">
                                    <Image
                                        src={c.src}
                                        alt={c.alt}
                                        width={c.w * 1.5}
                                        height={c.h * 1.5}
                                        className="object-contain max-h-14 opacity-70 hover:opacity-100 transition-opacity duration-300"
                                     loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CORE TEAM — portrait magazine style
            ══════════════════════════════════════════ */}
            <section id="team" className="py-16 sm:py-24 bg-gray-50">
                <div className="container max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-kama-gold mb-3">The Core Team</p>
                        <h2 className="text-3xl sm:text-4xl font-display font-black text-kama-navy">
                            People Behind <span className="text-primary">AL-BCF</span>
                        </h2>
                    </div>

                    {/* Founders row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        {teamFounders.map((m) => (
                            <div
                                key={m.name}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex items-stretch"
                            >
                                {/* Portrait column */}
                                <div className="w-24 sm:w-32 flex-shrink-0 relative bg-kama-gold/5">
                                    <Image
                                        src={m.src}
                                        alt={m.name}
                                        fill
                                        className="object-cover object-top"
                                        sizes="128px"
                                     loading="lazy" />
                                </div>
                                {/* Info */}
                                <div className="flex flex-col justify-center p-5 sm:p-6 border-l-2 border-kama-gold/30">
                                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-kama-gold mb-1">{m.role}</span>
                                    <h3 className="font-display font-black text-kama-navy text-base sm:text-lg leading-tight">
                                        {m.name}
                                        {m.suffix && (
                                            <span className="ml-1.5 text-xs font-normal text-gray-400">{m.suffix}</span>
                                        )}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Leadership row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {teamLeaders.map((m) => (
                            <div
                                key={m.name}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Portrait */}
                                <div className="relative h-44 sm:h-52 w-full bg-gray-50">
                                    <Image
                                        src={m.src}
                                        alt={m.name}
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                     loading="lazy" />
                                </div>
                                {/* Info */}
                                <div className="p-4 sm:p-5 border-t-2 border-primary/20">
                                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary mb-1 block">{m.role}</span>
                                    <h3 className="font-display font-black text-kama-navy text-sm sm:text-base leading-tight">{m.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                REDIRECT CTA — the page's whole purpose
            ══════════════════════════════════════════ */}
            <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
                <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-kama-navy rounded-3xl overflow-hidden px-8 sm:px-14 py-12 sm:py-16 text-center">
                        {/* Decorative gold circles */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-kama-gold/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

                        <div className="relative">
                            {/* Star rating style */}
                            <div className="flex justify-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-kama-gold text-kama-gold" />
                                ))}
                            </div>

                            <p className="text-kama-gold text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                                Official Website
                            </p>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white leading-tight mb-4">
                                Want to Commission a Vehicle?
                            </h2>

                            <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8">
                                Visit AL-BCF&apos;s dedicated portal for full product catalogs, custom orders, specifications, and direct quotation requests.
                            </p>

                            <a
                                href="https://www.al-bcf.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-9 py-4 bg-kama-gold text-kama-navy font-display font-black text-sm uppercase tracking-[0.15em] rounded-2xl hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-kama-gold/20 hover:shadow-kama-gold/40 hover:scale-[1.03] mb-10"
                            >
                                <Globe className="w-4 h-4" />
                                www.al-bcf.com
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>

                            {/* Contact row */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm">
                                <a href="tel:+923107777655" className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors">
                                    <Phone className="w-3.5 h-3.5 text-kama-gold" />
                                    +92-310-7777655
                                </a>
                                <a href="mailto:info@al-bcf.com" className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors">
                                    <Mail className="w-3.5 h-3.5 text-kama-gold" />
                                    info@al-bcf.com
                                </a>
                                <span className="flex items-center justify-center gap-2 text-white/30">
                                    <MapPin className="w-3.5 h-3.5 text-kama-gold/50" />
                                    19 KM Multan Road, Lahore
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
