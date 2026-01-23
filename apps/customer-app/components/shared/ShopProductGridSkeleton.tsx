import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

const ShopProductGridSkeleton = () => {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader className="p-0">
                        <Skeleton className="aspect-square w-full rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="flex-1 p-6 flex flex-col">
                        <Skeleton className="h-5 w-20 mb-2 rounded-full" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <div className="flex items-center justify-between mt-auto">
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 gap-2 flex items-stretch">
                        <Skeleton className="h-10 flex-1 rounded" />
                        <Skeleton className="h-10 flex-1 rounded" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default ShopProductGridSkeleton

