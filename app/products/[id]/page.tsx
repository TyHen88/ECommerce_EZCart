"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getProductById } from "@/lib/data"
import { Product } from "@/lib/types"
import { useCartStore } from "@/stores"
import { ArrowLeft, CheckIcon, Package, ShoppingCartIcon, Tag, XIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const product = id ? getProductById(id) : null
  const { addItem, removeItem, items } = useCartStore();

  if (!product) {
    notFound()
  }

  const handleToggleCart = (product: unknown, checked: boolean) => {
    const productData = product as Product;
    if (checked) {
      // Add to cart
      addItem({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image_url: productData.image_url || "",
        category: productData.category || ""
      })
      toast(`${productData.name} has been added.`, {
        icon: <CheckIcon className="text-green-500 w-5 h-5" />
      })
    } else {
      // Remove from cart
      removeItem(productData.id)
      toast(`${productData.name} has been removed.`, {
        icon: <XIcon className="text-red-500 w-5 h-5" />
      })
    }
  }

  useEffect(() => {
    // Update cart items when page is loaded
    const cartItems = localStorage.getItem('cart-items')
    if (cartItems) {
      const cartItemsArray = JSON.parse(cartItems)
      cartItemsArray.forEach((item: any) => {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          category: item.category
        })
      })
    }
  }, [])

  return (
    <>
      <main className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full py-8 px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>

          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Carousel Container */}
            <div className="relative w-full max-w-lg mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.image_url?.map((image: { url: string; alt: string } | null, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-xl overflow-hidden border border-border/50 shadow-sm">
                        <Image
                          src={image?.url || ""}
                          alt={image?.alt || ""}
                          fill
                          priority={index === 0}
                          className="object-contain p-4 transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 h-10 w-10 shadow-md hover:shadow-lg transition-shadow" />
                <CarouselNext className="right-4 h-10 w-10 shadow-md hover:shadow-lg transition-shadow" />
              </Carousel>

              {/* Image indicators */}
              {product.image_url && product.image_url.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {product.image_url.map((_: any, index: number) => (
                    <div
                      key={index}
                      className="h-1.5 w-8 rounded-full bg-muted transition-colors"
                      aria-label={`Image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                {product.category && (
                  <Badge variant="secondary" className="mb-2">
                    <Tag className="mr-1 h-3 w-3" />
                    {product.category}
                  </Badge>
                )}
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-balance">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">Availability:</span>
                  </div>
                  {product.stock > 0 ? (
                    <Badge
                      variant={product.stock > 10 ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {product.stock > 10
                        ? "In Stock"
                        : `Only ${product.stock} left in stock`}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-sm">
                      Out of Stock
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              <div className="mt-auto flex flex-col items-stretch gap-3">
                <Button
                  size="lg"
                  className={`w-full flex items-center justify-center gap-2 ${items.some(p => p.id === product.id) ? "bg-green-600 hover:bg-green-700" : ""}`}
                  disabled={product.stock === 0}
                  onClick={() =>
                    handleToggleCart(
                      product as unknown,
                      !items.some((p) => p.id === product.id)
                    )
                  }
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-1" />
                  <span>
                    {items.some((p) => p.id === product.id) ? "In Cart" : "Add to Cart"}
                  </span>
                </Button>
                <div className="w-full flex flex-row items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground text-center">
                    Free shipping on orders over <span className="font-semibold">$50</span>
                  </span>
                  <span
                    className={`text-xs font-medium rounded-lg px-2 py-1 inline-block
                      ${product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-destructive/10 text-destructive"
                      }
                    `}
                  >
                    {product.stock > 0
                      ? (product.stock > 10 ? "In Stock" : `Only ${product.stock} left!`)
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}