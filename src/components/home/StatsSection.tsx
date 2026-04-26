"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { Award, Truck, PackageCheck, MapPin } from "lucide-react";
import { type LucideIcon } from "lucide-react";

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
}: {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}) => {
  const { ref, display, hasStarted } = useCountUp({ end: value, suffix });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-4 py-6"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-[0_10px_20px_rgba(59,130,246,0.08)] sm:h-14 sm:w-14">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.9} />
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
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="bg-[linear-gradient(180deg,#eef4fb_0%,#edf3fb_100%)] pb-16 sm:pb-20 md:pb-24">
      <div className="container relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {statsData.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
