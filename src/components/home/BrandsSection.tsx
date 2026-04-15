"use client";
import Image from 'next/image';
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const figmaAssets = {
  kamaVan: "/images/Figma-imgs/kama-figma-img.webp",
  coaster: "/images/Figma-imgs/Chtc-figma-img.webp",
  kinwinBusFront: "/images/Figma-imgs/kinwin-figma-img-2.webp",
  kinwinBusSide: "/images/Figma-imgs/kinwin-figma-img-1.webp",
};

const BrandsSection = () => {
  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="mb-2 text-accent font-display font-bold text-xs uppercase tracking-[0.3em]">Our Brands</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight [font-family:'Poppins',sans-serif]">CHTC Brands in Pakistan</h2>
        </div>

        {/* Mobile fallback */}
        <div className="md:hidden space-y-4">
          <Link href="/brands/kama" className="relative block rounded-[28px] bg-[#014ea3] h-[220px] overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]" prefetch={false}>
            <h3 className="absolute left-5 top-5 z-40 text-white font-extrabold text-[clamp(1.35rem,6.2vw,1.8rem)] leading-[1.1] [font-family:'Poppins',sans-serif] max-w-[65%]">Kama Vans &amp; Trucks</h3>
            <ArrowRight className="absolute left-5 bottom-5 z-40 h-7 w-7 text-white" strokeWidth={3} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src={figmaAssets.kamaVan} alt="Kama van" className="pointer-events-none absolute z-10 bottom-[-5px] right-[-15px] h-[155px] w-auto object-contain"  width={800} height={600}  loading="lazy" />
          </Link>

          <Link href="/brands/kinwin" className="relative block rounded-[28px] bg-[#e9821a] h-[220px] overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]" prefetch={false}>
            <h3 className="absolute left-5 top-5 z-40 text-white font-extrabold text-[clamp(1.35rem,6.2vw,1.8rem)] leading-[1.1] [font-family:'Poppins',sans-serif] max-w-[55%]">CHTC Coasters</h3>
            <ArrowRight className="absolute left-5 bottom-5 z-40 h-7 w-7 text-white" strokeWidth={3} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src={figmaAssets.coaster} alt="CHTC coaster" className="pointer-events-none absolute z-10 bottom-[-5px] right-[-20px] h-[150px] w-auto object-contain"  width={800} height={600}  loading="lazy" />
          </Link>

          <Link href="/brands/kinwin" className="relative block rounded-[28px] bg-black min-h-[300px] overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]" prefetch={false}>
            <h3 className="absolute left-1/2 top-5 -translate-x-1/2 z-40 w-full text-center text-white font-extrabold text-[clamp(1.9rem,7.4vw,2.5rem)] leading-none [font-family:'Poppins',sans-serif]">Kinwin Buses</h3>
            <ArrowRight className="absolute left-5 bottom-5 z-40 h-8 w-8 text-white" strokeWidth={3} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src={figmaAssets.kinwinBusSide} alt="Kinwin bus side" className="pointer-events-none absolute z-10 right-[-10px] bottom-[20px] h-[135px] max-w-none w-auto object-contain"  width={800} height={600}  loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src={figmaAssets.kinwinBusFront} alt="Kinwin bus front" className="pointer-events-none absolute z-20 left-[-20px] bottom-[-15px] h-[185px] max-w-none w-auto object-contain"  width={800} height={600}  loading="lazy" />
          </Link>
        </div>

        {/* Desktop exact map of 943x635 frame, scaled to a wider consistent stage */}
        <div className="relative hidden md:block mx-auto w-full max-w-[1280px] aspect-[943/635] bg-white overflow-hidden">
          <Link href="/brands/kama"
            className="absolute z-30 block transition-transform duration-500 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]"
            style={{ left: "4.049%", top: "3.150%", width: "41.338%", height: "42.362%" }}
            aria-label="Kama Vans and Trucks"
           prefetch={false}>
            <div className="absolute rounded-[42px] bg-[#014ea3]" style={{ left: "0%", top: "0%", width: "100%", height: "77.501%" }} />
            <h3 className="absolute z-20 text-white font-extrabold tracking-[0.02em] leading-[1.121] [font-family:'Poppins',sans-serif]" style={{ left: "7.138%", top: "9.661%", width: "85.434%", fontSize: "clamp(28px,3.7vw,50px)" }}>
              Kama Vans &amp; Trucks
            </h3>
            <ArrowRight className="absolute z-20 text-white" strokeWidth={2.75} style={{ left: "8.164%", top: "49.927%", width: "14.254%", height: "19.141%" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src={figmaAssets.kamaVan} alt="Kama van" className="pointer-events-none absolute z-10 object-contain" style={{ left: "22.532%", top: "26.02%", width: "84.664%", height: "74%" }}  width={800} height={600}  loading="lazy" />
          </Link>

          <Link href="/brands/kinwin"
            className="absolute z-30 block transition-transform duration-500 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]"
            style={{ left: "47.507%", top: "3.150%", width: "45.493%", height: "32.756%" }}
            aria-label="CHTC Coasters"
           prefetch={false}>
            <div className="absolute rounded-[42px] bg-[#e9821a]" style={{ left: "0%", top: "0%", width: "100%", height: "100%" }} />
            <h3 className="absolute z-20 text-white font-extrabold leading-[1.121] tracking-[0.01em] [font-family:'Poppins',sans-serif]" style={{ left: "5.596%", top: "12.5%", width: "68.064%", fontSize: "clamp(28px,3.7vw,50px)" }}>
              CHTC<br />Coasters
            </h3>
            <ArrowRight className="absolute z-20 text-white" strokeWidth={2.75} style={{ left: "10.726%", top: "64.168%", width: "12.951%", height: "24.759%" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src={figmaAssets.coaster} alt="CHTC coaster" className="pointer-events-none absolute z-10 object-contain" style={{ left: "47.319%", top: "15.38%", width: "54.078%", height: "102.4%" }}  width={800} height={600}  loading="lazy" />
          </Link>

          <Link href="/brands/kinwin"
            className="absolute z-30 block transition-transform duration-500 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]"
            style={{ left: "4.029%", top: "45.512%", width: "88.971%", height: "41.732%" }}
            aria-label="Kinwin Buses"
           prefetch={false}>
            <div className="absolute rounded-[42px] bg-black" style={{ left: "0%", top: "0%", width: "100%", height: "100%" }} />
            <h3 className="absolute z-20 text-white font-extrabold tracking-[0.01em] [font-family:'Poppins',sans-serif]" style={{ left: "32.901%", top: "10.185%", width: "60.081%", fontSize: "clamp(32px,4.24vw,57px)", lineHeight: 1.03 }}>
              Kinwin Buses
            </h3>
            <ArrowRight className="absolute z-20 text-white" strokeWidth={2.75} style={{ left: "86.419%", top: "11.111%", width: "6.622%", height: "19.436%" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src={figmaAssets.kinwinBusSide} alt="Kinwin bus side" className="pointer-events-none absolute z-10 object-contain" style={{ left: "42.55%", top: "33.209%", width: "62.691%", height: "76.221%" }}  width={800} height={600}  loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src={figmaAssets.kinwinBusFront} alt="Kinwin bus front" className="pointer-events-none absolute z-20 object-contain" style={{ left: "-5.72%", top: "24.528%", width: "57.329%", height: "102.263%" }}  width={800} height={600}  loading="lazy" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
