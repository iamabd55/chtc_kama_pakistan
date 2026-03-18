"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PublicSiteSettings } from "@/hooks/useSiteSettings";

const ease = [0.25, 0.4, 0, 1] as const;

interface FooterProps {
  settings?: PublicSiteSettings;
}

const Footer = ({ settings }: FooterProps) => {
  const phone = settings?.officePhone ?? "+92 300 8665 060";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const email = settings?.supportEmail ?? "info@alnasirmotors.com.pk";
  const officeAddress = settings?.officeAddress ?? "Al Nasir Motors Pakistan, Lahore, Punjab, Pakistan";
  const tagline = settings?.companyTagline ?? "Driven by Al Nasir Motors";
  const footerText = settings?.footerText ?? "© 2026 Al Nasir Motors Pakistan. All rights reserved.";
  const socialLinks = settings?.socialLinks ?? {};
  const socialItems = [
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "youtube", label: "YouTube" },
  ].filter((item) => Boolean(socialLinks[item.key]));

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
                src="/images/al-nasir-logo-white.png"
                alt="Al Nasir Motors"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm font-display font-semibold uppercase tracking-[0.15em] text-white/50 mb-3 italic">
              {tagline}
            </p>
            <p className="text-sm opacity-70 leading-relaxed">
              Al Nasir Motors Pakistan — your trusted partner for commercial vehicles. Light trucks, heavy trucks, vans, buses & special vehicles.
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
                { label: "About Al Nasir Motors", href: "/about" },
                { label: "CHTC Brands", href: "/brands" },
                { label: "Quality & Certifications", href: "/about/certifications" },
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
                <span>{officeAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href={phoneHref}>{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            </ul>

            {socialItems.length > 0 && (
              <div className="mt-5 pt-4 border-t border-primary-foreground/10">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">Follow Us</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  {socialItems.map((item) => (
                    <a
                      key={item.key}
                      href={socialLinks[item.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-100 opacity-75 transition-opacity"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between text-xs opacity-50">
          <p>{footerText}</p>
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

