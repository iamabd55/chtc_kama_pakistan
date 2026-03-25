import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";
import VehiclesGrid from "./VehiclesGrid";
import Link from "next/link";

export default async function VehiclesSection() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(5);

  const categories = (data ?? []) as Category[];

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container">
        {/* Section heading */}
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl text-left">
            <p className="mb-2 inline-flex items-center gap-3 text-[0.66rem] font-display font-semibold uppercase tracking-[0.26em] text-accent/90">
              <span>Our Range</span>
              <span className="h-px w-10 bg-accent/40" aria-hidden="true" />
            </p>
            <h2 className="text-3xl font-display font-bold leading-[1.08] tracking-[-0.012em] text-foreground sm:text-4xl md:text-[2.65rem]">
              Explore Our Vehicles
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex w-fit items-center justify-center rounded-md border border-primary/30 bg-card px-5 py-2.5 text-sm font-semibold tracking-[0.01em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View all products
          </Link>
        </div>

        {/* Vehicle cards */}
        <VehiclesGrid categories={categories} />
      </div>
    </section>
  );
}
