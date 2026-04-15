import { Skeleton } from "@/components/ui/skeleton";

export default function FindDealerLoading() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center space-y-4">
                    <Skeleton className="h-12 w-72 max-w-full mx-auto bg-white/10" />
                    <Skeleton className="h-5 w-[min(42rem,90vw)] mx-auto bg-white/10" />
                </div>
            </section>
            <section className="py-12 md:py-16">
                <div className="container grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
                                <Skeleton className="h-5 w-28" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-2 rounded-xl border bg-card p-6 space-y-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </section>
        </>
    );
}
