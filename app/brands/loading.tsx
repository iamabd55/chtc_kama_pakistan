import { Skeleton } from "@/components/ui/skeleton";

export default function BrandsLoading() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center space-y-4">
                    <Skeleton className="h-12 w-64 max-w-full mx-auto bg-white/10" />
                    <Skeleton className="h-5 w-[min(44rem,90vw)] mx-auto bg-white/10" />
                </div>
            </section>
            <section className="py-20">
                <div className="container max-w-4xl space-y-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-card rounded-lg border p-8 flex flex-col md:flex-row items-center gap-8">
                            <Skeleton className="h-20 w-32 rounded-xl" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                            <Skeleton className="h-10 w-40 rounded-md" />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
