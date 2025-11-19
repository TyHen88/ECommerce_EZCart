
import { ShopProductGrid } from "@/components/persona-shop/shop-product-grid"
import { getCategories, getProductsByShop, getShopByName } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Store, Star, Package, Award, CheckCircle2, Clock, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SellerProductFilters } from "@/components/persona-shop/sellerproduct-filters"
import { Badge } from "@/components/ui/badge"

export default async function ShopPage({
    params,
    searchParams,
}: {
    params: Promise<{ shop_slug: string }>
    searchParams: Promise<{ category?: string; search?: string }>
}) {
    const { shop_slug } = await params
    const search = await searchParams

    // Convert URL slug (kebab-case) to shop name format
    const shopNameSlug = shop_slug.toLowerCase()
    const shop = getShopByName(shopNameSlug)

    if (!shop) {
        notFound()
    }

    const categories = getCategories()

    // Get products for this specific shop
    const products = getProductsByShop(shopNameSlug, {
        category: search.category,
        search: search.search,
        inStock: true
    })

    return (
        <div className="w-full h-full flex flex-col min-h-screen bg-background">
            <main className="flex-1 w-full">
                {/* Shop Header */}
                <div
                    className="relative h-64 md:h-80 overflow-hidden"
                    style={{ background: shop.coverImage }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
                        <div className="flex items-end gap-6 w-full">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-full flex items-center justify-center text-5xl md:text-6xl border-4 border-background shadow-xl flex-shrink-0">
                                {shop.logo}
                            </div>
                            <div className="flex-1 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl md:text-4xl font-bold">{shop.shopName}</h1>
                                    {shop.verified && (
                                        <CheckCircle2 className="w-6 h-6 text-primary" />
                                    )}
                                    {shop.featured && (
                                        <Badge className="bg-yellow-500 text-yellow-950 border-0">
                                            <Award className="w-3 h-3 mr-1" />
                                            FEATURED
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-lg md:text-xl text-white/90 font-semibold mb-2">{shop.brandName}</p>
                                <div className="flex items-center gap-4 flex-wrap text-sm">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{shop.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Store className="w-4 h-4" />
                                        <span>Owner: {shop.owner}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Member since {shop.memberSince}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <Link href="/shop">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to All Shops
                        </Button>
                    </Link>

                    {/* Shop Stats */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-2xl font-bold">{shop.rating}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{shop.totalReviews} Reviews</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold mb-2">{shop.totalProducts}</div>
                                    <p className="text-sm text-muted-foreground">Products</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold mb-2">{shop.followers.toLocaleString()}</div>
                                    <p className="text-sm text-muted-foreground">Followers</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold mb-2">{shop.responseTime}</div>
                                    <p className="text-sm text-muted-foreground">Response Time</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shop Description & Badges */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="md:col-span-2">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">About {shop.shopName}</h2>
                                <p className="text-muted-foreground mb-4">{shop.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {shop.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Shop Badges</h3>
                                <div className="space-y-2">
                                    {shop.badges.map((badge, idx) => (
                                        <Badge key={idx} variant="default" className="w-full justify-center">
                                            {badge}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Products Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold">Welcome to {shop.shopName}'s Products</h2>
                                <p className="text-muted-foreground mt-1">
                                    {products.length} {products.length === 1 ? "product" : "products"} available
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                            <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-20">
                                <SellerProductFilters
                                    categories={categories}
                                    currentCategory={search.category}
                                    currentSearch={search.search}
                                    shop_slug={shop_slug}
                                />
                            </aside>

                            <div className="flex-1 min-w-0">
                                {products.length > 0 ? (
                                    <ShopProductGrid products={products.map(product => ({
                                        ...product,
                                        image_url: product.image_url?.[0]?.url || ""
                                    }))} shop_slug={shop_slug} />
                                ) : (
                                    <Card>
                                        <CardContent className="p-12 text-center">
                                            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                            <h3 className="text-lg font-semibold mb-2">No products found</h3>
                                            <p className="text-muted-foreground">
                                                {search.search || search.category
                                                    ? "Try adjusting your filters"
                                                    : "This shop doesn't have any products yet"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
