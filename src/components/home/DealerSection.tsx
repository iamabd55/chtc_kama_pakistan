"use client";

import Link from "next/link";
import { MapPin, ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import mapData from "@/components/find-dealer/mapdata.js";

const ease = [0.25, 0.4, 0, 1] as const;

type MapLocation = {
  name?: string;
  lat?: string | number;
  lng?: string | number;
  description?: string;
  url?: string;
};

type MapLabel = {
  name?: string;
  x?: string | number;
  y?: string | number;
  parent_type?: string;
  parent_id?: string;
};

type ProjectedDealer = {
  city: string;
  province: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  mapUrl: string | undefined;
};

const cityMeta: Record<string, { province: string; labelX: number; labelY: number }> = {
  Lahore: { province: "Punjab", labelX: 12, labelY: -8 },
  Islamabad: { province: "Punjab", labelX: -80, labelY: -18 },
  Faisalabad: { province: "Punjab", labelX: -55 , labelY: -45 },
  Multan: { province: "Punjab", labelX: 16, labelY: -20 },
  Karachi: { province: "Sindh", labelX: -60, labelY: -10 },
};

const MAP_VIEWBOX_WIDTH = 312.8;
const MAP_VIEWBOX_HEIGHT = 299.9752;
const SIMPLEMAPS_SCALE = 0.3128;

const mapLabelByCity = Object.values((mapData as { labels?: Record<string, MapLabel> }).labels ?? {}).reduce(
  (acc, label) => {
    if (label.parent_type !== "location" || !label.name) {
      return acc;
    }
    const normalizedName = label.name.trim();
    const x = Number(label.x) * SIMPLEMAPS_SCALE;
    const y = Number(label.y) * SIMPLEMAPS_SCALE;
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return acc;
    }

    acc[normalizedName] = { x, y };
    return acc;
  },
  {} as Record<string, { x: number; y: number }>,
);

const latLngToMapPoint = (lat: number, lng: number) => {
  const lngMin = 60.8;
  const lngMax = 77.8;
  const latMin = 23.5;
  const latMax = 37.2;

  const x = 36 + ((lng - lngMin) / (lngMax - lngMin)) * 238;
  const y = 292 - ((lat - latMin) / (latMax - latMin)) * 232;

  return { x, y };
};

const dealers: ProjectedDealer[] = Object.values((mapData as { locations?: Record<string, MapLocation> }).locations ?? {})
  .map((entry) => {
    const lat = Number(entry.lat);
    const lng = Number(entry.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    const normalizedCity = (entry.name ?? "").trim();
    const meta = cityMeta[normalizedCity];
    if (!meta) {
      return null;
    }

    const point = mapLabelByCity[normalizedCity] ?? latLngToMapPoint(lat, lng);
    return {
      city: normalizedCity,
      province: meta.province,
      x: point.x,
      y: point.y,
      labelX: meta.labelX,
      labelY: meta.labelY,
      mapUrl: entry.url,
    };
  })
  .filter((dealer): dealer is ProjectedDealer => dealer !== null)
  .sort((a, b) => a.city.localeCompare(b.city));

const DealerSection = () => {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/4 left-[5%] w-[350px] h-[350px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Pakistan Map ── */}
          <motion.div
            className="relative flex justify-center order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[313/300]">
              <img
                src="/images/dealers/country.svg"
                alt="Pakistan map with dealer locations"
                className="w-full h-full object-contain select-none pointer-events-none"
              />

              {dealers.map((dealer) => {
                const labelLeft = ((dealer.x + dealer.labelX) / MAP_VIEWBOX_WIDTH) * 100;
                const labelTop = ((dealer.y + dealer.labelY) / MAP_VIEWBOX_HEIGHT) * 100;
                return (
                  <span
                    key={dealer.city}
                    className="absolute text-[clamp(14px,1.45vw,18px)] font-semibold leading-none text-primary whitespace-nowrap"
                    style={{ left: `${labelLeft}%`, top: `${labelTop}%` }}
                  >
                    {dealer.city}
                  </span>
                );
              })}
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
              With authorized dealerships across{" "}
              <span className="text-foreground font-medium">5 major cities</span>,
              expert service teams and genuine parts are always within reach. Visit your nearest KAMA dealer for sales, test drives, and after-sales support.
            </p>

            {/* City chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {dealers.map((dealer, i) => (
                <motion.div
                  key={dealer.city}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/[0.06] border border-primary/[0.1] text-foreground/70"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.08, ease }}
                >
                  <MapPin className="w-3 h-3 text-accent" />
                  <span className="text-[11px] sm:text-xs font-heading font-semibold uppercase tracking-wider">
                    {dealer.city}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/find-dealer"
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 bg-gradient-to-r from-primary to-primary/90 text-white font-display font-bold text-xs sm:text-sm uppercase tracking-[0.12em] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]"
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
