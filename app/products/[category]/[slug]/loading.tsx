import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
    return (
        <>
            {/* Breadcrumb + Hero */}
            <section className="py-10 md:py-14 bg-kama-gradient relative overflow-hidden">
                <div className="container relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <Skeleton className="h-4 w-16 bg-white/10" />
                        <Skeleton className="h-4 w-24 bg-white/10" />
                        <Skeleton className="h-4 w-32 bg-white/10" />
                    </div>
                    <Skeleton className="h-10 w-72 max-w-full mb-3 bg-white/10" />
                    <Skeleton className="h-5 w-96 max-w-full bg-white/10" />
                    <div className="flex items-center gap-3 mt-5">
                        <Skeleton className="h-7 w-16 rounded-full bg-white/10" />
                        <Skeleton className="h-4 w-24 bg-white/10" />
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="py-12 md:py-16">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
                        {/* Gallery */}
                        <div className="lg:col-span-3 space-y-3">
                            <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                            <div className="flex gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="w-20 h-20 rounded-md shrink-0" />
                                ))}
                            </div>
                        </div>

                        {/* CTA + Features */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="border rounded-xl p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                </div>
                                <div className="space-y-2.5 pt-2">
                                    <Skeleton className="h-11 w-full rounded-lg" />
                                    <Skeleton className="h-11 w-full rounded-lg" />
                                    <Skeleton className="h-11 w-full rounded-lg" />
                                </div>
                            </div>
                            <div className="border rounded-xl p-6 space-y-3">
                                <Skeleton className="h-5 w-32 mb-4" />
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-4 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Specs table */}
                    <div className="mt-14 md:mt-20">
                        <Skeleton className="h-7 w-40 mb-6" />
                        <div className="border rounded-xl overflow-hidden">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className={`flex ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                                    <Skeleton className="h-11 w-1/3 rounded-none" />
                                    <Skeleton className="h-11 w-2/3 rounded-none" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Related products */}
                    <div className="mt-14 md:mt-20">
                        <Skeleton className="h-7 w-48 mb-8" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-card rounded-xl border overflow-hidden">
                                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                                    <div className="p-4 space-y-2">
                                        <Skeleton className="h-5 w-2/3" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
