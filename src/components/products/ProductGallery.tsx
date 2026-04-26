"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
    thumbnail: string;
    images: string[];
    name: string;
    preserveMainImage?: boolean;
}

export default function ProductGallery({ thumbnail, images, name, preserveMainImage = false }: ProductGalleryProps) {
    const allImages = [thumbnail, ...images];
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    const goTo = (idx: number) => {
        setActiveIndex(((idx % allImages.length) + allImages.length) % allImages.length);
    };

    return (
        <>
            <div className="space-y-3">
                {/* Main image */}
                <button
                    onClick={() => setLightbox(true)}
                    className="aspect-[16/10] bg-muted rounded-lg overflow-hidden relative border w-full cursor-zoom-in group"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={allImages[activeIndex]}
                                alt={`${name} — image ${activeIndex + 1}`}
                                fill
                                className={`${preserveMainImage && activeIndex === 0 ? "object-contain bg-black/5" : "object-cover group-hover:scale-[1.02]"} transition-transform duration-500`}
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                priority={activeIndex === 0}
                                loading={activeIndex === 0 ? "eager" : "lazy"}
                            />
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </button>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`relative shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                                    i === activeIndex
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                            >
                                <Image src={img} alt={`${name} thumb ${i + 1}`} fill className="object-cover" sizes="80px"  loading="lazy" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                        onClick={() => setLightbox(false)}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setLightbox(false)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
                            aria-label="Close lightbox"
                        >
                            <X className="w-7 h-7" />
                        </button>

                        {/* Nav arrows */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        <div className="relative w-[90vw] h-[80vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={allImages[activeIndex]}
                                        alt={`${name} — image ${activeIndex + 1}`}
                                        fill
                                        className="object-contain"
                                        sizes="90vw"
                                     loading="lazy" />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Counter */}
                        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                            {activeIndex + 1} / {allImages.length}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
