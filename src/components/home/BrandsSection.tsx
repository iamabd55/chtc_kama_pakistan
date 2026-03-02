"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

const brands = [
  { name: "Kama", logo: "/images/kama-round.png", desc: "Light & heavy commercial vehicles, the flagship brand of CHTC in Pakistan." },
  { name: "Joylong", logo: "/images/joylong-logo.png", desc: "Premium passenger vans and buses designed for comfort and durability." },
  { name: "Kinwin", logo: "/images/kinwin logo.jpg", desc: "Specialized vehicles and custom solutions for specific industry needs." },
];

const BrandsSection = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container">
        {/* Section heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Our Brands</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            CHTC Brands in Pakistan
          </h2>
        </motion.div>

        {/* Brand cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease }}
            >
              <Link
                href={`/brands/${brand.name.toLowerCase()}`}
                className="bg-card border rounded-lg p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group block"
              >
                <div className="relative w-42 h-40 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Image src={brand.logo} alt={brand.name} fill unoptimized className="object-contain" />
                </div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-3 tracking-tight">{brand.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{brand.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
