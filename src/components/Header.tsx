"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicSiteSettings } from "@/hooks/useSiteSettings";
import { createClient } from "@/lib/supabase/client";

const ease = [0.25, 0.4, 0, 1] as const;

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

const navItems: NavItem[] = [
  {
    label: "Products",
    href: "/products",
    megamenu: true,
    brandGroups: [
      {
        brand: "CHTC Kama",
        categories: [
          {
            label: "Mini Truck",
            href: "/products/mini-truck",
            series: [
              { name: "W Series", href: "/products/mini-truck/w-series" },
              { name: "X Series", href: "/products/mini-truck/x-series" },
              { name: "V Series", href: "/products/mini-truck/v-series" },
              { name: "S Series", href: "/products/mini-truck/s-series" },
            ],
          },
          {
            label: "Light Truck",
            href: "/products/light-truck",
            series: [
              { name: "K Series", href: "/products/light-truck/k-series" },
              { name: "M1 Series", href: "/products/light-truck/m1-series" },
              { name: "M3 Series", href: "/products/light-truck/m3-series" },
              { name: "M6 Series", href: "/products/light-truck/m6-series" },
            ],
          },
          {
            label: "Dumper Truck",
            href: "/products/dumper-truck",
            series: [
              { name: "GM3 Series", href: "/products/dumper-truck/gm3-series" },
              { name: "GM6 Series", href: "/products/dumper-truck/gm6-series" },
            ],
          },
          {
            label: "EV Truck",
            href: "/products/ev-truck",
            series: [
              { name: "EW Series", href: "/products/ev-truck/ew-series" },
              { name: "EV Series", href: "/products/ev-truck/ev-series" },
              { name: "ES Series", href: "/products/ev-truck/es-series" },
              { name: "EX Series", href: "/products/ev-truck/ex-series" },
              { name: "EM Series", href: "/products/ev-truck/em-series" },
            ],
          },
        ],
      },
      {
        brand: "CHTC Kinwin",
        categories: [
          {
            label: "9m Bus",
            href: "/products/bus-9m",
            series: [
              { name: "Labor Bus 9m", href: "/products/bus-9m/labor-bus-9m" },
            ],
          },
          {
            label: "12.5m Bus",
            href: "/products/bus-12m",
            series: [
              { name: "12.5m Bus", href: "/products/bus-12m/bus-12m" },
            ],
          },
        ],
      },
      {
        brand: "CHTC Coaster",
        categories: [
          {
            label: "Coaster",
            href: "/products/coaster",
            series: [
              { name: "Coaster C7", href: "/products/coaster/coaster-c7" },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "CHTC Brands",
    href: "/brands",
    children: [
      { label: "Kama", href: "/brands/kama" },
      { label: "Kinwin", href: "/brands/kinwin" },
      { label: "Joylong", href: "/brands/joylong" },
    ],
  },
  { label: "Fabrication", href: "/fabrication" },
  { label: "Find a Dealer", href: "/find-dealer" },
  { label: "After Sales", href: "/after-sales" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Al Nasir Motors", href: "/about" },
      { label: "Leadership & Team", href: "/about/leadership" },
      { label: "Quality & Certifications", href: "/about/certifications" },
      { label: "Valued Clients", href: "/about/clients" },
    ],
  },
  { label: "News & Events", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

const getSeriesSlugFromHref = (href: string) => {
  const segments = href.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
};


interface HeaderProps {
  settings?: PublicSiteSettings;
}

const Header = ({ settings }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showTopBar, setShowTopBar] = useState(true);
  const [activeProductSlugs, setActiveProductSlugs] = useState<Set<string> | null>(null);
  const pathname = usePathname();
  const phone = settings?.officePhone ?? "+92 300 8665 060";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const email = settings?.supportEmail ?? "info@alnasirmotors.com.pk";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  useEffect(() => {
    let cancelled = false;

    const loadActiveProductSlugs = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("slug")
          .eq("is_active", true)
          .neq("brand", "joylong");

        if (cancelled) return;

        const slugs = (data ?? [])
          .map((entry) => entry.slug)
          .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
        setActiveProductSlugs(new Set(slugs));
      } catch {
        if (!cancelled) {
          // If client fetch fails, keep static menu as fallback.
          setActiveProductSlugs(null);
        }
      }
    };

    void loadActiveProductSlugs();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredNavItems = useMemo(() => {
    if (!activeProductSlugs) return navItems;

    return navItems
      .map((item) => {
        if (!item.megamenu || !item.brandGroups) return item;

        const filteredBrandGroups = item.brandGroups
          .map((group) => {
            const filteredCategories = group.categories
              .map((category) => {
                if (!category.series || category.series.length === 0) return category;

                const filteredSeries = category.series.filter((seriesItem) =>
                  activeProductSlugs.has(getSeriesSlugFromHref(seriesItem.href))
                );

                return {
                  ...category,
                  series: filteredSeries,
                };
              })
              .filter((category) => !category.series || category.series.length > 0);

            return {
              ...group,
              categories: filteredCategories,
            };
          })
          .filter((group) => group.categories.length > 0);

        return {
          ...item,
          brandGroups: filteredBrandGroups,
        };
      })
      .filter((item) => !item.megamenu || !item.brandGroups || item.brandGroups.length > 0);
  }, [activeProductSlugs]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md shadow-sm">
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
            <Link href="/careers" className="hover:opacity-80 transition-opacity font-medium">Careers</Link>
          </div>
        </div>
      </div>

      {/* Main nav — original solid white */}
      <div className="container h-[5rem] md:h-[6rem] flex items-center justify-between lg:justify-center lg:gap-8">
        <Link href="/" className="flex-shrink-0 py-1 md:py-2 rounded-md transition-transform duration-200 hover:scale-[1.01]">
          <Image
            src="/images/al-nasir-logo.png"
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
          {filteredNavItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-1 px-3 py-2 text-lg font-medium font-display transition-colors rounded-sm
                  ${pathname.startsWith(item.href)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                  }`}
              >
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
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[920px] bg-background shadow-2xl rounded-lg border py-0 overflow-hidden"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.98 }}
                      transition={{ duration: 0.2, ease }}
                    >
                      {/* Kama section — full width top */}
                      {item.brandGroups.filter(g => g.brand === "CHTC Kama").map((group) => (
                        <div key={group.brand} className="px-6 pt-6 pb-4">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="inline-block w-1.5 h-5 bg-primary rounded-full"></span>
                            <p className="text-xs font-display font-bold uppercase tracking-widest text-primary">
                              {group.brand}
                            </p>
                          </div>
                          <div className="grid grid-cols-4 gap-6">
                            {group.categories.map((cat, idx) => (
                              <motion.div
                                key={cat.label}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15, delay: idx * 0.04, ease }}
                              >
                                <Link
                                  href={cat.href}
                                  className="block text-sm font-display font-bold text-foreground hover:text-primary transition-colors mb-2 pb-1.5 border-b-2 border-primary/20 hover:border-primary"
                                >
                                  {cat.label}
                                </Link>
                                <ul className="space-y-1">
                                  {cat.series?.map((s) => (
                                    <li key={s.name}>
                                      <Link
                                        href={s.href}
                                        className="block text-xs text-muted-foreground hover:text-primary hover:pl-1 transition-all py-0.5"
                                      >
                                        {s.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Kinwin + CHTC Coaster — side by side in bottom strip */}
                      <div className="bg-muted/40 border-t border-border px-6 py-5">
                        <div className="grid grid-cols-3 gap-8">
                          {item.brandGroups.filter(g => g.brand !== "CHTC Kama").map((group, gi) => (
                            <motion.div
                              key={group.brand}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.15, delay: (4 + gi) * 0.04, ease }}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`inline-block w-1.5 h-5 rounded-full ${gi === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <p className="text-xs font-display font-bold uppercase tracking-widest text-muted-foreground">
                                  {group.brand}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {group.categories.map((cat) => (
                                  <div key={cat.label}>
                                    <Link
                                      href={cat.href}
                                      className="block text-sm font-display font-bold text-foreground hover:text-primary transition-colors mb-1.5 pb-1 border-b border-border"
                                    >
                                      {cat.label}
                                    </Link>
                                    <ul className="space-y-0.5">
                                      {cat.series?.map((s) => (
                                        <li key={s.name}>
                                          <Link
                                            href={s.href}
                                            className="block text-xs text-muted-foreground hover:text-primary hover:pl-1 transition-all py-0.5"
                                          >
                                            {s.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Footer link */}
                      <div className="px-6 py-3 border-t border-border bg-muted/20">
                        <Link
                          href="/products"
                          className="text-xs font-display font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View all products →
                        </Link>
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
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
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
            {filteredNavItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03, ease }}
              >
                <Link
                  href={item.href}
                  className="block px-6 py-3 text-sm font-display font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border-b border-border/40"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.megamenu && item.brandGroups
                  ? /* Megamenu items — brand groups then categories then series */
                  item.brandGroups.map((group) => (
                    <div key={group.brand}>
                      <p className="px-8 py-2 text-xs font-display font-semibold uppercase tracking-widest text-muted-foreground bg-muted/50">
                        {group.brand}
                      </p>
                      {group.categories.map((cat) => (
                        <div key={cat.label}>
                          <Link
                            href={cat.href}
                            className="block px-8 py-2 text-sm font-display font-semibold text-foreground hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {cat.label}
                          </Link>
                          {cat.series?.map((s) => (
                            <Link
                              key={s.name}
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
                  : /* Regular children */
                  item.children?.map((child) => (
                    <Link
                      key={child.label}
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

export default Header;
