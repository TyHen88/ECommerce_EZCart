import { Skeleton } from "../ui/skeleton"

const PaymentMethodDialogSkeleton = () => {
    return (
        <div className="max-w-md w-full p-0 overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b">
                <Skeleton className="h-6 w-40" />
            </div>
            <div className="w-full px-6 py-2 space-y-4">
                <Skeleton className="h-4 w-64" />
                <div className="space-y-4 mt-4">
                    {/* Payment option 1 */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-12 rounded" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <Skeleton className="w-5 h-5 rounded-full" />
                    </div>
                    {/* Payment option 2 */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-12 rounded" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-9" />
                                    <Skeleton className="h-5 w-9" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="w-5 h-5 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="w-full px-6 pb-4">
                <div className="flex flex-row-reverse gap-2 w-full">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
    )
}

export default PaymentMethodDialogSkeleton

