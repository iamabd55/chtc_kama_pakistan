import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";
import VehiclesGrid from "./VehiclesGrid";

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
        <div className="text-center mb-14">
          <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Our Range</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Explore Our Vehicles
          </h2>
        </div>

        {/* Vehicle cards */}
        <VehiclesGrid categories={categories} />
      </div>
    </section>
  );
}
