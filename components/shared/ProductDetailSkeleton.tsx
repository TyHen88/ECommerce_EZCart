import { Skeleton } from "../ui/skeleton"
import { Card, CardContent } from "../ui/card"

const ProductDetailSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Skeleton className="h-9 w-32 mb-6" />

            {/* Main Product Section */}
            <div className="grid gap-8 lg:grid-cols-2 mb-16">
                {/* Image Carousel */}
                <div className="relative w-full">
                    <Card className="overflow-hidden">
                        <Skeleton className="aspect-square w-full" />
                        <div className="flex justify-center gap-2 p-4 border-t">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="w-16 h-16 rounded-md" />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-32" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <Skeleton className="h-5 w-32" />
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-12 flex-1" />
                        <Skeleton className="h-12 w-12" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="text-center space-y-2">
                                <Skeleton className="h-8 w-8 mx-auto" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="space-y-6">
                <Skeleton className="h-7 w-48" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
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
            </div>
        </div>
    )
}

export default ProductDetailSkeleton

