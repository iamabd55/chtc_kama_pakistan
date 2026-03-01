import Layout from "@/components/Layout";
import vehicleLightTruck from "@/assets/vehicle-light-truck.jpg";
import vehicleHeavyTruck from "@/assets/vehicle-heavy-truck.jpg";
import vehicleVan from "@/assets/vehicle-van.jpg";
import vehicleBus from "@/assets/vehicle-bus.jpg";

const images = [
  { src: vehicleLightTruck, caption: "Light Commercial Vehicle" },
  { src: vehicleHeavyTruck, caption: "Heavy Duty Truck" },
  { src: vehicleVan, caption: "Passenger Van" },
  { src: vehicleBus, caption: "Commercial Bus" },
];

const GalleryPage = () => (
  <Layout>
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
            <div className="aspect-video overflow-hidden">
              <img src={img.src} alt={img.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="p-4">
              <p className="font-display font-semibold text-foreground text-sm">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default GalleryPage;
