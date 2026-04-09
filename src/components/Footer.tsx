"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PublicSiteSettings } from "@/hooks/useSiteSettings";
import type { LucideIcon } from "lucide-react";

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
  const socialItems: { key: string; label: string; icon: LucideIcon }[] = [
    { key: "facebook", label: "Facebook", icon: Facebook },
    { key: "instagram", label: "Instagram", icon: Instagram },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin },
    { key: "youtube", label: "YouTube", icon: Youtube },
  ].filter((item) => Boolean(socialLinks[item.key]));

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(150deg,#012347_0%,#013466_42%,#0153A8_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:70px_70px]" />
      <div className="pointer-events-none absolute -right-28 -top-20 h-80 w-80 rounded-full bg-[#FF8622]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="container relative py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0, ease }}
          >
            <div className="relative mb-6 h-16 w-52 overflow-hidden md:h-20 md:w-64">
              <Image
                src="/images/al-nasir-logo-white.png"
                alt="Al Nasir Motors"
                fill
                className="object-contain object-left"
              />
            </div>

            <p className="mb-3 text-xs font-display font-semibold uppercase tracking-[0.32em] text-[#FFBB82]">
              {tagline}
            </p>
            <p className="max-w-xl text-[15px] leading-relaxed text-white/82">
              Al Nasir Motors Pakistan is your trusted partner for commercial mobility, delivering dependable trucks, vans, buses, and special-purpose vehicles for modern business needs.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/get-quote"
                className="inline-flex items-center rounded-lg bg-[#FF8622] px-4 py-2.5 text-xs font-display font-bold uppercase tracking-[0.13em] text-white transition-all duration-300 hover:scale-[1.03] hover:brightness-105"
              >
                Get a Quote
              </Link>
              <Link
                href="/find-dealer"
                className="inline-flex items-center rounded-lg border border-white/30 bg-white/5 px-4 py-2.5 text-xs font-display font-bold uppercase tracking-[0.13em] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-white/10"
              >
                Find Dealer
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              {[
                { label: "Products", href: "/products" },
                { label: "Find a Dealer", href: "/find-dealer" },
                { label: "After Sales", href: "/after-sales" },
                { label: "Get a Quote", href: "/get-quote" },
                { label: "Careers", href: "/careers" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-all duration-300 hover:translate-x-1 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              {[
                { label: "About Al Nasir Motors", href: "/about" },
                { label: "CHTC Brands", href: "/brands" },
                { label: "Quality & Certifications", href: "/about/certifications" },
                { label: "News & Events", href: "/news" },
                { label: "Gallery", href: "/gallery" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-all duration-300 hover:translate-x-1 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/78">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-[#FFBB82]">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <span>{officeAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-[#FFBB82]">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <a href={phoneHref} className="transition-colors duration-300 hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-[#FFBB82]">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <a href={`mailto:${email}`} className="transition-colors duration-300 hover:text-white">
                  {email}
                </a>
              </li>
            </ul>

            {socialItems.length > 0 && (
              <div className="mt-6 border-t border-white/15 pt-4">
                <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-white/70">Follow Us</p>
                <div className="flex flex-wrap gap-2.5 text-xs">
                  {socialItems.map((item) => (
                    <a
                      key={item.key}
                      href={socialLinks[item.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-white/80 transition-all duration-300 hover:border-[#FFBB82]/70 hover:bg-white/10 hover:text-white"
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="relative border-t border-white/15 bg-black/15">
        <div className="container flex flex-col items-center justify-between gap-3 py-4 text-xs text-white/60 md:flex-row">
          <p>{footerText}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors duration-300 hover:text-white">
              Privacy Policy
            </Link>
            <span className="h-1 w-1 rounded-full bg-white/35" />
            <Link href="/terms" className="transition-colors duration-300 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

