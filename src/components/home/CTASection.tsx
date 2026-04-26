"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
const watermarkLogo = "/images/al-nasir-logo-white.webp";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[#0364CE] py-10 md:py-12">
      <div className="container relative">
        <Image
          src={watermarkLogo}
          alt=""
          aria-hidden
          width={300}
          height={95}
          className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 blur-[2px] opacity-[0.18] md:block"
          style={{ width: "auto", height: "auto" }}
         loading="lazy" />

        <h2
          className="relative z-10 max-w-[760px] text-white [font-family:var(--font-poppins)] font-bold leading-[1.03] tracking-[-0.015em] text-[42px] sm:text-[52px] md:text-[57px]"
        >
          Ready to Drive your
          <br />
          <span className="text-white">Business </span>
          <span className="align-baseline text-[#FFBB82] font-heading font-medium text-[62px] sm:text-[74px] md:text-[86px] leading-[0.8]">
            Forward?
          </span>
        </h2>

        <p className="relative z-10 mt-4 max-w-[563px] text-white font-body text-[20px] md:text-[22px] leading-[1.05]">
          Get in touch with our sales team for personalized vehicle recommendations and competitive pricing.
        </p>

        <div className="relative z-10 mt-8 flex flex-wrap gap-4 md:gap-8">
          <Link
            href="/get-quote"
            className="inline-flex h-[66px] min-w-[263px] items-center justify-center rounded-xl bg-[#FF8622] px-6 text-center text-[27px] leading-[0.92] text-white font-heading font-bold transition-all duration-300 hover:scale-[1.03] hover:opacity-90"
          >
            Request a quote
          </Link>
          <Link href="/find-dealer"
            className="group inline-flex h-[66px] min-w-[263px] items-center justify-center gap-3 rounded-xl bg-black px-6 text-center text-[27px] leading-[0.92] text-white font-heading font-bold transition-all duration-300 hover:scale-[1.03] hover:opacity-90"
           prefetch={false}>
            Find a dealer
            <ArrowRight className="h-[26px] w-[26px] stroke-[2.25]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
