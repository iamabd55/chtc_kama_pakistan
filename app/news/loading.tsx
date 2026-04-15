import { Skeleton } from "@/components/ui/skeleton";

export default function NewsLoading() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center space-y-4">
                    <Skeleton className="h-12 w-72 max-w-full mx-auto bg-white/10" />
                    <Skeleton className="h-5 w-[min(42rem,90vw)] mx-auto bg-white/10" />
                </div>
            </section>
            <section className="py-12 md:py-16">
                <div className="container max-w-4xl space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border bg-card p-5 md:p-6 space-y-4">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-4/5" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="aspect-[16/9] w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
