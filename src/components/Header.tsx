"use client";

import { useState, useEffect, memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight, Phone, Truck, Bus, Zap, Package } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicSiteSettings } from "@/hooks/useSiteSettings";
import AnnouncementBanner from "@/components/AnnouncementBanner";

// ── Category icon helper ──
const catIcon = (slug: string) => {
  if (slug.includes("ev")) return Zap;
  if (slug.includes("bus") || slug === "coaster") return Bus;
  if (slug.includes("dumper")) return Package;
  return Truck;
};

const BRAND_META: Record<string, { label: string; sub: string; color: string }> = {
  "CHTC Kama":    { label: "TRUCKS",           sub: "Built for every business need",  color: "#0364CE" },
  "CHTC Kinwin":  { label: "BUSES",             sub: "Reliable transport solutions",   color: "#16a34a" },
  "CHTC Coaster": { label: "SPECIAL VEHICLES",  sub: "Purpose-built for industries",  color: "#d97706" },
};

const ease = [0.25, 0.4, 0, 1] as const;

// ─── Types exported for layout/conditionalLayout ──────────────────────────────
export interface NavProduct {
  name: string;
  slug: string;
  brand: "kama" | "joylong" | "kinwin" | "chtc";
  categorySlug: string;
}
// ─────────────────────────────────────────────────────────────────────────────

interface NavChild {
  label: string;
  href: string;
  series?: { name: string; href: string }[];
}

interface BrandGroup {
  brand: string;
  categories: NavChild[];
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  megamenu?: boolean;
  brandGroups?: BrandGroup[];
}

// ── Static skeleton: brand groups + category structure (NO series — those come from DB) ──
const BRAND_SKELETON: BrandGroup[] = [
  {
    brand: "CHTC Kama",
    categories: [
      { label: "Mini Truck",    href: "/products/mini-truck",   },
      { label: "Light Truck",   href: "/products/light-truck",  },
      { label: "Dumper Truck",  href: "/products/dumper-truck", },
      { label: "EV Truck",      href: "/products/ev-truck",     },
    ],
  },
  {
    brand: "CHTC Kinwin",
    categories: [
      { label: "9m Bus",    href: "/products/bus-9m",  },
      { label: "12.5m Bus", href: "/products/bus-12m", },
    ],
  },
  {
    brand: "CHTC Coaster",
    categories: [
      { label: "Coaster", href: "/products/coaster", },
    ],
  },
];

// Map category href → category slug (e.g. "/products/mini-truck" → "mini-truck")
const hrefToSlug = (href: string) => href.replace("/products/", "");

const staticNavItems: NavItem[] = [
  {
    label: "Products",
    href: "/products",
    megamenu: true,
    // brandGroups filled dynamically below
  },
  {
    label: "CHTC Brands",
    href: "/brands",
    children: [
      { label: "Kama",    href: "/brands/kama"    },
      { label: "Kinwin",  href: "/brands/kinwin"  },
      { label: "Joylong", href: "/brands/joylong" },
    ],
  },
  { label: "Fabrication",   href: "/fabrication"  },
  { label: "Find a Dealer", href: "/find-dealer"  },
  { label: "After Sales",   href: "/after-sales"  },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Al Nasir Motors",    href: "/about"                  },
      { label: "Leadership & Team",        href: "/about/leadership"        },
      { label: "Quality & Certifications", href: "/about/certifications"    },
      { label: "Valued Clients",           href: "/about/clients"           },
    ],
  },
  { label: "News & Events", href: "/news"    },
  { label: "Contact Us",   href: "/contact" },
];

interface HeaderProps {
  settings?: PublicSiteSettings;
  navProducts?: NavProduct[];
}

