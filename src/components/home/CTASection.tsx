import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 bg-kama-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-foreground rounded-full blur-[100px]" />
      </div>
      <div className="container relative text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-5 tracking-tight leading-tight">
          Ready to Drive Your
          <br />
          Business Forward?
        </h2>
        <p className="text-primary-foreground/60 max-w-lg mx-auto mb-10 text-base sm:text-lg">
          Get in touch with our sales team for personalized vehicle recommendations and competitive pricing.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
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
        </div>
      </div>
    </section>
  );
};

export default CTASection;
