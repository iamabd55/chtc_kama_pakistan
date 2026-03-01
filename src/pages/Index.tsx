import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Wrench, MapPin, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import heroTruck from "@/assets/hero-truck.jpg";
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

const stats = [
  { value: "50+", label: "Years of Excellence" },
  { value: "30+", label: "Vehicle Models" },
  { value: "100+", label: "Dealers Nationwide" },
  { value: "10,000+", label: "Vehicles Delivered" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <img
          src={heroTruck}
          alt="CHTC Kama Truck"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kama-navy/90 via-kama-navy/60 to-transparent" />
        <div className="container relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="text-accent font-display font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              CHTC Kama Pakistan
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6">
              Powering{" "}
              <span className="text-gradient-gold">Pakistan's</span>{" "}
              Future
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
              From light commercial vehicles to heavy-duty trucks — delivering performance, reliability, and value across Pakistan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors"
              >
                Explore Vehicles
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/get-quote"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary-foreground/30 text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary-foreground/10 transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-accent font-display font-semibold text-sm uppercase tracking-[0.15em] mb-2">Our Range</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Explore Our Vehicles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.name}
                to={vehicle.href}
                className="group bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">{vehicle.name}</h3>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-kama-gradient">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/70 font-display uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-accent font-display font-semibold text-sm uppercase tracking-[0.15em] mb-2">Why CHTC Kama</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Built for Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Complete Range",
                desc: "From light pickups to heavy-duty trucks, vans, and buses — we have the right vehicle for every business need.",
              },
              {
                icon: Wrench,
                title: "After Sales Support",
                desc: "Nationwide service network with genuine spare parts, scheduled maintenance, and warranty coverage.",
              },
              {
                icon: MapPin,
                title: "Dealer Network",
                desc: "100+ authorized dealers across Pakistan ensuring you're never far from sales and service support.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-card p-8 rounded-lg shadow-sm border hover:shadow-lg transition-shadow group"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHTC Brands */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-accent font-display font-semibold text-sm uppercase tracking-[0.15em] mb-2">Our Brands</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              CHTC Brands in Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Kama", desc: "Light & heavy commercial vehicles, the flagship brand of CHTC in Pakistan." },
              { name: "Joylong", desc: "Premium passenger vans and buses designed for comfort and durability." },
              { name: "Kinwin", desc: "Specialized vehicles and custom solutions for specific industry needs." },
            ].map((brand) => (
              <Link
                key={brand.name}
                to={`/brands/${brand.name.toLowerCase()}`}
                className="bg-card border rounded-lg p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-20 h-20 bg-kama-gradient rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-display font-bold text-primary-foreground">{brand.name[0]}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">{brand.name}</h3>
                <p className="text-muted-foreground text-sm">{brand.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-kama-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container relative text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready to Drive Your Business Forward?
          </h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
            Get in touch with our sales team for personalized vehicle recommendations and competitive pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/get-quote"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:opacity-90 transition-opacity"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/find-dealer"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary-foreground/30 text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary-foreground/10 transition-colors"
            >
              Find a Dealer
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
