import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardHeader } from "../ui/card"

const AuthPageSkeleton = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <Skeleton className="h-4 w-16 bg-background" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="text-center text-sm">
                        <Skeleton className="h-4 w-48 mx-auto" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AuthPageSkeleton

