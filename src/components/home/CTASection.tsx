"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;
const watermarkLogo = "https://www.figma.com/api/mcp/asset/bc54e09a-1524-462e-af94-e75eb874df08";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[#0364CE] py-10 md:py-12">
      <div className="container relative">
        <img
          src={watermarkLogo}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-8 top-1/2 hidden h-auto w-[300px] -translate-y-1/2 blur-[2px] opacity-[0.18] md:block"
        />

        <motion.h2
          className="relative z-10 max-w-[760px] text-white [font-family:var(--font-poppins)] font-bold leading-[1.03] tracking-[-0.015em] text-[42px] sm:text-[52px] md:text-[57px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
        >
          Ready to Drive your
          <br />
          <span className="text-white">Business </span>
          <span className="align-baseline text-[#FFBB82] [font-family:var(--font-vujahday-script)] font-normal text-[62px] sm:text-[74px] md:text-[86px] leading-[0.8]">
            Forward?
          </span>
        </motion.h2>

        <motion.p
          className="relative z-10 mt-4 max-w-[563px] text-white [font-family:var(--font-manjari)] text-[20px] md:text-[22px] leading-[1.05]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
        >
          Get in touch with our sales team for personalized vehicle recommendations and competitive pricing.
        </motion.p>

        <motion.div
          className="relative z-10 mt-8 flex flex-wrap gap-4 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, delay: 0.2, ease }}
        >
          <Link
            href="/get-quote"
            className="inline-flex h-[66px] min-w-[263px] items-center justify-center rounded-xl bg-[#FF8622] px-6 text-center text-[27px] leading-[0.92] text-white [font-family:var(--font-inter)] font-bold transition-all duration-300 hover:scale-[1.03] hover:opacity-90"
          >
            Request a quote
          </Link>
          <Link
            href="/find-dealer"
            className="group inline-flex h-[66px] min-w-[263px] items-center justify-center gap-3 rounded-xl bg-black px-6 text-center text-[27px] leading-[0.92] text-white [font-family:var(--font-inter)] font-bold transition-all duration-300 hover:scale-[1.03] hover:opacity-90"
          >
            Find a dealer
            <ArrowRight className="h-[26px] w-[26px] stroke-[2.25]" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
