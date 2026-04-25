"use client";

import Link from "next/link";
import Image from "next/image";
import { BusFront, ChevronRight, ShieldAlert, Truck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getStorageUrl } from "@/lib/supabase/storage";

const ease = [0.25, 0.4, 0, 1] as const;

type RangeCard = {
    slug: string;
    image: string;
    icon: "truck" | "dump" | "zap" | "bus";
    accent: string;
    name: string;
    description: string;
    hoverImage: string | null;
};

interface VehiclesGridProps {
    categories: RangeCard[];
}

const iconMap = {
    truck: Truck,
    dump: ShieldAlert,
    zap: Zap,
    bus: BusFront,
} as const;

export default function VehiclesGrid({ categories }: VehiclesGridProps) {
    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {categories.map((cat, i) => (
                <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease }}
                >
                    <Link href={`/products/${cat.slug}`}
                        className="group relative flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-white/80 bg-white shadow-[0_16px_30px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(15,23,42,0.12)]"
                        prefetch={false}
                    >
                        <div className={`relative aspect-[1.06] overflow-hidden rounded-t-[1.65rem] bg-gradient-to-br ${cat.accent}`}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_50%)]" />
                            {cat.image ? (
                                <>
                                    <Image
                                        src={getStorageUrl(cat.image)}
                                        alt={cat.name}
                                        fill
                                        className={`object-contain object-center p-4 will-change-transform transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] ${cat.hoverImage ? "group-hover:opacity-0" : ""}`}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                        loading="lazy"
                                    />
                                    {cat.hoverImage && (
                                        <Image
                                            src={getStorageUrl(cat.hoverImage)}
                                            alt={`${cat.name} alternate view`}
                                            fill
                                            className="object-contain object-center p-4 opacity-0 will-change-transform transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:opacity-100"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                            loading="lazy"
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <span className="text-2xl font-display font-bold text-muted-foreground/30">{cat.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="relative flex flex-1 flex-col px-5 pb-5 pt-7">
                            <div className="absolute -top-7 left-5 grid h-14 w-14 place-items-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-[0_12px_24px_rgba(59,130,246,0.14)]">
                                {(() => {
                                    const Icon = iconMap[cat.icon];
                                    return <Icon className="h-6 w-6" strokeWidth={1.9} />;
                                })()}
                            </div>
                            <h3 className="mt-4 text-[1.2rem] font-display font-bold tracking-[-0.02em] text-slate-800">{cat.name}</h3>
                            <p className="mt-2 min-h-[3.5rem] text-[0.95rem] leading-6 text-slate-500">{cat.description}</p>
                            <div className="mt-auto flex items-center justify-between pt-6">
                                <span className="text-[0.92rem] font-semibold text-blue-600 transition-colors duration-300 group-hover:text-blue-700">View models</span>
                                <ChevronRight className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
