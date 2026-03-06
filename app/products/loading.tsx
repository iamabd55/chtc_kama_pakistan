import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
    return (
        <>
            {/* Hero */}
            <section className="py-14 md:py-20 bg-kama-gradient relative overflow-hidden">
                <div className="container text-center relative z-10">
                    <Skeleton className="h-3 w-20 mx-auto mb-3 bg-white/10" />
                    <Skeleton className="h-12 w-72 mx-auto mb-4 bg-white/10" />
                    <Skeleton className="h-5 w-96 max-w-full mx-auto bg-white/10" />
                    <div className="flex items-center justify-center gap-6 mt-8">
                        <Skeleton className="h-4 w-24 bg-white/10" />
                        <Skeleton className="h-4 w-24 bg-white/10" />
                        <Skeleton className="h-4 w-20 bg-white/10" />
                    </div>
                </div>
            </section>

            {/* Toolbar skeleton */}
            <section className="py-12 md:py-20">
                <div className="container">
                    <div className="flex flex-col gap-4 mb-10">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Skeleton className="h-10 flex-1 rounded-lg" />
                            <Skeleton className="h-10 w-[170px] rounded-lg" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-24 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Grid skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {Array.from({ length: 6 }).map((_, i) => (
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
