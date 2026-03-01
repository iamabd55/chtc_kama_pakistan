import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import vehicleLightTruck from "@/assets/vehicle-light-truck.jpg";
import vehicleHeavyTruck from "@/assets/vehicle-heavy-truck.jpg";
import vehicleVan from "@/assets/vehicle-van.jpg";
import vehicleCargo from "@/assets/vehicle-cargo.jpg";
import vehicleBus from "@/assets/vehicle-bus.jpg";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "Light Trucks", image: vehicleLightTruck, desc: "Versatile workhorses for urban & intercity logistics.", href: "/products/light-trucks" },
  { name: "Heavy Trucks", image: vehicleHeavyTruck, desc: "Powerful haulers built for Pakistan's toughest roads.", href: "/products/heavy-trucks" },
  { name: "Vans", image: vehicleVan, desc: "Comfortable passenger transport from 6 to 18 seats.", href: "/products/vans" },
  { name: "Cargo Vans", image: vehicleCargo, desc: "Efficient cargo delivery for businesses of all sizes.", href: "/products/cargo-vans" },
  { name: "Buses", image: vehicleBus, desc: "Public and private transport with modern amenities.", href: "/products/buses" },
];

const ProductsPage = () => (
  <Layout>
    <section className="py-16 bg-kama-gradient">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Our Products</h1>
        <p className="text-primary-foreground/70 max-w-xl mx-auto">Full vehicle catalog: Light Trucks, Heavy Trucks, Vans, Cargo Vans, Buses & Special Vehicles.</p>
      </div>
    </section>
    <section className="py-20">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link key={cat.name} to={cat.href} className="group bg-card rounded-lg border overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-video overflow-hidden bg-muted">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="p-6">
              <h3 className="font-display font-bold text-xl text-foreground mb-2 flex items-center justify-between">
                {cat.name}
                <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-muted-foreground text-sm">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </Layout>
);

export default ProductsPage;
