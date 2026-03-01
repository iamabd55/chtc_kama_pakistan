import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GetQuotePage = () => (
  <Layout>
    <section className="py-16 bg-kama-gradient">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Get a Quote</h1>
        <p className="text-primary-foreground/70 max-w-xl mx-auto">Fill out the form below and our sales team will contact you with a personalized quote.</p>
      </div>
    </section>
    <section className="py-20">
      <div className="container max-w-2xl">
        <div className="bg-card border rounded-lg p-8">
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name *" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" placeholder="Company Name" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="email" placeholder="Email *" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="tel" placeholder="Phone *" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <select className="w-full px-4 py-3 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Vehicle Category *</option>
              <option>Light Trucks</option>
              <option>Heavy Trucks</option>
              <option>Vans</option>
              <option>Cargo Vans</option>
              <option>Buses</option>
              <option>Special Vehicles</option>
            </select>
            <input type="text" placeholder="City / Province" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            <textarea rows={4} placeholder="Additional Requirements" className="w-full px-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors flex items-center justify-center gap-2">
              Submit Quote Request
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  </Layout>
);

export default GetQuotePage;