const Header = ({ settings, navProducts }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileBrand, setOpenMobileBrand] = useState<string | null>("CHTC Kama");
  const [showTopBar, setShowTopBar] = useState(true);
  const pathname = usePathname();
  const phone = settings?.officePhone ?? "+92 300 8665 060";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const email = settings?.supportEmail ?? "info@alnasirmotors.com.pk";

  // ── Build brand-groups dynamically from active products ──────────────────
  const navItems = useMemo<NavItem[]>(() => {
    const dynamicBrandGroups: BrandGroup[] = BRAND_SKELETON.map((group) => ({
      brand: group.brand,
      categories: group.categories.map((cat) => {
        const catSlug = hrefToSlug(cat.href);
        const series = (navProducts ?? [])
          .filter((p) => p.categorySlug === catSlug)
          .map((p) => ({
            name: p.name,
            href: `/products/${catSlug}/${p.slug}`,
          }));
        return { ...cat, series };
      }),
      // Only include categories that have at least one active product
    })).map((group) => ({
      ...group,
      categories: group.categories.filter((cat) => (cat.series?.length ?? 0) > 0),
    })).filter((group) => group.categories.length > 0);

    return [
      {
        label: "Products",
        href: "/products",
        megamenu: true,
        brandGroups: dynamicBrandGroups,
      },
      ...staticNavItems.filter((i) => i.label !== "Products"),
    ];
  }, [navProducts]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hysteresis prevents rapid flicker around a single threshold.
      setShowTopBar((prev) => {
        if (prev && currentScrollY > 120) return false;
        if (!prev && currentScrollY < 56) return true;
        return prev;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md shadow-sm">
      <AnnouncementBanner settings={settings} />

      {/* Top bar — hides on scroll down and returns on scroll up */}
      <div
        className={`bg-primary overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${showTopBar ? "max-h-8 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="container h-8 flex items-center justify-between text-xs text-primary-foreground">
          <div className="flex items-center gap-4">
            <a href={phoneHref} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </a>
            <span className="hidden sm:inline">|</span>
            <a href={`mailto:${email}`} className="hidden sm:inline hover:opacity-80 transition-opacity">
              {email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/get-quote" className="hover:opacity-80 transition-opacity font-medium">Get a Quote</Link>
            <span>|</span>
            <Link href="/careers" prefetch={false} className="hover:opacity-80 transition-opacity font-medium">Careers</Link>
          </div>
        </div>
      </div>

      {/* Main nav — original solid white */}
      <div className="container h-[5rem] md:h-[6rem] flex items-center justify-between lg:justify-center lg:gap-8">
        <Link href="/" className="flex-shrink-0 py-1 md:py-2 rounded-md transition-transform duration-200 hover:scale-[1.01]">
          <Image
            src="/images/al-nasir-logo.webp"
            alt="Al Nasir Motors"
            width={3334}
            height={1042}
            sizes="(max-width: 768px) 220px, (max-width: 1280px) 300px, 360px"
            className="h-16 md:h-[4.5rem] lg:h-20 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link href={item.href}
                className={`flex items-center gap-1 px-3 py-2 text-lg font-medium font-display transition-colors rounded-sm
                  ${pathname.startsWith(item.href)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                  }`}
                prefetch={false}>
                {item.label}
                {(item.children || item.brandGroups) && (
                  <motion.span
                    animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </Link>

              {/* Animated dropdown — megamenu for Products, regular for others */}
              <AnimatePresence>
                {(item.children || item.brandGroups) && openDropdown === item.label && (
                  item.megamenu && item.brandGroups ? (
                    /* ── MEGAMENU (Products) ── */
                    <motion.div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[980px] bg-background shadow-2xl rounded-xl border overflow-hidden"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.98 }}
                      transition={{ duration: 0.2, ease }}
                    >
                      <div className="flex">
                        {/* ── Left: content (3/4) ── */}
                        <div className="flex-1 min-w-0">

                          {/* TRUCKS (Kama) */}
                          {item.brandGroups.filter(g => g.brand === "CHTC Kama").map((group) => (
                            <div key={group.brand} className="px-6 pt-5 pb-4">
                              <div className="flex items-center gap-2.5 mb-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                  <Truck className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="text-[11px] font-display font-bold uppercase tracking-widest text-primary leading-none">{BRAND_META["CHTC Kama"].label}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{BRAND_META["CHTC Kama"].sub}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-5">
                                {group.categories.map((cat, idx) => {
                                  const Icon = catIcon(cat.href.replace("/products/", ""));
                                  return (
                                    <motion.div key={cat.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.14, delay: idx * 0.04, ease }}>
                                      <Link href={cat.href} prefetch={false}
                                        className="flex items-center gap-1.5 text-sm font-display font-bold text-foreground hover:text-primary transition-colors mb-2 pb-1.5 border-b-2 border-primary/15 hover:border-primary group/cat">
                                        <Icon className="w-3.5 h-3.5 text-primary/50 group-hover/cat:text-primary transition-colors flex-shrink-0" />
                                        {cat.label}
                                      </Link>
                                      <ul className="space-y-0.5">
                                        {cat.series?.map((s) => (
                                          <li key={s.name}>
                                            <Link href={s.href} prefetch={false}
                                              className="block text-xs text-muted-foreground hover:text-primary hover:pl-1.5 transition-all py-[3px]">
                                              {s.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          {/* BUSES + SPECIAL VEHICLES bottom strip */}
                          <div className="bg-muted/30 border-t border-border px-6 py-4">
                            <div className="grid grid-cols-2 gap-6">
                              {item.brandGroups.filter(g => g.brand !== "CHTC Kama").map((group, gi) => {
                                const meta = BRAND_META[group.brand];
                                const BrandIcon = gi === 0 ? Bus : Bus;
                                return (
                                  <motion.div key={group.brand} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.14, delay: (5 + gi) * 0.04, ease }}>
                                    <div className="flex items-center gap-2 mb-2.5">
                                      <div className="flex items-center justify-center w-6 h-6 rounded-md" style={{ background: meta?.color + "18" }}>
                                        <BrandIcon className="w-3.5 h-3.5" style={{ color: meta?.color }} />
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-display font-bold uppercase tracking-widest leading-none" style={{ color: meta?.color }}>{meta?.label ?? group.brand}</p>
                                        <p className="text-[9px] text-muted-foreground">{meta?.sub}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      {group.categories.map((cat) => (
                                        <div key={cat.label}>
                                          <Link href={cat.href} prefetch={false}
                                            className="block text-xs font-display font-bold text-foreground hover:text-primary transition-colors mb-1 pb-1 border-b border-border/60">
                                            {cat.label}
                                          </Link>
                                          <ul className="space-y-0.5">
                                            {cat.series?.map((s) => (
                                              <li key={s.name}>
                                                <Link href={s.href} prefetch={false}
                                                  className="block text-[11px] text-muted-foreground hover:text-primary hover:pl-1 transition-all py-0.5">
                                                  {s.name}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* ── Right: stats panel (1/4) ── */}
                        <div className="w-[220px] flex-shrink-0 border-l border-border bg-gradient-to-b from-primary/5 to-primary/10 flex flex-col">
                          <div className="flex-1 flex flex-col items-center justify-center p-5 gap-4">
                            <div className="w-full rounded-xl overflow-hidden bg-white/60 shadow-sm">
                              <Image
                                src="/images/kama-round.webp"
                                alt="Al Nasir Motors vehicles"
                                width={200}
                                height={140}
                                className="w-full h-[110px] object-contain p-2"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-display font-black text-primary">30+ Models</p>
                              <p className="text-[11px] text-muted-foreground leading-snug mt-1">Engineered for Performance.<br />Built for Pakistan.</p>
                            </div>
                            <Link href="/products" prefetch={false}
                              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-white text-xs font-display font-bold rounded-lg hover:bg-primary/90 transition-colors">
                              View All Products
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                          <div className="border-t border-border/50 px-4 py-3 text-center">
                            <p className="text-[10px] text-muted-foreground">Sales &amp; Service across</p>
                            <p className="text-sm font-display font-bold text-foreground">5 Cities in Pakistan</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* ── REGULAR DROPDOWN ── */
                    <motion.div
                      className="absolute top-full left-0 w-52 bg-background shadow-lg rounded-md border py-2"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.2, ease }}
                    >
                      {item.children?.map((child, idx) => (
                        <motion.div
                          key={child.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15, delay: idx * 0.03, ease }}
                        >
                          <Link href={child.href}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                            prefetch={false}>
                            {child.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Mobile toggle — animated icon swap */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile nav — animated slide */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden bg-background border-t max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03, ease }}
              >
                <Link href={item.href}
                  className="block px-6 py-3 text-sm font-display font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border-b border-border/40"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.megamenu && item.brandGroups
                  ? item.brandGroups.map((group) => (
                    <div key={group.brand}>
                      <p className="px-8 py-2 text-xs font-display font-semibold uppercase tracking-widest text-muted-foreground bg-muted/50">
                        {group.brand}
                      </p>
                      {group.categories.map((cat) => (
                        <div key={cat.label}>
                          <Link href={cat.href}
                            className="block px-8 py-2 text-sm font-display font-semibold text-foreground hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {cat.label}
                          </Link>
                          {cat.series?.map((s) => (
                            <Link key={s.name}
                              href={s.href}
                              className="block px-12 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {s.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))
                  : item.children?.map((child) => (
                    <Link key={child.label}
                      href={child.href}
                      className="block px-10 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default memo(Header);

