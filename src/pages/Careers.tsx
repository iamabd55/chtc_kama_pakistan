import Layout from "@/components/Layout";
import { Briefcase, MapPin } from "lucide-react";

const openings = [
  { title: "Regional Sales Manager", location: "Lahore", type: "Full-time" },
  { title: "Service Technician", location: "Karachi", type: "Full-time" },
  { title: "Marketing Executive", location: "Islamabad", type: "Full-time" },
  { title: "Parts Inventory Specialist", location: "Multan", type: "Full-time" },
];

const CareersPage = () => (
  <Layout>
    <section className="py-16 bg-kama-gradient">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Careers</h1>
        <p className="text-primary-foreground/70 max-w-xl mx-auto">Join the CHTC Kama Pakistan team. Submit your CV for open positions.</p>
      </div>
    </section>
    <section className="py-20">
      <div className="container max-w-3xl space-y-4">
        {openings.map((job) => (
          <div key={job.title} className="bg-card border rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-display font-bold text-foreground text-lg">{job.title}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.type}</span>
              </div>
            </div>
            <button className="px-6 py-2 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors shrink-0">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default CareersPage;
