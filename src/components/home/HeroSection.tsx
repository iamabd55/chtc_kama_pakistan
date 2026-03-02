"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const ease = [0.25, 0.4, 0, 1] as const;

const heroSlides = [
  { src: "/images/hero/hero-truck.jpg", alt: "CHTC Kama Commercial Truck" },
  { src: "/images/hero/hero-bus.png", alt: "CHTC Kama Passenger Bus" },
  { src: "/images/hero/hero-heavy-truck.png", alt: "CHTC Kama Heavy Duty Truck" },
  { src: "/images/hero/hero-van.png", alt: "CHTC Kama Commercial Van" },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[90vh] min-h-[650px] flex items-center overflow-hidden"
    >
      {/* Slideshow */}
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ y: bgY }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 5, ease: "linear" }}
          >
            <Image
              src={heroSlides[currentSlide].src}
              alt={heroSlides[currentSlide].alt}
              fill
              className="object-cover"
              priority={currentSlide === 0}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-kama-navy/95 via-kama-navy/70 to-kama-navy/20"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            <span className="text-accent font-display font-bold text-xs sm:text-sm uppercase tracking-[0.3em] border-b-2 border-accent pb-1">
              CHTC Kama Pakistan
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-primary-foreground leading-[0.95] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          >
            Powering{" "}
            <span className="text-gradient-gold">Pakistan&apos;s</span>
            <br />
            Future
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            className="text-base sm:text-lg text-primary-foreground/70 mb-10 max-w-xl leading-relaxed font-body"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
          >
            From light commercial vehicles to heavy-duty trucks — delivering
            performance, reliability, and value across Pakistan.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-[0.15em] hover:bg-accent transition-colors duration-300"
            >
              Explore Vehicles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/get-quote"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-primary-foreground/25 text-primary-foreground font-display font-bold text-sm uppercase tracking-[0.15em] hover:bg-primary-foreground/10 hover:border-primary-foreground/40 transition-all duration-300"
            >
              Get a Quote
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll down arrow */}
      <motion.div
        className="absolute bottom-10 md:bottom-10 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.5, duration: 0.6 }, y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}
      >
        <ChevronDown className="w-8 h-8 text-primary-foreground/60" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
