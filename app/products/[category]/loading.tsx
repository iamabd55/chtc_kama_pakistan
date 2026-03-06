import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
    return (
        <>
            {/* Hero */}
            <section className="py-14 md:py-20 bg-kama-gradient relative overflow-hidden">
                <div className="container relative z-10">
                    <Skeleton className="h-4 w-28 mb-6 bg-white/10" />
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <Skeleton className="h-12 w-56 mb-3 bg-white/10" />
                            <Skeleton className="h-5 w-80 max-w-full bg-white/10" />
                        </div>
                        <Skeleton className="h-9 w-28 rounded-full bg-white/10" />
                    </div>
                </div>
            </section>

            {/* Toolbar + Grid */}
            <section className="py-12 md:py-20">
                <div className="container">
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <Skeleton className="h-10 flex-1 rounded-lg" />
                        <Skeleton className="h-10 w-[170px] rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-card rounded-xl border overflow-hidden">
                                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                                <div className="p-5 space-y-3">
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="flex gap-2.5 pt-1">
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                        <Skeleton className="h-5 w-12" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
