"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Quote, Sparkles, Star } from "lucide-react";
import type { Testimonial } from "@/lib/supabase/types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const ease = [0.25, 0.4, 0, 1] as const;

interface TestimonialsSectionProps {
    items: Testimonial[];
    variant?: "default" | "home";
    showViewAll?: boolean;
    className?: string;
}

function StarRating({ rating }: { rating: number | null }) {
    if (!rating) return <div className="h-4 w-20" aria-hidden />;
    return (
        <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    className={cn(
                        "h-4 w-4",
                        value <= rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/25"
                    )}
                />
            ))}
        </div>
    );
}

function TestimonialCard({
    item,
    index = 0,
    featured = false,
}: {
    item: Testimonial;
    index?: number;
    featured?: boolean;
}) {
    const subtitle = [item.customer_title, item.company].filter(Boolean).join(" · ");

    return (
        <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.1, ease }}
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(1,52,102,0.08)] backdrop-blur-sm ring-1 ring-primary/[0.06] transition-all duration-500 md:p-5",
                "hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(1,52,102,0.12)] hover:ring-primary/15",
                featured &&
                    "md:-translate-y-2 md:scale-[1.02] md:shadow-[0_20px_50px_rgba(1,52,102,0.14)] md:ring-primary/20"
            )}
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#FF8622] to-primary scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />

            <div className="relative mb-3 flex items-center justify-between gap-3">
                <StarRating rating={item.rating} />
                <Quote className="h-5 w-5 shrink-0 text-primary/25" strokeWidth={2} aria-hidden />
            </div>

            <p className="relative flex-1 text-sm leading-relaxed text-foreground/85 line-clamp-5">
                &ldquo;{item.content}&rdquo;
            </p>

            <footer className="relative mt-4 flex items-center gap-3 border-t border-primary/[0.08] pt-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-bold tracking-tight text-foreground">
                        {item.customer_name}
                    </p>
                    {subtitle && (
                        <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
                {item.rating && (
                    <span className="shrink-0 font-display text-sm font-bold text-primary/80">
                        {item.rating}.0
                    </span>
                )}
            </footer>
        </motion.article>
    );
}

function SectionCtas({ variant }: { variant: "default" | "home" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease }}
            className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-4",
                variant === "home" ? "mt-14" : "mt-10"
            )}
        >
            <Link
                href="/testimonials"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#013466] to-[#0364CE] px-7 text-xs font-display font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
            >
                View all testimonials
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
                href="/testimonials#share-review"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-primary/15 bg-white px-7 text-xs font-display font-bold uppercase tracking-[0.14em] text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.04] hover:scale-[1.02]"
            >
                Share your experience
            </Link>
        </motion.div>
    );
}

export default function TestimonialsSection({
    items,
    variant = "default",
    showViewAll = true,
    className,
}: TestimonialsSectionProps) {
    if (items.length === 0) return null;

    const isHome = variant === "home";
    const displayItems = isHome ? items.slice(0, 3) : items;
    const featuredIndex = displayItems.length === 3 ? 1 : -1;

    const grid = (
        <div
            className={cn(
                "grid gap-6 lg:gap-8",
                displayItems.length === 1 && "max-w-xl mx-auto",
                displayItems.length === 2 && "md:grid-cols-2",
                displayItems.length >= 3 && "md:grid-cols-3 items-stretch"
            )}
        >
            {displayItems.map((item, index) => (
                <TestimonialCard
                    key={item.id}
                    item={item}
                    index={index}
                    featured={isHome && index === featuredIndex}
                />
            ))}
        </div>
    );

    return (
        <section
            id={isHome ? "customer-testimonials" : undefined}
            className={cn(
                "relative overflow-hidden py-20 md:py-28",
                isHome
                    ? "bg-[linear-gradient(180deg,#f4f8fd_0%,#ffffff_45%,#f8fafc_100%)]"
                    : "bg-background",
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(1,52,102,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(1,52,102,0.04)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#0364CE]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#FF8622]/12 blur-3xl" />

            <div className="container relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <span className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#FF8622] rounded-full" />
                        <p className="inline-flex items-center gap-2 text-[#FF8622] font-display font-bold text-xs uppercase tracking-[0.3em]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Customer Voices
                        </p>
                        <span className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#FF8622] rounded-full" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-display font-bold text-[#013466] tracking-tight mb-4 leading-tight">
                        Trusted by Businesses
                        <span className="block sm:inline sm:ml-2 bg-gradient-to-r from-[#0364CE] to-[#FF8622] bg-clip-text text-transparent">
                            Across Pakistan
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        {isHome
                            ? "Real stories from fleet operators who rely on our vehicles, parts, and nationwide support."
                            : "Fleet operators and business owners share their experience with our vehicles and support network."}
                    </p>

                    {isHome && displayItems.length > 0 && (
                        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3">
                            <span className="rounded-full border border-primary/10 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
                                {displayItems.length}+ featured reviews
                            </span>
                            <span className="rounded-full border border-amber-200/60 bg-amber-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 shadow-sm">
                                Verified customers
                            </span>
                        </div>
                    )}
                </motion.div>

                {isHome || displayItems.length <= 3 ? (
                    grid
                ) : (
                    <Carousel
                        opts={{ align: "start", loop: displayItems.length > 2 }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {displayItems.map((item, index) => (
                                <CarouselItem
                                    key={item.id}
                                    className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                                >
                                    <TestimonialCard item={item} index={index} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {displayItems.length > 1 && (
                            <>
                                <CarouselPrevious className="hidden md:flex -left-4 border-primary/20 bg-white shadow-md" />
                                <CarouselNext className="hidden md:flex -right-4 border-primary/20 bg-white shadow-md" />
                            </>
                        )}
                    </Carousel>
                )}

                {showViewAll && <SectionCtas variant={variant} />}
            </div>
        </section>
    );
}
