"use client";

import { Truck, Settings, MapPin } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Complete Range",
    desc: "From light pickups to heavy-duty trucks, vans, and buses — we have the right vehicle for every business need.",
    stat: "30+",
    statLabel: "Vehicle Models",
  },
  {
    icon: Settings,
    title: "After Sales Support",
    desc: "Nationwide service network with genuine spare parts, scheduled maintenance, and warranty coverage.",
    stat: "100%",
    statLabel: "Genuine Parts",
  },
  {
    icon: MapPin,
    title: "Dealer Network",
    desc: "Authorized dealers across 5 major cities in Pakistan — Lahore, Karachi, Faisalabad, Multan & Rawalpindi.",
    stat: "5",
    statLabel: "Major Cities",
  },
];

const WhyKamaSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container">
        {/* Section heading */}
        <div
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-gradient-to-r from-transparent to-accent rounded-full" />
            <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em]">
              Why Al Nasir Motors
            </p>
            <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-accent rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight mb-4">
            Built for Pakistan
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Over 50 years of delivering reliable commercial vehicles, engineered for Pakistani roads and businesses.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative bg-card rounded-xl border hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              {/* Top accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="p-8 md:p-10 flex flex-col flex-1">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-foreground mb-3 tracking-tight">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  {service.desc}
                </p>

                {/* Stat highlight */}
                <div className="flex items-center gap-3 mt-8 pt-5 border-t border-border">
                  <span className="text-2xl font-display font-bold text-accent leading-none">
                    {service.stat}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {service.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyKamaSection;
