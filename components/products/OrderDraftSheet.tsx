"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { useCartStore } from "@/stores/cart.store"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function OrderDraftSheet() {
    const router = useRouter()
    const { items, removeItem } = useCartStore()


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-5 w-5" />
                    {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {items.length}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Your Wishlist</SheetTitle>
                    <SheetDescription>
                        {items.length > 0
                            ? `${items.length} ${items.length === 1 ? 'item' : 'items'} in your wishlist`
                            : "Your wishlist is empty"}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-semibold mb-2">Your wishlist is empty</p>
                            <p className="text-sm text-muted-foreground mb-6">
                                Add some products to your wishlist to get started
                            </p>
                            <Link href="/products">
                                <SheetClose asChild>
                                    <Button>Browse Products</Button>
                                </SheetClose>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4 p-4" >
                            {items.map(item => (
                                <Card key={item.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" >
                                    <div className="flex gap-4 items-center">
                                        {/* Product Image */}
                                        <SheetClose asChild>
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted border" onClick={() => router.push(`/products/${item.id}`)}>
                                                {item.image_url ? (
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                        </SheetClose>


                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                                                        {item.name}
                                                    </h3>
                                                    {item.category && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {item.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Price and Quantity Controls */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-bold text-primary">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                    {item.quantity > 1 && (
                                                        <span className="text-xs text-muted-foreground">
                                                            ${item.price.toFixed(2)} each
                                                        </span>
                                                    )}
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>


            </SheetContent>
        </Sheet>
    )
}
