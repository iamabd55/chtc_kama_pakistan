import { Calendar } from "lucide-react";

const newsItems = [
    { title: "CHTC Kama Launches New Heavy-Duty Truck Series", date: "Feb 15, 2026", excerpt: "The latest addition to our heavy truck lineup features improved fuel efficiency and enhanced payload capacity." },
    { title: "Expanded Dealer Network in Punjab", date: "Jan 28, 2026", excerpt: "Five new authorized dealerships opened across Punjab, bringing our total network to over 100 locations." },
    { title: "CHTC Kama at Pakistan Auto Show 2026", date: "Jan 10, 2026", excerpt: "Visit our booth at the upcoming Pakistan Auto Show to see our complete range of commercial vehicles." },
    { title: "New After-Sales Service Center in Karachi", date: "Dec 20, 2025", excerpt: "A state-of-the-art service center now serving the greater Karachi metropolitan area." },
];

export default function NewsPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">News & Events</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Latest company news, press releases, product launches, and event coverage.</p>
                </div>
            </section>
            <section className="py-20">
                <div className="container max-w-4xl space-y-6">
                    {newsItems.map((item) => (
                        <article key={item.title} className="bg-card border rounded-lg p-8 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                <Calendar className="w-4 h-4" />
                                {item.date}
                            </div>
                            <h3 className="font-display font-bold text-xl text-foreground mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.excerpt}</p>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
