import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative h-[90vh] min-h-[650px] flex items-center overflow-hidden">
      <Image
        src="/images/hero-truck.jpg"
        alt="CHTC Kama Commercial Vehicle"
        fill
        className="object-cover scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-kama-navy/95 via-kama-navy/70 to-kama-navy/20" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-6">
            <span className="text-accent font-display font-bold text-xs sm:text-sm uppercase tracking-[0.3em] border-b-2 border-accent pb-1">
              CHTC Kama Pakistan
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-primary-foreground leading-[0.95] mb-6 tracking-tight">
            Powering{" "}
            <span className="text-gradient-gold">Pakistan&apos;s</span>
            <br />
            Future
          </h1>
          <p className="text-base sm:text-lg text-primary-foreground/70 mb-10 max-w-xl leading-relaxed font-body">
            From light commercial vehicles to heavy-duty trucks — delivering performance, reliability, and value across Pakistan.
          </p>
          <div className="flex flex-wrap gap-4">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
