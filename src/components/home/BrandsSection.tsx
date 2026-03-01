import { Link } from "react-router-dom";

const brands = [
  { name: "Kama", desc: "Light & heavy commercial vehicles, the flagship brand of CHTC in Pakistan." },
  { name: "Joylong", desc: "Premium passenger vans and buses designed for comfort and durability." },
  { name: "Kinwin", desc: "Specialized vehicles and custom solutions for specific industry needs." },
];

const BrandsSection = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-accent font-display font-bold text-xs uppercase tracking-[0.3em] mb-3">Our Brands</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            CHTC Brands in Pakistan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={`/brands/${brand.name.toLowerCase()}`}
              className="bg-card border rounded-lg p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-24 h-24 bg-kama-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-display font-bold text-primary-foreground">{brand.name[0]}</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground mb-3 tracking-tight">{brand.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{brand.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
