"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Ambulance, Shield, Award, Flame } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

const services = [
    {
        icon: Ambulance,
        title: "Ambulances",
        desc: "Fully equipped ambulances for emergency medical services, built to international standards.",
    },
    {
        icon: Flame,
        title: "Fire & Rescue",
        desc: "Fire & rescue vehicles with custom configurations for rapid emergency response.",
    },
    {
        icon: Shield,
        title: "Mortuary Vehicles",
        desc: "Purpose-built mortuary vehicles designed with dignity, hygiene, and compliance in mind.",
    },
    {
        icon: Award,
        title: "Mobile Health Units",
        desc: "Fully functional mobile clinics & health units designed for remote and underserved areas.",
    },
];

const FabricationSection = () => {
    return (
        <section className="py-20 md:py-28 bg-muted/30 overflow-hidden">
            <div className="container">
                {/* Section heading */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease }}
                >
                    <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Fabrication Services</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                        Specialized Vehicle Solutions
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left — Image + badge */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease }}
                    >
                        <div className="relative rounded-xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/fabrication-hero.png"
                                alt="Al-Bashir Custom Fabrication Workshop"
                                width={640}
                                height={420}
                                className="w-full h-auto object-cover"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-kama-navy/40 to-transparent" />
                        </div>

                        {/* Floating badge */}
                        <motion.div
                            className="absolute -bottom-6 -right-4 md:right-6 bg-card rounded-lg shadow-xl border p-4 md:p-5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4, ease }}
                        >
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Established in</p>
                            <p className="text-3xl md:text-4xl font-display font-bold text-primary">1987</p>
                        </motion.div>
                    </motion.div>

                    {/* Right — Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <Image
                                src="/images/al-bcf-logo.png"
                                alt="AL-BCF"
                                width={64}
                                height={64}
                                unoptimized
                                className="flex-shrink-0"
                            />
                            <h3 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
                                Al-Bashir Custom{" "}
                                <span className="text-gradient-gold">Fabrication</span>
                            </h3>
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
                            We specialize in creating customized vehicles including ambulances,
                            mortuary vehicles, fire & rescue vehicles, mobile health units, and
                            recreational & luxury vehicles. Ranked <strong className="text-foreground">3rd in South Asia</strong> and{" "}
                            <strong className="text-foreground">1st in Pakistan</strong> with 90% market share nationwide.
                        </p>

                        {/* Service grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                            {services.map((service, i) => (
                                <motion.div
                                    key={service.title}
                                    className="flex items-start gap-3.5 p-4 rounded-lg hover:bg-card hover:shadow-sm transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease }}
                                >
                                    <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <service.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold text-base text-foreground mb-1">{service.title}</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Link
                            href="/fabrication"
                            className="group inline-flex items-center gap-3 px-7 py-3.5 bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-[0.15em] hover:bg-accent transition-colors duration-300"
                        >
                            Discover More
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FabricationSection;
