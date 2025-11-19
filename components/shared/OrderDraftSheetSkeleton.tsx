import { Skeleton } from "../ui/skeleton"
import { Card } from "../ui/card"

const OrderDraftSheetSkeleton = () => {
    return (
        <div className="flex flex-col w-full sm:max-w-lg h-full">
            <div className="px-6 pt-6 pb-4 border-b">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-4">
                        <div className="flex gap-4 items-center">
                            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded" />
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default OrderDraftSheetSkeleton

