import { Skeleton } from "../ui/skeleton"

const ProductSkeleton = () => {
    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-card p-4 rounded-lg shadow-sm flex flex-col">
                        {/* Image skeleton */}
                        <Skeleton className="h-48 w-full rounded-lg mb-4" />
                        {/* Product Title skeleton */}
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        {/* Product Subtitle skeleton */}
                        <Skeleton className="h-4 w-2/3 mb-2" />
                        {/* Price skeleton */}
                        <Skeleton className="h-5 w-1/4 mb-4" />
                        {/* Button skeleton */}
                        <div className="flex gap-2 mt-auto">
                            <Skeleton className="h-10 w-1/2 rounded" />
                            <Skeleton className="h-10 w-10 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductSkeleton