"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Image from "next/image";

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm">
      {/* Top bar */}
      <div className="bg-primary">
        <div className="container flex items-center justify-between py-1.5 text-xs text-primary-foreground">
          <div className="flex items-center gap-4">
            <a href="tel:+92111526200" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Phone className="w-3 h-3" />
              <span>+92 111 526 200</span>
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

      {/* Main nav */}
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/kama-logo.png" alt="CHTC Kama Pakistan" width={120} height={48} className="h-10 md:h-12 w-auto" priority />
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
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium font-display transition-colors rounded-sm
                  ${pathname.startsWith(item.href)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                  }`}
              >
                {item.label}
                {item.children && <ChevronDown className="w-3.5 h-3.5" />}
              </Link>

              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-0 w-52 bg-background shadow-lg rounded-md border py-2 animate-fade-in">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t max-h-[80vh] overflow-y-auto animate-fade-in">
          {navItems.map((item) => (
            <div key={item.label}>
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
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
