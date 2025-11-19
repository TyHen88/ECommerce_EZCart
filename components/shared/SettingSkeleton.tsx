import { Skeleton } from "../ui/skeleton"

const SettingSkeleton = () => {
    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl animate-pulse">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Skeleton */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3">
                                <Skeleton className="w-5 h-5 rounded-md" />
                                <Skeleton className="h-4 w-32 rounded" />
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Content Area Skeleton (only header and profile fields, not all sections) */}
                <div className="flex-1 min-w-0 space-y-6">
                    {/* Header */}
                    <div>
                        <Skeleton className="h-8 w-56 mb-2" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    {/* Accordion - Only Profile Section Skeleton */}
                    <div className="border rounded-lg px-6 shadow-sm bg-card py-8 space-y-8">
                        {/* Profile avatar, camera button */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Skeleton className="w-24 h-24 rounded-full" />
                                <Skeleton className="absolute bottom-0 right-0 w-8 h-8 rounded-full" />
                            </div>
                        </div>
                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                        {/* Action Buttons Skeleton */}
                        <div className="flex gap-3 pt-4">
                            <Skeleton className="h-10 w-24 rounded" />
                            <Skeleton className="h-10 w-32 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingSkeleton