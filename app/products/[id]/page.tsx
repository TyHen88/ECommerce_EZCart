"use client"
import { ProductGrid } from "@/components/product-grid"
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
import { getProductById, getProducts } from "@/lib/data"
import { Product } from "@/lib/types"
import { useCartStore } from "@/stores"
import { ArrowLeft, BookmarkIcon, CheckIcon, Package, RotateCcw, Shield, ShoppingCartIcon, Star, Tag, Truck, XIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { paywaysService } from "@/service/payways.service"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const product = id ? getProductById(id) : null
  const { addItem, removeItem, items } = useCartStore();
  const router = useRouter()
  const [isPaywayLoading, setIsPaywayLoading] = useState(false)
  const [isPaywayQrLoading, setIsPaywayQrLoading] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [qrModalData, setQrModalData] = useState<{
    imgSrc?: string
    qrString?: string
    qrUrl?: string
    deeplink?: string
    appStore?: string
    playStore?: string
  } | null>(null)

  const openQrModal = (data: {
    imgSrc?: string
    qrString?: string
    qrUrl?: string
    deeplink?: string
    appStore?: string
    playStore?: string
  }) => {
    setQrModalData(data)
    setIsQrModalOpen(true)
  }
  // Get related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product) return []
    const allProducts = getProducts({ category: product.category, inStock: true })
    return allProducts.filter(p => p.id !== product.id).slice(0, 6)
  }, [product])

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

  const testPayWay = async () => {
    if (!product) return
    setIsPaywayLoading(true)

    try {
      const payload = {
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        phone: "012345678",
        type: "purchase",
        payment_option: "abapay_khqr",
        items: [
          {
            name: product.name,
            quantity: 1,
            price: product.price.toFixed(2),
          },
        ],
        shipping: "0",
        amount: 10,
        currency: "USD",
      }

      const response = await paywaysService.payway(payload)
      const data = response?.data

      if (process.env.NODE_ENV === "development") {
        console.log("Payway response:", response)
      }

      if (response.status >= 400) {
        const message =
          data?.message || data?.paywayBody || data?.error || "Payway failed"
        toast.error(message)
        return
      }

      const checkoutUrl = data?.checkoutUrl
      if (checkoutUrl) {
        window.location.href = checkoutUrl
        return
      }

      const qrUrl =
        data?.data?.checkout_qr_url ||
        data?.checkout_qr_url ||
        data?.data?.qr_image_url ||
        data?.qr_image_url

      const qrImage =
        data?.data?.qr_image ||
        data?.qr_image ||
        data?.qrImage ||
        data?.data?.qrImage

      const qrString =
        data?.data?.qr_string ||
        data?.qr_string ||
        data?.qrString ||
        data?.data?.qrString

      const deeplink = data?.abapay_deeplink || data?.data?.abapay_deeplink
      const appStore = data?.app_store || data?.data?.app_store
      const playStore = data?.play_store || data?.data?.play_store

      if (qrUrl) {
        openQrModal({
          qrUrl,
          deeplink,
          appStore,
          playStore,
        })
        toast.success("QR generated")
        return
      }

      if (typeof qrImage === "string" && qrImage.length > 0) {
        const isDataUrl = qrImage.startsWith("data:")
        const imgSrc = isDataUrl
          ? qrImage
          : `data:image/png;base64,${qrImage}`
        openQrModal({
          imgSrc,
          deeplink,
          appStore,
          playStore,
        })
        toast.success("QR generated")
        return
      }

      if (typeof qrString === "string" && qrString.length > 0) {
        openQrModal({
          qrString,
          deeplink,
          appStore,
          playStore,
        })
        toast.success("QR generated")
        return
      }

      const html = data?.paywayHtml
      if (html) {
        try {
          sessionStorage.setItem("payway_html", html)
          router.push("/payway/view")
        } catch {
          toast.error("Unable to open PayWay checkout.")
        }
        return
      }

      toast.error("Payway returned no checkout URL")
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Payway test failed"
      toast.error(message)
      if (process.env.NODE_ENV === "development") {
        console.error("Payway test error:", error)
      }
    } finally {
      setIsPaywayLoading(false)
    }
  }

  const testPayWayQr = async () => {
    if (!product) return
    setIsPaywayQrLoading(true)

    try {
      const payload = {
        first_name: "ABA",
        last_name: "Bank",
        email: "aba.bank@gmail.com",
        phone: "012345678",
        amount: Number(product.price.toFixed(2)),
        purchase_type: "purchase",
        payment_option: "abapay_khqr",
        items:
          typeof window !== "undefined"
            ? btoa(
              unescape(
                encodeURIComponent(
                  JSON.stringify([
                    {
                      name: product.name,
                      quantity: 1,
                      price: product.price.toFixed(2),
                    },
                  ])
                )
              )
            )
            : Buffer.from(
              JSON.stringify([
                {
                  name: product.name,
                  quantity: 1,
                  price: product.price.toFixed(2),
                },
              ])
            ).toString("base64"),
        currency: "USD",
        callback_url: "https://api.callback.com/notify",
        lifetime: 6,
        qr_image_template: "template3_color",
      }

      const response = await paywaysService.generateQr(payload)
      const data = response?.data

      if (process.env.NODE_ENV === "development") {
        console.log("Payway QR response:", response)
      }

      if (response.status >= 400) {
        const message =
          data?.message || data?.paywayBody || data?.error || "Payway QR failed"
        toast.error(message)
        return
      }

      const qrUrl =
        data?.data?.checkout_qr_url ||
        data?.checkout_qr_url ||
        data?.data?.qr_image_url ||
        data?.qr_image_url

      const qrImage =
        data?.data?.qr_image ||
        data?.qr_image ||
        data?.qrImage ||
        data?.data?.qrImage

      const qrString =
        data?.data?.qr_string ||
        data?.qr_string ||
        data?.qrString ||
        data?.data?.qrString

      const deeplink = data?.abapay_deeplink || data?.data?.abapay_deeplink
      const appStore = data?.app_store || data?.data?.app_store
      const playStore = data?.play_store || data?.data?.play_store

      if (qrUrl) {
        openQrModal({
          qrUrl,
          deeplink,
          appStore,
          playStore,
        })
        toast.success("QR generated")
        return
      }

      if (typeof qrImage === "string" && qrImage.length > 0) {
        const isDataUrl = qrImage.startsWith("data:")
        const imgSrc = isDataUrl
          ? qrImage
          : `data:image/png;base64,${qrImage}`
        openQrModal({
          imgSrc,
          deeplink,
          appStore,
          playStore,
        })
        toast.success("QR generated")
        return
      }

      if (typeof qrString === "string" && qrString.length > 0) {
        openQrModal({
          qrString,
          deeplink,
          appStore,
          playStore,
        })
        toast.success("QR generated")
        return
      }

      toast.error("Payway QR returned no image")
    } catch (error: any) {
      const message =
        error?.message || error?.response?.data?.message || "Payway QR failed"
      toast.error(message)
      if (process.env.NODE_ENV === "development") {
        console.error("Payway QR error:", error)
      }
    } finally {
      setIsPaywayQrLoading(false)
    }
  }

  const isInCart = items.some(p => p.id === product.id)

  return (
    <main className="min-h-screen bg-background w-full">
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-background shadow-xl border p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">PayWay QR</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsQrModalOpen(false)}
                aria-label="Close QR modal"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            {qrModalData?.imgSrc && (
              <div className="flex justify-center">
                <img
                  src={qrModalData.imgSrc}
                  alt="PayWay QR"
                  className="max-w-full h-auto rounded-md border"
                />
              </div>
            )}

            {qrModalData?.qrUrl && (
              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() => window.open(qrModalData.qrUrl, "_blank")}
                >
                  Open QR URL
                </Button>
              </div>
            )}

            {qrModalData?.qrString && (
              <div className="mt-4 text-xs break-all font-mono bg-muted/50 p-3 rounded">
                {qrModalData.qrString}
              </div>
            )}

            {(qrModalData?.deeplink ||
              qrModalData?.appStore ||
              qrModalData?.playStore) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {qrModalData?.deeplink && (
                    <Button asChild variant="secondary">
                      <a href={qrModalData.deeplink}>Open ABA App</a>
                    </Button>
                  )}
                  {qrModalData?.appStore && (
                    <Button asChild variant="outline">
                      <a href={qrModalData.appStore} target="_blank">
                        App Store
                      </a>
                    </Button>
                  )}
                  {qrModalData?.playStore && (
                    <Button asChild variant="outline">
                      <a href={qrModalData.playStore} target="_blank">
                        Play Store
                      </a>
                    </Button>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        {/* Main Product Section */}
        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          {/* Image Carousel */}
          <div className="relative w-full">
            <Card className="overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.image_url?.map((image: { url: string; alt: string } | null, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full aspect-square bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                        <Image
                          src={image?.url || ""}
                          alt={image?.alt || product.name}
                          fill
                          priority={index === 0}
                          className="object-contain p-4 md:p-8 transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {product.image_url && product.image_url.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 h-10 w-10 shadow-lg hover:shadow-xl transition-shadow" />
                    <CarouselNext className="right-4 h-10 w-10 shadow-lg hover:shadow-xl transition-shadow" />
                  </>
                )}
              </Carousel>

              {/* Image Thumbnails */}
              {product.image_url && product.image_url.length > 1 && (
                <div className="flex justify-center gap-2 p-4 border-t">
                  {product.image_url.map((image: { url: string; alt: string } | null, index: number) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded-md overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer"
                    >
                      <Image
                        src={image?.url || ""}
                        alt={image?.alt || `Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Category & Title */}
            <div className="mb-6">
              {product.category && (
                <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                  <Badge variant="secondary" className="mb-3 hover:bg-secondary/80 transition-colors cursor-pointer">
                    <Tag className="mr-1 h-3 w-3" />
                    {product.category}
                  </Badge>
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-4xl md:text-5xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                {product.stock > 0 && (
                  <Badge variant="outline" className="text-sm">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    4.8 Rating
                  </Badge>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <Card className="mb-6 border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${product.stock > 0 ? 'bg-green-100' : 'bg-destructive/10'}`}>
                      <Package className={`h-5 w-5 ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`} />
                    </div>
                    <div>
                      <p className="font-semibold">Availability</p>
                      {product.stock > 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {product.stock > 10
                            ? "In Stock - Ready to ship"
                            : `Only ${product.stock} left in stock`}
                        </p>
                      ) : (
                        <p className="text-sm text-destructive">Out of Stock</p>
                      )}
                    </div>
                  </div>
                  {product.stock > 0 && (
                    <Badge
                      variant={product.stock > 10 ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {product.stock > 10 ? "In Stock" : "Low Stock"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Over $50</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30 Days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">Protected</p>
                </CardContent>
              </Card>
            </div>

            {/* Add to Cart Button */}
            {/* Add to Cart Button */}
            <div className="flex flex-row justify-between gap-2 mb-6">
              <Button
                size="lg"
                className="w-1/2 h-10 text-sm cursor-pointer"
                disabled={product.stock === 0}
                onClick={() => router.push(`/checkout`)}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Checkout
              </Button>
              <Button
                className={`w-1/2 h-10 text-sm cursor-pointer ${isInCart ? "bg-green-600 hover:bg-green-700" : ""}`}
                variant="outline"
                size="lg"
                disabled={product.stock === 0}
                onClick={() => handleToggleCart(product as unknown, !isInCart)}
              >
                <BookmarkIcon className="h-5 w-5 mr-2" />
                {isInCart ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full h-10 text-sm"
                  onClick={testPayWay}
                  disabled={isPaywayLoading}
                >
                  {isPaywayLoading ? "Testing Payway..." : "Test Payway"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full h-10 text-sm mt-2"
                  onClick={testPayWayQr}
                  disabled={isPaywayQrLoading}
                >
                  {isPaywayQrLoading ? "Generating QR..." : "Test Payway QR"}
                </Button>
              </div>
            )}

            {/* Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description || "No description available for this product."}
                </p>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock Available</span>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="font-medium">#{product.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products Section is for products from multiple sellers */}
        {relatedProducts.length > 0 && (
          <section className="border-t pt-12">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Related Products</h2>
              <p className="text-muted-foreground">
                You might also like these {product.category} products
              </p>
            </div>
            <ProductGrid products={relatedProducts.map(p => ({
              ...p,
              image_url: p.image_url?.[0]?.url || ""
            }))} />
          </section>
        )}
      </div>
    </main>
  )
}
