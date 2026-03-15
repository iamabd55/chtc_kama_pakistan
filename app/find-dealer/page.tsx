import { createClient } from "@/lib/supabase/server";
import type { Dealer } from "@/lib/supabase/types";
import DealerDirectory from "@/components/find-dealer/DealerDirectory";

export const revalidate = 60;

export default async function FindDealerPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("dealers")
        .select("*")
        .eq("is_active", true)
        .order("city", { ascending: true })
        .order("name", { ascending: true });

    const dealers = (data ?? []) as Dealer[];

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Find a Dealer</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Locate authorized CHTC Kama dealers across Pakistan. Filter by city, province, or service type.</p>
                </div>
            </section>
            <DealerDirectory dealers={dealers} />
        </>
    );
}
