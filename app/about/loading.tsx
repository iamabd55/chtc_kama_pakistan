import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center space-y-4">
                    <Skeleton className="h-12 w-72 max-w-full mx-auto bg-white/10" />
                    <Skeleton className="h-5 w-[min(48rem,90vw)] mx-auto bg-white/10" />
                    <Skeleton className="h-4 w-40 mx-auto bg-white/10" />
                </div>
            </section>
            <section className="py-20">
                <div className="container space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card p-5 space-y-4">
                                <Skeleton className="aspect-[4/5] w-full max-w-[280px] rounded-lg" />
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
