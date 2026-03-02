"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

const vehicles = [
  { name: "Light Trucks", image: "/images/vehicle-light-truck.jpg", href: "/products/light-trucks" },
  { name: "Heavy Trucks", image: "/images/vehicle-heavy-truck.jpg", href: "/products/heavy-trucks" },
  { name: "Vans", image: "/images/vehicle-van.jpg", href: "/products/vans" },
  { name: "Cargo Vans", image: "/images/vehicle-cargo.jpg", href: "/products/cargo-vans" },
  { name: "Buses", image: "/images/vehicle-bus.jpg", href: "/products/buses" },
];

const VehiclesSection = () => {
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
          <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Our Range</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Explore Our Vehicles
          </h2>
        </motion.div>

        {/* Vehicle cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {vehicles.map((vehicle, i) => (
            <motion.div
              key={vehicle.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
            >
              <Link
                href={vehicle.href}
                className="group relative bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 block"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h3 className="font-display font-bold text-foreground tracking-tight">{vehicle.name}</h3>
                  <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehiclesSection;
