"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

const navItems = [
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Light Trucks", href: "/products/light-trucks" },
      { label: "Heavy Trucks", href: "/products/heavy-trucks" },
      { label: "Vans", href: "/products/vans" },
      { label: "Cargo Vans", href: "/products/cargo-vans" },
      { label: "Buses", href: "/products/buses" },
      { label: "Special Vehicles", href: "/products/special-vehicles" },
    ],
  },
  {
    label: "CHTC Brands",
    href: "/brands",
    children: [
      { label: "Kama", href: "/brands/kama" },
      { label: "Joylong", href: "/brands/joylong" },
      { label: "Kinwin", href: "/brands/kinwin" },
    ],
  },
  { label: "Fabrication", href: "/fabrication" },
  { label: "Find a Dealer", href: "/find-dealer" },
  { label: "After Sales", href: "/after-sales" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About CHTC Kama", href: "/about" },
      { label: "Leadership & Team", href: "/about/leadership" },
      { label: "Quality & Certifications", href: "/about/quality" },
      { label: "Valued Clients", href: "/about/clients" },
    ],
  },
  { label: "News & Events", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm">
      {/* Top bar — original solid blue */}
      <div className="bg-primary">
        <div className="container flex items-center justify-between py-1.5 text-xs text-primary-foreground">
          <div className="flex items-center gap-4">
            <a href="tel:+923008665060" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Phone className="w-3 h-3" />
              <span>+92 300 8665 060</span>
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="mailto:info@chtckama.com.pk" className="hidden sm:inline hover:opacity-80 transition-opacity">
              info@chtckama.com.pk
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
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo.png" alt="CHTC Kama Pakistan" width={150} height={64} unoptimized className="h-12 md:h-16 w-auto" priority />
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
              <Link
                href={item.href}
                className={`flex items-center gap-1 px-3 py-2 text-lg font-medium font-display transition-colors rounded-sm
                  ${pathname.startsWith(item.href)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                  }`}
              >
                {item.label}
                {item.children && (
                  <motion.span
                    animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </Link>

              {/* Animated dropdown */}
              <AnimatePresence>
                {item.children && openDropdown === item.label && (
                  <motion.div
                    className="absolute top-full left-0 w-52 bg-background shadow-lg rounded-md border py-2"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.97 }}
                    transition={{ duration: 0.2, ease }}
                  >
                    {item.children.map((child, idx) => (
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
                <Link
                  href={item.href}
                  className="block px-6 py-3 text-sm font-display font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
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
