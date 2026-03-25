"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Category } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

const ease = [0.25, 0.4, 0, 1] as const;

interface VehiclesGridProps {
    categories: Category[];
}

export default function VehiclesGrid({ categories }: VehiclesGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {categories.map((cat, i) => (
                <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease }}
                >
                    <Link
                        href={`/products/${cat.slug}`}
                        className="group relative block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                            {cat.image ? (
                                <>
                                    {/* Default image */}
                                    <Image
                                        src={getStorageUrl(cat.image)}
                                        alt={cat.name}
                                        fill
                                        className={`object-cover transition-opacity duration-500 ${cat.hover_image ? "group-hover:opacity-0" : ""}`}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                    />
                                    {/* Hover image — sits on top, fades in */}
                                    {cat.hover_image && (
                                        <Image
                                            src={getStorageUrl(cat.hover_image)}
                                            alt={`${cat.name} — alternate view`}
                                            fill
                                            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-2xl font-display font-bold text-muted-foreground/30">{cat.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <h3 className="font-display text-[1.02rem] font-bold tracking-tight text-foreground">{cat.name}</h3>
                                <p className="mt-1 text-[0.76rem] font-medium tracking-[0.02em] text-muted-foreground">View models</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-primary/80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
