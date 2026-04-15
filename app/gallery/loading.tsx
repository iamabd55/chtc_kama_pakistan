import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center space-y-4">
                    <Skeleton className="h-12 w-72 max-w-full mx-auto bg-white/10" />
                    <Skeleton className="h-5 w-[min(42rem,90vw)] mx-auto bg-white/10" />
                </div>
            </section>
            <section className="py-12 md:py-16">
                <div className="container">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="rounded-lg border bg-card overflow-hidden">
                                <Skeleton className="aspect-video w-full rounded-none" />
                                <div className="p-4 space-y-2">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
