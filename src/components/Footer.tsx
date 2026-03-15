"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

const Footer = () => {
  return (
    <footer className="bg-kama-navy text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0, ease }}
          >
            <div className="relative w-48 md:w-56 h-16 md:h-20 mb-4 ml-2 overflow-hidden ">
              <Image
                src="/images/logo-white.png"
                alt="CHTC Kama"
                fill
                className="object-cover object-center brightness-0 invert"
              />
            </div>
            <p className="text-sm font-display font-semibold uppercase tracking-[0.15em] text-white/50 mb-3 italic">
              Drive Smart, Drive{" "}
              <span className="slogan-kama not-italic text-[15px]">KAMA</span>
            </p>
            <p className="text-sm opacity-70 leading-relaxed">
              CHTC Kama Pakistan — your trusted partner for commercial vehicles. Light trucks, heavy trucks, vans, buses & special vehicles.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              {[
                { label: "Products", href: "/products" },
                { label: "Find a Dealer", href: "/find-dealer" },
                { label: "After Sales", href: "/after-sales" },
                { label: "Get a Quote", href: "/get-quote" },
                { label: "Careers", href: "/careers" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-70">
              {[
                { label: "About CHTC Kama", href: "/about" },
                { label: "CHTC Brands", href: "/brands" },
                { label: "Quality & Certifications", href: "/about/quality" },
                { label: "News & Events", href: "/news" },
                { label: "Gallery", href: "/gallery" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:+923008665060">+92 300 8665 060</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:info@chtckama.com.pk">info@chtckama.com.pk</a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between text-xs opacity-50">
          <p>© 2026 CHTC Kama Pakistan. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
