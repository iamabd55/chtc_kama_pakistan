"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

const statsData = [
  { value: 50, suffix: "+", label: "Years of Excellence" },
  { value: 30, suffix: "+", label: "Vehicle Models" },
  { value: 100, suffix: "+", label: "Dealers Nationwide" },
  { value: 10000, suffix: "+", label: "Vehicles Delivered" },
];

const StatItem = ({
  value,
  suffix,
  label,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
}) => {
  const { ref, display, hasStarted } = useCountUp({ end: value, suffix, duration: 2200 });

  return (
    <motion.div
      ref={ref}
      className="text-center px-4 py-6"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease }}
    >
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
    <section className="relative py-20 md:py-24 bg-kama-gradient overflow-hidden">
      {/* Subtle overlay pattern */}
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
