import Image from "next/image";

const images = [
    { src: "/images/vehicle-light-truck.jpg", caption: "Light Commercial Vehicle" },
    { src: "/images/vehicle-heavy-truck.jpg", caption: "Heavy Duty Truck" },
    { src: "/images/vehicle-van.jpg", caption: "Passenger Van" },
    { src: "/images/vehicle-bus.jpg", caption: "Commercial Bus" },
];

export default function GalleryPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Gallery</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Product photos, events, facility images, and customer delivery pictures.</p>
                </div>
            </section>
            <section className="py-20">
                <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div key={img.caption} className="rounded-lg overflow-hidden border bg-card group cursor-pointer">
                            <div className="aspect-video overflow-hidden relative">
                                <Image src={img.src} alt={img.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                            </div>
                            <div className="p-4">
                                <p className="font-display font-semibold text-foreground text-sm">{img.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
