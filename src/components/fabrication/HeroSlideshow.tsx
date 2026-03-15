"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const heroImages = [
    "/images/al-bcf/hero/image-1.png",
    "/images/al-bcf/hero/image-2.png",
    "/images/al-bcf/hero/image-3.png",
];

export default function HeroSlideshow() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0">
            {heroImages.map((src, i) => (
                <Image
                    key={src}
                    src={src}
                    alt={`Al-Bashir Fabrication ${i + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-1000 ease-in-out ${i === current ? "opacity-100" : "opacity-0"
                        }`}
                    priority={i === 0}
                    sizes="100vw"
                />
            ))}
            {/* Subtle dark overlay for contrast — no blur */}
            <div className="absolute inset-0 bg-kama-navy/30" />
        </div>
    );
}
