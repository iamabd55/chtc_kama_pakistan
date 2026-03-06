"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Truck, Shield, MapPin } from "lucide-react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const ease = [0.25, 0.4, 0, 1] as const;

interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroSectionProps {
  slides: HeroSlide[];
}

const STATS = [
  { icon: Truck, value: "30+", label: "Vehicle Models" },
  { icon: Shield, value: "50+", label: "Years Heritage" },
  { icon: MapPin, value: "100+", label: "Dealer Network" },
];

const HeroSection = ({ slides }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[600px] sm:min-h-[700px] flex items-end overflow-hidden"
    >
      {/* Slideshow */}
      {slides.map((slide, i) => (
        <motion.div
          key={slide.src}
          className="absolute inset-0"
          animate={{ opacity: i === currentSlide ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ y: bgY }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: i === currentSlide ? 1.05 : 1 }}
            transition={{ duration: 5, ease: "linear" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Multi-layer gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: overlayOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-kama-navy/95 via-kama-navy/80 to-kama-navy/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-kama-navy/70 via-transparent to-kama-navy/40" />
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 pb-36 pt-24 sm:pt-32 sm:pb-24 md:pb-28">
        <div className="max-w-4xl">
          {/* Eyebrow badge */}
          <motion.div
            className="inline-flex items-center gap-3 mb-5 sm:mb-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <span className="w-8 sm:w-12 h-[2px] bg-gradient-to-r from-accent to-accent/40 rounded-full" />
            <span className="font-heading font-semibold text-[11px] sm:text-[13px] uppercase tracking-[0.25em] text-accent/90">
              Official CHTC Partner in Pakistan
            </span>
          </motion.div>

          {/* Main heading — staggered word reveal */}
          <div className="mb-6 sm:mb-8">
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <motion.h1
                className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6rem] font-display font-extrabold text-white leading-[0.95] tracking-tight"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease }}
              >
                Built to{" "}
                <span className="text-gradient-gold inline-block">Move</span>
              </motion.h1>
            </motion.div>
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <motion.h1
                className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6rem] font-display font-extrabold text-white leading-[0.95] tracking-tight"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease }}
              >
                Pakistan{" "}
                <span className="text-gradient-gold inline-block">Forward.</span>
              </motion.h1>
            </motion.div>
          </div>

          {/* Subtitle with accent line */}
          <motion.div
            className="flex items-start gap-4 mb-8 sm:mb-10 max-w-lg"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease }}
          >
            <span className="w-[3px] h-12 bg-gradient-to-b from-accent to-accent/0 rounded-full shrink-0 mt-1 hidden sm:block" />
            <p className="text-[15px] sm:text-base md:text-lg text-white/60 leading-relaxed font-body">
              From mini trucks to electric buses — a complete range of commercial
              vehicles engineered for performance, built for Pakistani roads.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-2 sm:mb-14"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05, ease }}
          >
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 bg-primary text-white font-heading font-semibold text-[13px] sm:text-sm uppercase tracking-[0.1em] rounded-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-3">
                Explore Vehicles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            <Link
              href="/get-quote"
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 border border-white/25 text-white font-heading font-semibold text-[13px] sm:text-sm uppercase tracking-[0.1em] rounded-md backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:shadow-lg hover:shadow-white/5"
            >
              Get a Quote
            </Link>
          </motion.div>

          {/* Inline stats strip */}
          <motion.div
            className="hidden sm:flex flex-wrap gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3, ease }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.35 + i * 0.1, ease }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.08] backdrop-blur-sm flex items-center justify-center border border-white/[0.06]">
                  <stat.icon className="w-[18px] h-[18px] text-accent" />
                </div>
                <div>
                  <span className="text-white font-display font-bold text-xl leading-none">{stat.value}</span>
                  <span className="block text-white/40 text-[10px] sm:text-[11px] font-heading font-medium uppercase tracking-wider mt-0.5">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <motion.div
          className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 transition-all duration-500 rounded-full ${i === currentSlide
                ? "h-8 bg-accent"
                : "h-2 bg-white/30 hover:bg-white/50"
                }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </motion.div>
      )}

      {/* Scroll down arrow */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.8, duration: 0.6 }, y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}
      >
        <ChevronDown className="w-8 h-8 text-white/50" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
