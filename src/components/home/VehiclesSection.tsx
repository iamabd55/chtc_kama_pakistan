import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import vehicleLightTruck from "@/assets/vehicle-light-truck.jpg";
import vehicleHeavyTruck from "@/assets/vehicle-heavy-truck.jpg";
import vehicleVan from "@/assets/vehicle-van.jpg";
import vehicleCargo from "@/assets/vehicle-cargo.jpg";
import vehicleBus from "@/assets/vehicle-bus.jpg";

const vehicles = [
  { name: "Light Trucks", image: vehicleLightTruck, href: "/products/light-trucks" },
  { name: "Heavy Trucks", image: vehicleHeavyTruck, href: "/products/heavy-trucks" },
  { name: "Vans", image: vehicleVan, href: "/products/vans" },
  { name: "Cargo Vans", image: vehicleCargo, href: "/products/cargo-vans" },
  { name: "Buses", image: vehicleBus, href: "/products/buses" },
];

const VehiclesSection = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Our Range</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Explore Our Vehicles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle.name}
              to={vehicle.href}
              className="group relative bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-display font-bold text-foreground tracking-tight">{vehicle.name}</h3>
                <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehiclesSection;
