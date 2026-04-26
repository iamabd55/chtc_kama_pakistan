"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
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

const HeroSection = ({ slides }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

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
      className="hero-mobile-section relative h-[100svh] lg:h-screen min-h-[560px] sm:min-h-[700px] lg:min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Slideshow Background ── */}
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
            animate={{ scale: i === currentSlide ? 1.06 : 1 }}
            transition={{ duration: 6, ease: "linear" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="hero-mobile-image object-cover object-[60%_72%] sm:object-center"
              priority={i === 0}
              sizes="100vw"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* ── Cinematic overlay ── */}
      <motion.div className="absolute inset-0" style={{ opacity: overlayOpacity }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.55) 50%, rgba(0, 0, 0, 0.70) 100%)",
          }}
        />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-background/80 to-transparent z-[2]" />

      {/* ── Glow orbs ── */}
      <div className="absolute top-1/3 right-[15%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-accent/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[8%] w-[200px] sm:w-[250px] h-[200px] sm:h-[250px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Main Content ── */}
      <motion.div
        className="hero-mobile-content container relative z-10 px-5 sm:px-8"
        style={{ y: contentY }}
      >
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* ── Eyebrow ── */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <span className="w-5 sm:w-10 h-[1.5px] bg-gradient-to-r from-transparent to-accent rounded-full" />
            <span className="font-heading font-semibold text-[9px] sm:text-[12px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50">
              Pakistan&apos;s Commercial Vehicle Partner
            </span>
            <span className="w-5 sm:w-10 h-[1.5px] bg-gradient-to-l from-transparent to-accent rounded-full" />
          </motion.div>

          {/* ── THE SLOGAN ── */}
          <div className="mb-4 sm:mb-7">

            {/* Line 1: "Drive Smart," */}
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <motion.h1
                className="text-[3.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-heading font-semibold text-white leading-[0.98] sm:leading-[0.95] hero-headline-clean"
                style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)" }}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.35, ease }}
              >
                Drive Smart,
              </motion.h1>
            </motion.div>

            {/* Line 2: mobile splits "With Al Nasir" / "Motors", desktop keeps it all one line */}
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
            >
              <motion.h1
                className="text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-heading font-semibold text-white leading-[0.98] sm:leading-[0.95] hero-headline-clean"
                style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)" }}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.6, ease }}
              >
                {/* ── Mobile only: "With Al Nasir" then "Motors" on new line ── */}
                <span className="sm:hidden">
                  <span className="whitespace-nowrap">With Al Nasir</span>
                  <span className="block text-center" style={{ color: "#E8821A" }}>
                    Motors
                  </span>
                </span>

                {/* ── Desktop (sm+): everything on one line ── */}
                <span className="hidden sm:inline">
                  {"With\u00A0"}
                  <span style={{ color: "#ffffff" }}>Al Nasir</span>
                  <span style={{ color: "#E8821A" }}>{"\u00A0Motors"}</span>
                </span>
              </motion.h1>
            </motion.div>
          </div>

          {/* ── One-liner ── */}
          <motion.p
            className="text-sm sm:text-lg md:text-xl text-white/75 text-center leading-relaxed font-body max-w-sm sm:max-w-2xl mx-auto mb-6 sm:mb-10"
            style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
          >
            Mini trucks to heavy haulers. Electric to diesel.{" "}
            <span className="text-white/65 font-medium">30+ models built for Pakistani roads.</span>
          </motion.p>

          {/* ── CTA Buttons ── */}
          <motion.div
            className="flex flex-row w-full max-w-[380px] sm:w-auto gap-2.5 sm:gap-4 mb-8 sm:mb-14"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease }}
          >
            <Link
              href="/products"
              className="group relative inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 sm:px-10 py-2.5 sm:py-[18px] bg-gradient-to-r from-accent to-amber-500 text-white font-display font-bold text-[11px] sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.12em] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.03]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Explore Vehicles
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </Link>
            <Link
              href="/get-quote"
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 sm:px-10 py-2.5 sm:py-[18px] bg-white/[0.08] backdrop-blur-md border border-white/20 text-white font-display font-bold text-[11px] sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.12em] rounded-lg transition-all duration-300 hover:bg-white/[0.15] hover:border-white/40 hover:scale-[1.03]"
            >
              Get a Quote
            </Link>
          </motion.div>

          {/* ── Stats ── */}
          <motion.div
            className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.35, ease }}
          >
            {[
              { value: "30+", label: "Models" },
              { value: "50+", label: "Years" },
              { value: "5", label: "Cities" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center justify-center min-w-[92px] sm:min-w-[128px] gap-1.5 sm:gap-2.5 px-2.5 sm:px-5 py-1.5 sm:py-3 rounded-full bg-white/[0.10] border border-white/[0.15]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.4 + i * 0.1, ease }}
              >
                <span className="font-kama font-bold text-[11px] sm:text-base text-accent leading-none">
                  {stat.value}
                </span>
                <span className="text-[8px] sm:text-[11px] text-white uppercase tracking-wider font-heading font-medium">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Slide indicators — desktop: vertical ── */}
      {slides.length > 1 && (
        <motion.div
          className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden sm:flex flex-col gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-1.5 transition-all duration-500 rounded-full ${i === currentSlide
                ? "h-8 bg-accent shadow-sm shadow-accent/50"
                : "h-1.5 bg-white/25 hover:bg-white/50"
                }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </motion.div>
      )}

      {/* ── Slide indicators — mobile: horizontal dots ── */}
      {slides.length > 1 && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex sm:hidden gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? "w-6 bg-accent" : "w-1.5 bg-white/25"
                }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </motion.div>
      )}

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-5 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 cursor-pointer flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/20" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;