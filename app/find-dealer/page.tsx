import { MapPin, Search } from "lucide-react";

const cities = [
    "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan",
    "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur",
];

export default function FindDealerPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Find a Dealer</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Locate authorized CHTC Kama dealers across Pakistan. Filter by city, province, or service type.</p>
                </div>
            </section>
            <section className="py-12">
                <div className="container">
                    <div className="max-w-md mx-auto mb-12">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by city or province..."
                                className="w-full pl-12 pr-4 py-3 border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {cities.map((city) => (
                            <div key={city} className="bg-card border rounded-lg p-5 flex items-center gap-3 hover:shadow-md hover:border-primary transition-all cursor-pointer">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="font-display font-semibold text-foreground">{city}</p>
                                    <p className="text-xs text-muted-foreground">3 dealers</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 aspect-video bg-muted rounded-lg flex items-center justify-center border">
                        <p className="text-muted-foreground font-display">Interactive Map Coming Soon</p>
                    </div>
                </div>
            </section>
        </>
    );
}
