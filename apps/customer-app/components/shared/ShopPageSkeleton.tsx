import { Skeleton } from "../ui/skeleton"
import { Card, CardContent } from "../ui/card"

const ShopPageSkeleton = () => {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
            {/* Shop Header */}
            <div className="mb-8 space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-96" />
                <div className="flex gap-4">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-24" />
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-0">
                                    <Skeleton className="aspect-square w-full rounded-t-lg" />
                                    <div className="p-4 space-y-2">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-6 w-20" />
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopPageSkeleton

