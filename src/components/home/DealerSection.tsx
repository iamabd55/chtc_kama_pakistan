"use client";
import Link from "next/link";
import { MapPin, ArrowRight, Phone, ShieldCheck, Wrench, Navigation } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

type DealerSectionDealer = {
  name: string;
  city: string;
  province: string;
  lat: number | null;
  lng: number | null;
  google_maps_url: string | null;
};

interface DealerSectionProps {
  dealers: DealerSectionDealer[];
}

const DealerSection = ({ dealers: dealerRows }: DealerSectionProps) => {
  // Extract unique cities (normalized)
  const uniqueCities = Array.from(
    new Set(
      dealerRows
        .map((d) => d.city?.trim())
        .filter(Boolean)
    )
  ).sort();

  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/4 left-[5%] w-[350px] h-[350px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Abstract Network Visual ── */}
          <motion.div
            className="relative flex justify-center order-2 lg:order-1 h-full min-h-[400px] lg:min-h-[550px]"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="relative w-full max-w-lg mx-auto flex items-center justify-center">
              {/* Decorative background element */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-[2.5rem] border border-primary/10 overflow-hidden">
                 <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-pulse mix-blend-multiply" />
                 <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse mix-blend-multiply" style={{ animationDelay: '1.5s' }} />
              </div>

              {/* Bento Grid overlay */}
              <div className="relative z-10 w-full p-6 grid grid-cols-2 gap-4">
                 {/* Main stat block */}
                 <motion.div 
                    className="col-span-2 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex items-center justify-between"
                    whileHover={{ y: -5 }}
                    transition={{ ease: "easeOut" }}
                 >
                    <div>
                      <h3 className="text-4xl md:text-5xl font-display font-extrabold text-primary mb-1">
                        {dealerRows.length}+
                      </h3>
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Authorized Centers
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Navigation className="w-8 h-8 text-primary" />
                    </div>
                 </motion.div>

                 {/* Secondary block 1 */}
                 <motion.div 
                    className="col-span-1 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col justify-between aspect-square"
                    whileHover={{ y: -5 }}
                    transition={{ ease: "easeOut" }}
                 >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold text-foreground mb-1">Genuine</h4>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Parts & Quality</p>
                    </div>
                 </motion.div>

                 {/* Secondary block 2 */}
                 <motion.div 
                    className="col-span-1 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col justify-between aspect-square"
                    whileHover={{ y: -5 }}
                    transition={{ ease: "easeOut" }}
                 >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold text-foreground mb-1">Expert</h4>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">3S Dealerships</p>
                    </div>
                 </motion.div>

                 {/* Locations scroll snippet */}
                 <motion.div 
                    className="col-span-2 bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden"
                    whileHover={{ y: -5 }}
                    transition={{ ease: "easeOut" }}
                 >
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22) 0 1px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.16) 0 1px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.12) 0 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                       <div>
                         <p className="text-sm font-semibold opacity-90 mb-1">Covering Pakistan in</p>
                         <h4 className="text-xl md:text-2xl font-display font-bold">{uniqueCities.length} Major Cities</h4>
                       </div>
                       <MapPin className="w-10 h-10 opacity-20" />
                    </div>
                 </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Content ── */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-gradient-to-r from-accent to-accent/40 rounded-full" />
              <span className="font-heading font-semibold text-[11px] sm:text-xs uppercase tracking-[0.25em] text-accent">
                Find a Dealer
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-5 tracking-tight leading-tight">
              We&apos;re Closer Than
              <br />
              You Think
            </h2>

            <p className="text-muted-foreground text-[15px] sm:text-base leading-relaxed max-w-lg mb-8">
              With an extensive network of authorized 3S dealerships stationed across Pakistan, 
              expert service teams and genuine parts are always within reach. Drop by your nearest 
              center for sales, test drives, and unparalleled after-sales support.
            </p>

            {/* City chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {uniqueCities.slice(0, 8).map((city, i) => (
                <motion.div
                  key={city}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/[0.06] border border-primary/[0.1] text-foreground/80 hover:bg-primary/[0.1] hover:border-primary/[0.2] transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease }}
                >
                  <MapPin className="w-3 h-3 text-accent" />
                  <span className="text-[11px] sm:text-xs font-heading font-semibold uppercase tracking-wider">
                    {city}
                  </span>
                </motion.div>
              ))}
              {uniqueCities.length > 8 && (
                <motion.div
                  className="flex items-center justify-center px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4, ease }}
                >
                  <span className="text-[11px] sm:text-xs font-heading font-semibold uppercase tracking-wider">
                    +{uniqueCities.length - 8} more
                  </span>
                </motion.div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/find-dealer"
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 bg-gradient-to-r from-primary to-primary/90 text-white font-display font-bold text-xs sm:text-sm uppercase tracking-[0.12em] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]"
                prefetch={false}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2.5">
                  Find Your Dealer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
              <a
                href="tel:+923008665060"
                className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 border border-border text-foreground/70 font-display font-bold text-xs sm:text-sm uppercase tracking-[0.12em] rounded-lg transition-all duration-300 hover:border-primary/30 hover:text-foreground hover:scale-[1.02]"
              >
                <Phone className="w-4 h-4 text-accent" />
                Call Us
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DealerSection;
