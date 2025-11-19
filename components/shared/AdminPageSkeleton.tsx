import { Skeleton } from "../ui/skeleton"

const AdminPageSkeleton = () => {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4 border rounded-lg p-4">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminPageSkeleton

