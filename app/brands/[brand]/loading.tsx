import { Skeleton } from "@/components/ui/skeleton";

export default function BrandLoading() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <Skeleton className="h-4 w-28 mx-auto mb-4 bg-white/10" />
                    <Skeleton className="h-10 w-48 mx-auto mb-4 bg-white/10" />
                    <Skeleton className="h-5 w-80 max-w-full mx-auto bg-white/10" />
                </div>
            </section>
            <section className="py-20">
                <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-card rounded-lg border overflow-hidden">
                            <Skeleton className="aspect-video w-full rounded-none" />
                            <div className="p-6 space-y-3">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
