import { Skeleton } from "../ui/skeleton"

const HeaderSkeleton = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full max-w-full h-16 px-4 md:px-6 flex items-center justify-between mx-auto">
                {/* Left (Logo/brand) */}
                <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="h-6 w-32 hidden sm:block" />
                </div>

                {/* Right navigation/actions */}
                <nav className="flex items-center gap-3 sm:gap-4">
                    <Skeleton className="h-9 w-20 hidden sm:block" />
                    <Skeleton className="h-9 w-20 hidden sm:block" />
                    <Skeleton className="h-8 w-24 hidden md:block" />
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </nav>
            </div>
        </header>
    )
}

export default HeaderSkeleton

