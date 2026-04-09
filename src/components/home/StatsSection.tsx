"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import { Award, Truck, PackageCheck, MapPin } from "lucide-react";
import { type LucideIcon } from "lucide-react";

const ease = [0.25, 0.4, 0, 1] as const;

const statsData: { value: number; suffix: string; label: string; icon: LucideIcon }[] = [
  { value: 50, suffix: "+", label: "Years of Excellence", icon: Award },
  { value: 30, suffix: "+", label: "Vehicle Models", icon: Truck },
  { value: 10000, suffix: "+", label: "Vehicles Delivered", icon: PackageCheck },
  { value: 5, suffix: "", label: "Major Cities", icon: MapPin },
];

const StatItem = ({
  value,
  suffix,
  label,
  icon: Icon,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
  index: number;
}) => {
  const { ref, display, hasStarted } = useCountUp({ end: value, suffix, duration: 2200 });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center px-4 py-6"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease }}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" strokeWidth={1.8} />
      </div>

      <p
        className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-3 tracking-tight transition-opacity duration-500 ${hasStarted ? "opacity-100" : "opacity-0"
          }`}
      >
        {display}
      </p>
      <p className="text-xs sm:text-sm text-primary-foreground/60 font-display font-semibold uppercase tracking-[0.2em]">
        {label}
      </p>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-20 md:py-24 bg-[#0364CE] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 80px),
          repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 80px)`,
        }}
      />
      <div className="container relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {statsData.map((stat, i) => (
            <StatItem key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
