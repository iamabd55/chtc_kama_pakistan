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
                        className="group relative bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 block"
                    >
                        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                            {cat.image ? (
                                <>
                                    {/* Default image */}
                                    <Image
                                        src={getStorageUrl(cat.image)}
                                        alt={cat.name}
                                        fill
                                        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
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
                        <div className="p-4 flex items-center justify-between">
                            <h3 className="font-display font-bold text-foreground tracking-tight">{cat.name}</h3>
                            <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
