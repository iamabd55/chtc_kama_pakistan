import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
    return (
        <>
            {/* Hero skeleton */}
            <section className="relative h-[70vh] min-h-[400px]">
                <Skeleton className="w-full h-full rounded-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container text-center space-y-4">
                        <Skeleton className="h-12 w-3/4 max-w-lg mx-auto" />
                        <Skeleton className="h-5 w-1/2 max-w-md mx-auto" />
                        <div className="flex justify-center gap-4 pt-4">
                            <Skeleton className="h-12 w-36 rounded-sm" />
                            <Skeleton className="h-12 w-36 rounded-sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Vehicles grid skeleton */}
            <section className="py-20">
                <div className="container">
                    <div className="text-center mb-12">
                        <Skeleton className="h-8 w-48 mx-auto mb-3" />
                        <Skeleton className="h-5 w-80 mx-auto" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                                <Skeleton className="h-5 w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
