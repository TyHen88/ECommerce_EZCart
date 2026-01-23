import { Skeleton } from "../ui/skeleton"

const BlogDetailSkeleton = () => {
    return (
        <article className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
            {/* Back Button */}
            <Skeleton className="h-9 w-32 mb-6" />

            {/* Header */}
            <div className="mb-8 space-y-4">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-3/4" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <Skeleton className="aspect-video w-full rounded-lg mb-8" />

            {/* Content */}
            <div className="prose max-w-none space-y-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className={`h-4 w-full ${i % 3 === 0 ? 'w-5/6' : ''}`} />
                ))}
                <Skeleton className="h-64 w-full rounded-lg my-8" />
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className={`h-4 w-full ${i % 3 === 0 ? 'w-4/5' : ''}`} />
                ))}
            </div>

            {/* Related Posts */}
            <div className="mt-16 space-y-6">
                <Skeleton className="h-7 w-48" />
                <div className="grid gap-6 md:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-video w-full rounded-lg" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        </article>
    )
}

export default BlogDetailSkeleton

