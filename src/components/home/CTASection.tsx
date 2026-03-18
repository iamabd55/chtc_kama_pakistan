"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 bg-kama-gradient relative overflow-hidden">
      {/* Animated floating blobs */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent rounded-full blur-[120px]"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-foreground rounded-full blur-[100px]"
          animate={{
            x: [0, -20, 30, 0],
            y: [0, 20, -15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative text-center">
        <motion.p
          className="font-display font-semibold text-xs uppercase tracking-[0.3em] text-accent mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease }}
        >
          Driven by Al Nasir Motors
        </motion.p>

        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-5 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
        >
          Ready to Drive Your
          <br />
          Business Forward?
        </motion.h2>

        <motion.p
          className="text-primary-foreground/60 max-w-lg mx-auto mb-10 text-base sm:text-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          Get in touch with our sales team for personalized vehicle recommendations and competitive pricing.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
        >
          <Link
            href="/get-quote"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-accent text-accent-foreground font-display font-bold text-sm uppercase tracking-[0.15em] hover:opacity-90 transition-all duration-300"
          >
            Request a Quote
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/find-dealer"
            className="inline-flex items-center gap-3 px-10 py-4 border-2 border-primary-foreground/25 text-primary-foreground font-display font-bold text-sm uppercase tracking-[0.15em] hover:bg-primary-foreground/10 hover:border-primary-foreground/40 transition-all duration-300"
          >
            Find a Dealer
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
