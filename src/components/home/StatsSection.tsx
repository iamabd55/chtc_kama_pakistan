import { Headphones, Leaf, ShieldCheck, Wrench } from "lucide-react";
import { type LucideIcon } from "lucide-react";

const statsData: { label: string; description: string; icon: LucideIcon }[] = [
  { label: "Reliable Performance", description: "Built to deliver, every time.", icon: ShieldCheck },
  { label: "Low Maintenance", description: "Designed for cost efficiency.", icon: Wrench },
  { label: "Eco-Friendly Options", description: "Driving a sustainable future.", icon: Leaf },
  { label: "After-Sales Support", description: "We’re with you all the way.", icon: Headphones },
];

const StatItem = ({
  label,
  description,
  icon: Icon,
  index,
}: {
  label: string;
  description: string;
  icon: LucideIcon;
  index: number;
}) => {
  return (
    <div
      className="flex items-start gap-4 px-4 py-4 sm:px-6 sm:py-5"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-[0_10px_20px_rgba(59,130,246,0.08)] sm:h-14 sm:w-14">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.9} />
      </div>

      <div className="min-w-0">
        <p className="text-[0.98rem] font-display font-bold tracking-[-0.01em] text-slate-800 sm:text-[1.05rem]">{label}</p>
        <p className="mt-1 text-[0.9rem] leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="bg-[linear-gradient(180deg,#eef4fb_0%,#edf3fb_100%)] pb-16 sm:pb-20 md:pb-24">
      <div className="container relative">
        <div className="grid gap-0 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/85 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-200/90">
          {statsData.map((stat, i) => (
            <StatItem key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
