import { Skeleton } from "../ui/skeleton"
import { Card, CardContent } from "../ui/card"

const HomePageSkeleton = () => {
    return (
        <div className="min-h-screen w-full">
            {/* Hero Section */}
            <section className="relative w-full h-[60vh] flex items-center justify-center">
                <Skeleton className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 text-center space-y-4 px-4">
                    <Skeleton className="h-12 w-96 mx-auto" />
                    <Skeleton className="h-6 w-64 mx-auto" />
                    <Skeleton className="h-12 w-40 mx-auto rounded" />
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4 py-12">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-0">
                                <Skeleton className="aspect-square w-full rounded-t-lg" />
                                <div className="p-4 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-4 py-12">
                <Skeleton className="h-8 w-40 mb-8" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-0">
                                <Skeleton className="aspect-video w-full rounded-t-lg" />
                                <div className="p-4">
                                    <Skeleton className="h-6 w-32 mx-auto" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default HomePageSkeleton

