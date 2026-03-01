import { Wrench, ArrowRight } from "lucide-react";

export default function FabricationPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Fabrication Services</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Vehicle customisation through Al-Bashir Custom Fabrications (al-bcf.com).</p>
                </div>
            </section>
            <section className="py-20">
                <div className="container max-w-4xl">
                    <div className="bg-card border rounded-lg p-10 text-center">
                        <Wrench className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h2 className="text-2xl font-display font-bold text-foreground mb-4">Custom Vehicle Fabrication</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
                            Need a vehicle tailored to your specific requirements? Our fabrication partner, Al-Bashir Custom Fabrications, provides world-class vehicle customisation services including box bodies, tankers, refrigerated units, and specialised configurations.
                        </p>
                        <a
                            href="https://al-bcf.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors"
                        >
                            Visit Al-BCF.com
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
