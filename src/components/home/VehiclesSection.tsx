import { createPublicServerClient } from "@/lib/supabase/publicServer";
import type { Category } from "@/lib/supabase/types";
import VehiclesGrid from "./VehiclesGrid";
import Link from "next/link";

type RangeCard = {
  slug: string;
  image: string;
  icon: "truck" | "dump" | "zap" | "bus";
  accent: string;
  name: string;
  description: string;
  hoverImage: string | null;
};

const rangeCards: Array<Omit<RangeCard, "name" | "description" | "hoverImage">> = [
  { slug: "mini-truck", image: "categories/kama/mini-truck.png", icon: "truck", accent: "from-sky-100 to-white" },
  { slug: "light-truck", image: "categories/kama/light-truck.png", icon: "truck", accent: "from-blue-100 to-white" },
  { slug: "dumper-truck", image: "categories/kama/dumper-truck.png", icon: "dump", accent: "from-amber-100 to-white" },
  { slug: "ev-truck", image: "categories/kama/ev-truck.png", icon: "zap", accent: "from-emerald-100 to-white" },
  { slug: "bus-9m", image: "categories/kinwin/bus-9m.png", icon: "bus", accent: "from-slate-100 to-white" },
];

export default async function VehiclesSection() {
  const supabase = createPublicServerClient();

  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, description, image, hover_image, display_order, is_active")
    .order("display_order", { ascending: true })
    .limit(5);

  const categories = (data ?? []) as Category[];
  const categoriesBySlug = new Map(categories.filter((category) => category.is_active).map((category) => [category.slug, category]));

  const cards: RangeCard[] = rangeCards.map((card) => {
    const category = categoriesBySlug.get(card.slug);

    return {
      ...card,
      image: category?.image ?? card.image,
      name: category?.name ?? card.slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      description:
        category?.description ??
        (card.slug === "mini-truck"
          ? "Compact and efficient for city deliveries."
          : card.slug === "light-truck"
            ? "Versatile and reliable for everyday tasks."
            : card.slug === "dumper-truck"
              ? "Built for heavy-duty performance."
              : card.slug === "ev-truck"
                ? "Eco-friendly mobility for a better tomorrow."
                : "Spacious and comfortable for every journey."),
      hoverImage:
        category?.hover_image ??
        (card.slug === "mini-truck"
          ? "categories/kama/mini-truck-hover.png"
          : card.slug === "light-truck"
            ? "categories/kama/light-truck-hover.png"
            : card.slug === "dumper-truck"
              ? "categories/kama/dumper-truck-hover.png"
              : card.slug === "ev-truck"
                ? "categories/kama/ev-truck-hover.png"
                : null),
    };
  });

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f4f7fc_0%,#eef4fb_100%)] py-16 sm:py-20 md:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent" aria-hidden="true" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" aria-hidden="true" />
      <div className="absolute right-0 top-28 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" aria-hidden="true" />

      <div className="container relative">
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[0.78rem] font-semibold uppercase tracking-[0.34em] text-primary/90">Our Range</span>
              <span className="h-[2px] w-10 rounded-full bg-primary/70" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-[clamp(2.4rem,4vw,4.3rem)] font-bold leading-[0.95] tracking-[-0.05em] text-kama-navy">
              Explore Our Vehicles
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-7 text-slate-600 sm:text-[1.08rem]">
              Built for performance. Designed for your business.
              <br />
              Explore our wide range of reliable vehicles.
            </p>
          </div>

          <div className="flex flex-col items-start pt-3 sm:pt-4 lg:items-end lg:pt-[3.15rem]">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(37,99,235,0.28)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(37,99,235,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <span>View all products</span>
              <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <VehiclesGrid categories={cards} />
      </div>
    </section>
  );
}
