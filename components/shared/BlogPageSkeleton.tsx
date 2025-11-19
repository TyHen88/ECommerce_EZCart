import { Skeleton } from "../ui/skeleton"
import { Card, CardContent } from "../ui/card"

const BlogPageSkeleton = () => {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-0">
                            <Skeleton className="aspect-video w-full rounded-t-lg" />
                            <div className="p-6 space-y-3">
                                <Skeleton className="h-5 w-24 rounded-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-10 w-32 mt-4" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default BlogPageSkeleton

