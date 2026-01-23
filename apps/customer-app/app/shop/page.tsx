"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Store, Star, Package, Award, CheckCircle2, TrendingUp, Clock, Users, Grid, List, ArrowRight, Filter } from "lucide-react"
import Link from "next/link"

export default function SellerStoresPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const categories = [
        { id: "all", name: "All Stores", count: 48 },
        { id: "furniture", name: "Furniture", count: 18 },
        { id: "decor", name: "Home Decor", count: 12 },
        { id: "lighting", name: "Lighting", count: 8 },
        { id: "textiles", name: "Textiles", count: 6 },
        { id: "outdoor", name: "Outdoor", count: 4 }
    ]

    const sellers = [
        {
            id: 1,
            shop_slug: "nordic-home-studio",
            shopName: "Nordic Home Studio",
            brandName: "NORDIC HOME",
            owner: "Emma Anderson",
            logo: "🏠",
            coverImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            rating: 4.9,
            totalReviews: 2847,
            totalProducts: 156,
            followers: 12500,
            verified: true,
            featured: true,
            category: "furniture",
            location: "Brooklyn, NY",
            memberSince: "2020",
            description: "Scandinavian-inspired furniture and home decor. Quality craftsmanship with minimalist design.",
            responseTime: "< 2 hours",
            tags: ["Scandinavian", "Minimalist", "Eco-friendly"],
            badges: ["Top Seller", "Fast Shipping"]
        },
        {
            id: 2,
            shop_slug: "luxe-living-boutique",
            shopName: "Luxe Living Boutique",
            brandName: "LUXE LIVING",
            owner: "Michael Chen",
            logo: "✨",
            coverImage: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            rating: 4.8,
            totalReviews: 1923,
            totalProducts: 203,
            followers: 8900,
            verified: true,
            featured: true,
            category: "decor",
            location: "Manhattan, NY",
            memberSince: "2019",
            description: "Premium home decor and luxury furnishings. Curated collections for sophisticated spaces.",
            responseTime: "< 3 hours",
            tags: ["Luxury", "Modern", "Premium"],
            badges: ["Verified Seller", "Best Quality"]
        },
        {
            id: 3,
            shop_slug: "artisan-wood-works",
            shopName: "Artisan Wood Works",
            brandName: "ARTISAN",
            owner: "James Wilson",
            logo: "🪵",
            coverImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            rating: 4.7,
            totalReviews: 1456,
            totalProducts: 89,
            followers: 6200,
            verified: true,
            featured: false,
            category: "furniture",
            location: "Portland, OR",
            memberSince: "2021",
            description: "Handcrafted wooden furniture made from sustainable materials. Each piece tells a story.",
            responseTime: "< 4 hours",
            tags: ["Handmade", "Sustainable", "Custom"],
            badges: ["Eco-Friendly"]
        },
        {
            id: 4,
            shop_slug: "urban-lights-co-inc",
            shopName: "Urban Lights Co Inc",
            brandName: "URBAN LIGHTS",
            owner: "Sarah Martinez",
            logo: "💡",
            coverImage: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            rating: 4.9,
            totalReviews: 3102,
            totalProducts: 124,
            followers: 15300,
            verified: true,
            featured: true,
            category: "lighting",
            location: "Los Angeles, CA",
            memberSince: "2018",
            description: "Contemporary lighting solutions for modern homes. From minimalist to statement pieces.",
            responseTime: "< 1 hour",
            tags: ["Contemporary", "LED", "Smart Home"],
            badges: ["Top Rated", "Fast Response"]
        },
        {
            id: 5,
            shop_slug: "cozy-textiles-hub",
            shopName: "Cozy Textiles Hub",
            brandName: "COZY",
            owner: "Lisa Johnson",
            logo: "🧶",
            coverImage: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            rating: 4.6,
            totalReviews: 892,
            totalProducts: 178,
            followers: 4800,
            verified: false,
            featured: false,
            category: "textiles",
            location: "Seattle, WA",
            memberSince: "2022",
            description: "Soft furnishings, cushions, and textiles to add warmth to any space.",
            responseTime: "< 5 hours",
            tags: ["Comfortable", "Colorful", "Affordable"],
            badges: ["Rising Star"]
        },
        {
            id: 6,
            shop_slug: "garden-paradise",
            shopName: "Garden Paradise",
            brandName: "GARDEN PARADISE",
            owner: "Robert Taylor",
            logo: "🌿",
            coverImage: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            rating: 4.8,
            totalReviews: 1567,
            totalProducts: 95,
            followers: 7600,
            verified: true,
            featured: false,
            category: "outdoor",
            location: "Austin, TX",
            memberSince: "2020",
            description: "Outdoor furniture and garden accessories. Transform your outdoor living space.",
            responseTime: "< 3 hours",
            tags: ["Outdoor", "Weather-resistant", "Stylish"],
            badges: ["Best Outdoor"]
        }
    ]

    // Filter sellers based on search and category
    const filteredSellers = useMemo(() => {
        return sellers.filter(seller => {
            const matchesCategory = selectedCategory === "all" || seller.category === selectedCategory
            const matchesSearch = searchQuery === "" ||
                seller.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                seller.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                seller.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                seller.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                seller.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            return matchesCategory && matchesSearch
        })
    }, [selectedCategory, searchQuery])

    const featuredSellers = sellers.filter(s => s.featured)

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Banner */}
            <section className="bg-gradient-to-br from-primary/10 via-muted/30 to-primary/10 py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Store className="w-4 h-4" />
                            <span>Discover Stores & Brands</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                            Find Your Favorite
                            <span className="block text-primary">Shops & Brands</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8">
                            Shop from trusted sellers, verified brands, and local artisans all in one place
                        </p>

                        {/* Search Bar */}
                        <div className="bg-card border rounded-lg p-2 flex items-center gap-2 shadow-lg">
                            <Search className="w-5 h-5 text-muted-foreground ml-2" />
                            <Input
                                type="text"
                                placeholder="Search by shop name, brand, owner, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 border-0 focus:ring-0 bg-transparent"
                            />
                            <Button>
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Filter by Category</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category.id)}
                                className="relative"
                            >
                                {category.name}
                                <Badge variant="secondary" className="ml-2 text-xs">
                                    {category.count}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            {selectedCategory === "all" ? "All Stores" : categories.find(c => c.id === selectedCategory)?.name}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {filteredSellers.length} {filteredSellers.length === 1 ? "store" : "stores"} found
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === "grid" ? "default" : "outline"}
                            size="icon"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "outline"}
                            size="icon"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Featured Stores Section */}
                {selectedCategory === "all" && searchQuery === "" && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" />
                                    Featured Stores
                                </h3>
                                <p className="text-muted-foreground text-sm mt-1">Top-rated sellers handpicked for you</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredSellers.map((seller, idx) => (
                                <Link key={seller.id} href={`/shop/${seller.shop_slug}`}>
                                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 hover:border-primary/50 group cursor-pointer h-full flex flex-col"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <CardHeader className="p-0 relative">
                                            <div
                                                className="h-32 relative"
                                                style={{ background: seller.coverImage }}
                                            >
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-yellow-500 text-yellow-950 border-0">
                                                        <Award className="w-3 h-3 mr-1" />
                                                        FEATURED
                                                    </Badge>
                                                </div>
                                                {seller.verified && (
                                                    <div className="absolute top-4 right-4">
                                                        <div className="bg-background rounded-full p-1.5 shadow-lg">
                                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 p-6 flex flex-col">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-3xl border-4 border-background -mt-12 shadow-lg flex-shrink-0 relative z-10">
                                                    {seller.logo}
                                                </div>
                                                <div className="flex-1 mt-2 min-w-0">
                                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                        {seller.shopName}
                                                    </h3>
                                                    <p className="text-sm font-semibold text-primary mt-1 line-clamp-1">
                                                        {seller.brandName}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                                        <span className="line-clamp-1">{seller.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-4 flex-wrap">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold text-sm">{seller.rating}</span>
                                                    <span className="text-xs text-muted-foreground">({seller.totalReviews})</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Package className="w-3 h-3" />
                                                    {seller.totalProducts} Products
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Users className="w-3 h-3" />
                                                    {seller.followers.toLocaleString()} Followers
                                                </div>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                                                {seller.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {seller.badges.map((badge, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {badge}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-6 pt-0">
                                            <Button className="w-full group">
                                                Visit Store
                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Stores Grid/List */}
                <div>
                    {selectedCategory !== "all" || searchQuery !== "" ? (
                        <h3 className="text-xl font-bold text-foreground mb-6">
                            {searchQuery ? `Search Results for "${searchQuery}"` : "All Stores"}
                        </h3>
                    ) : (
                        <h3 className="text-xl font-bold text-foreground mb-6">All Stores</h3>
                    )}

                    {filteredSellers.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">No stores found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search or filter criteria
                                </p>
                            </CardContent>
                        </Card>
                    ) : viewMode === "grid" ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSellers.map((seller, idx) => (
                                <Link key={seller.id} href={`/shop/${seller.shop_slug}`}>
                                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 hover:border-primary/50 group cursor-pointer h-full flex flex-col"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <CardHeader className="p-0 relative">
                                            <div
                                                className="h-24 relative"
                                                style={{ background: seller.coverImage }}
                                            >
                                                {seller.featured && (
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className="bg-yellow-500 text-yellow-950 border-0 text-xs">
                                                            <Award className="w-3 h-3 mr-1" />
                                                            FEATURED
                                                        </Badge>
                                                    </div>
                                                )}
                                                {seller.verified && (
                                                    <div className="absolute top-3 right-3">
                                                        <div className="bg-background rounded-full p-1 shadow-lg">
                                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 p-5 flex flex-col">
                                            <div className="flex items-start gap-3 mb-4">
                                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl border-2 border-background -mt-8 shadow-md flex-shrink-0 relative z-10">
                                                    {seller.logo}
                                                </div>
                                                <div className="flex-1 mt-1 min-w-0">
                                                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                        {seller.shopName}
                                                    </h3>
                                                    <p className="text-xs font-semibold text-primary mt-0.5 line-clamp-1">
                                                        {seller.brandName}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                                        <span className="line-clamp-1">{seller.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mb-3 flex-wrap text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold">{seller.rating}</span>
                                                    <span className="text-muted-foreground">({seller.totalReviews})</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Package className="w-3 h-3" />
                                                    {seller.totalProducts}
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1">
                                                {seller.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {seller.badges.slice(0, 2).map((badge, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {badge}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-5 pt-0">
                                            <Button variant="outline" className="w-full group text-sm">
                                                View Store
                                                <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div>
                            {filteredSellers.map((seller, idx) => (
                                <div key={seller.id} className="mb-4">
                                    <Link href={`/shop/${seller.shop_slug}`} >
                                        <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary/50 group cursor-pointer animate-slide-up"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <CardContent className="p-4 md:p-6">
                                                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                                    <div
                                                        className="w-full sm:w-24 sm:h-24 h-32 rounded-lg flex-shrink-0 relative overflow-hidden"
                                                        style={{ background: seller.coverImage }}
                                                    >
                                                        <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">
                                                            {seller.logo}
                                                        </div>
                                                        {seller.verified && (
                                                            <div className="absolute top-2 right-2">
                                                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-background drop-shadow-lg" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                                        {seller.shopName}
                                                                    </h3>
                                                                    {seller.featured && (
                                                                        <Badge className="bg-yellow-500 text-yellow-950 border-0 text-xs w-fit">
                                                                            <Award className="w-3 h-3 mr-1" />
                                                                            FEATURED
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs sm:text-sm font-semibold text-primary mb-2">
                                                                    {seller.brandName}
                                                                </p>
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                                        <span className="truncate">{seller.location}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Store className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                                        <span className="truncate">Owner: {seller.owner}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                                        <span>Since {seller.memberSince}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                                                            {seller.description}
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-3 sm:mb-4 text-xs sm:text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                                                <span className="font-semibold">{seller.rating}</span>
                                                                <span className="text-muted-foreground">({seller.totalReviews})</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <Package className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                                <span>{seller.totalProducts} Products</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                                <span>{seller.followers.toLocaleString()} Followers</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                                <span className="hidden sm:inline">{seller.responseTime}</span>
                                                                <span className="sm:hidden">{seller.responseTime.replace("< ", "")}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                            <div className="flex flex-wrap gap-2">
                                                                {seller.badges.map((badge, idx) => (
                                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                                        {badge}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                            <Button variant="outline" className="group w-full sm:w-auto">
                                                                Visit Store
                                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
