import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardHeader } from "../ui/card"

const CheckoutSkeleton = () => {
    return (
        <div className="w-full h-full flex flex-col min-h-screen bg-background">
            <main className="flex-1 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Skeleton className="h-10 w-10 rounded" />
                        <Skeleton className="h-9 w-48" />
                    </div>

                    {/* Steps Navigation */}
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-px" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-px" />
                        <Skeleton className="h-5 w-24" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-40" />
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-48" />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-4">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <Skeleton className="h-6 w-40" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Order Items */}
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex gap-4">
                                            <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-2/3" />
                                                <Skeleton className="h-5 w-16" />
                                            </div>
                                        </div>
                                    ))}

                                    <div className="border-t pt-4 space-y-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                        <div className="flex justify-between pt-2 border-t">
                                            <Skeleton className="h-6 w-16" />
                                            <Skeleton className="h-6 w-24" />
                                        </div>
                                    </div>

                                    <Skeleton className="h-12 w-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CheckoutSkeleton

