"use client";

import { Truck, Wrench, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

const services = [
  {
    icon: Truck,
    title: "Complete Range",
    desc: "From light pickups to heavy-duty trucks, vans, and buses — we have the right vehicle for every business need.",
  },
  {
    icon: Wrench,
    title: "After Sales Support",
    desc: "Nationwide service network with genuine spare parts, scheduled maintenance, and warranty coverage.",
  },
  {
    icon: MapPin,
    title: "Dealer Network",
    desc: "Authorized dealers across 5 major cities in Pakistan — Lahore, Karachi, Faisalabad, Multan & Rawalpindi — with a growing network.",
  },
];

const WhyKamaSection = () => {
  return (
    <section className="py-20 md:py-24 bg-muted/50">
      <div className="container">
        {/* Section heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Why CHTC Kama</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Built for Pakistan
          </h2>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="bg-card p-8 md:p-10 rounded-lg border hover:shadow-xl transition-all duration-500 group hover:-translate-y-1"
              initial={{ opacity: 0, y: 50, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease }}
            >
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3 tracking-tight">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyKamaSection;
