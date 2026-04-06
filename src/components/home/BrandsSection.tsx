"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const figmaAssets = {
  kamaVan: "https://www.figma.com/api/mcp/asset/fd5bb99e-9230-49d6-a645-1ce3c06f76c7",
  coaster: "https://www.figma.com/api/mcp/asset/fcf36213-3cb9-40b9-a944-f94582b11623",
  kinwinBusFront: "https://www.figma.com/api/mcp/asset/0dbe7dcd-5529-4249-a676-88a1bff1a1aa",
  kinwinBusSide: "https://www.figma.com/api/mcp/asset/779c4a50-7cba-4bfb-9863-9ce547eff7cb",
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
          <Link href="/brands/kama" className="relative block rounded-[28px] bg-[#014ea3] h-[220px] overflow-hidden">
            <h3 className="absolute left-5 top-5 z-40 text-white font-extrabold text-[clamp(1.35rem,6.2vw,1.8rem)] leading-[1.1] [font-family:'Poppins',sans-serif] max-w-[65%]">Kama Vans &amp; Trucks</h3>
            <ArrowRight className="absolute left-5 bottom-5 z-40 h-7 w-7 text-white" strokeWidth={3} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figmaAssets.kamaVan} alt="Kama van" className="pointer-events-none absolute z-10 bottom-[-5px] right-[-15px] h-[155px] w-auto object-contain" />
          </Link>

          <Link href="/brands/kinwin" className="relative block rounded-[28px] bg-[#e9821a] h-[220px] overflow-hidden">
            <h3 className="absolute left-5 top-5 z-40 text-white font-extrabold text-[clamp(1.35rem,6.2vw,1.8rem)] leading-[1.1] [font-family:'Poppins',sans-serif] max-w-[55%]">CHTC Coasters</h3>
            <ArrowRight className="absolute left-5 bottom-5 z-40 h-7 w-7 text-white" strokeWidth={3} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figmaAssets.coaster} alt="CHTC coaster" className="pointer-events-none absolute z-10 bottom-[-5px] right-[-20px] h-[150px] w-auto object-contain" />
          </Link>

          <Link href="/brands/kinwin" className="relative block rounded-[28px] bg-black min-h-[300px] overflow-hidden">
            <h3 className="absolute left-1/2 top-5 -translate-x-1/2 z-40 w-full text-center text-white font-extrabold text-[clamp(1.9rem,7.4vw,2.5rem)] leading-none [font-family:'Poppins',sans-serif]">Kinwin Buses</h3>
            <ArrowRight className="absolute right-5 top-[22px] z-40 h-8 w-8 text-white" strokeWidth={3} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figmaAssets.kinwinBusSide} alt="Kinwin bus side" className="pointer-events-none absolute z-10 right-[-10px] bottom-[20px] h-[135px] max-w-none w-auto object-contain" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figmaAssets.kinwinBusFront} alt="Kinwin bus front" className="pointer-events-none absolute z-20 left-[-20px] bottom-[-15px] h-[185px] max-w-none w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop exact map of 943x635 frame, scaled to a wider consistent stage */}
        <div className="relative hidden md:block mx-auto w-full max-w-[1280px] aspect-[943/635] bg-white overflow-hidden">
          {/* Click targets */}
          <Link href="/brands/kama" className="absolute z-30" style={{ left: "4.049%", top: "3.150%", width: "41.338%", height: "42.362%" }} aria-label="Kama Vans and Trucks" />
          <Link href="/brands/kinwin" className="absolute z-30" style={{ left: "47.507%", top: "3.150%", width: "45.493%", height: "32.756%" }} aria-label="CHTC Coasters" />
          <Link href="/brands/kinwin" className="absolute z-30" style={{ left: "4.029%", top: "45.512%", width: "88.971%", height: "41.732%" }} aria-label="Kinwin Buses" />

          {/* Kama card */}
          <div className="absolute rounded-[42px] bg-[#014ea3]" style={{ left: "4.049%", top: "3.150%", width: "41.338%", height: "32.833%" }} />
          <h3 className="absolute z-20 text-white font-extrabold tracking-[0.02em] leading-[1.121] [font-family:'Poppins',sans-serif]" style={{ left: "6.999%", top: "7.244%", width: "35.315%", fontSize: "clamp(28px,3.7vw,50px)" }}>
            Kama Vans &amp; Trucks
          </h3>
          <ArrowRight className="absolute z-20 text-white" strokeWidth={2.75} style={{ left: "7.423%", top: "24.3%", width: "5.892%", height: "8.110%" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={figmaAssets.kamaVan} alt="Kama van" className="pointer-events-none absolute z-10 object-contain" style={{ left: "13.362%", top: "14.173%", width: "34.995%", height: "31.339%" }} />

          {/* Coaster card */}
          <div className="absolute rounded-[42px] bg-[#e9821a]" style={{ left: "47.507%", top: "3.150%", width: "45.493%", height: "32.756%" }} />
          <h3 className="absolute z-20 text-white font-extrabold leading-[1.121] tracking-[0.01em] [font-family:'Poppins',sans-serif]" style={{ left: "50.053%", top: "7.244%", width: "30.965%", fontSize: "clamp(28px,3.7vw,50px)" }}>
            CHTC<br />Coasters
          </h3>
          <ArrowRight className="absolute z-20 text-white" strokeWidth={2.75} style={{ left: "52.386%", top: "24.3%", width: "5.892%", height: "8.110%" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={figmaAssets.coaster} alt="CHTC coaster" className="pointer-events-none absolute z-10 object-contain" style={{ left: "69.035%", top: "8.189%", width: "24.602%", height: "33.543%" }} />

          {/* Kinwin block */}
          <div className="absolute rounded-[42px] bg-black" style={{ left: "4.029%", top: "45.512%", width: "88.971%", height: "41.732%" }} />
          <h3 className="absolute z-20 text-white font-extrabold tracking-[0.01em] [font-family:'Poppins',sans-serif]" style={{ left: "33.298%", top: "49.764%", width: "53.455%", fontSize: "clamp(32px,4.24vw,57px)", lineHeight: 1.03 }}>
            Kinwin Buses
          </h3>
          <ArrowRight className="absolute z-20 text-white" strokeWidth={2.75} style={{ left: "80.913%", top: "50.079%", width: "5.892%", height: "8.110%" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={figmaAssets.kinwinBusSide} alt="Kinwin bus side" className="pointer-events-none absolute z-10 object-contain" style={{ left: "41.888%", top: "59.370%", width: "55.779%", height: "31.811%" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={figmaAssets.kinwinBusFront} alt="Kinwin bus front" className="pointer-events-none absolute z-20 object-contain" style={{ left: "-1.060%", top: "55.748%", width: "51.007%", height: "42.677%" }} />
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
