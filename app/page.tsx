"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, Star, Package, RotateCcw, Headphones, ArrowRight, TrendingUp, Shield, Zap, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { productService } from "@/service/product.service"
import { ProductCategoryDto, ProductResponseDto } from "@/lib/types"

interface FeaturedProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: { url: string; alt: string }[];
  stock: number;
  category: string;
  created_at: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products (first 8)
        const response = await productService.getProducts({ page: 0, size: 8 })
        const apiProducts = response.data.data

        // Transform API products to match expected format
        const transformedProducts: FeaturedProduct[] = apiProducts.map((p: ProductResponseDto) => ({
          id: p.id.toString(),
          slug: p.slug,
          name: p.title,
          description: p.description || "",
          price: p.price,
          image_url: p.images.map(img => ({
            url: img.imageUrl,
            alt: img.altText || p.title
          })),
          stock: p.variations.reduce((sum, v) => sum + v.stockQuantity, 0),
          category: p.categories.map(c => c.name).join(", ") || "Uncategorized",
          created_at: p.createdAt
        }))

        setFeaturedProducts(transformedProducts)

        // Fetch categories
        const catResponse = await productService.getCategories()
        const catNames = catResponse.map((c: ProductCategoryDto) => c.name)
        setCategories(catNames.slice(0, 6))
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsVisible(true)
      }
    }

    fetchData()
  }, [])

  const benefits = [
    {
      icon: Package,
      title: "Fast Shipping",
      desc: "Free shipping on orders over $50",
      color: "text-blue-500"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "30-day hassle-free return policy",
      color: "text-green-500"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Round-the-clock customer service",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      desc: "Your transactions are protected",
      color: "text-orange-500"
    }
  ]

  const stats = [
    { value: "15K+", label: "Happy Customers" },
    { value: "500+", label: "Products" },
    { value: "50+", label: "Categories" },
    { value: "4.8/5", label: "Average Rating" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span>Welcome to EZ-Carts</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground animate-slide-up">
                Discover Amazing
                <span className="block text-primary">Products Today</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-slide-up animation-delay-200">
                Shop the latest trends and find everything you need in one place.
                Fast shipping, secure payments, and exceptional customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
                <Link href="/products">
                  <Button size="lg" className="group text-lg px-8 py-6">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 animate-fade-in animation-delay-600">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center p-4 rounded-lg bg-card border hover:shadow-lg transition-shadow">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block animate-fade-in animation-delay-300">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl animate-pulse"></div>
                <div className="relative bg-card border rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.slice(0, 4).map((product, idx) => (
                      <div
                        key={product.id}
                        className="bg-muted rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        {product.image_url?.[0] && (
                          <div className="aspect-square relative mb-2 rounded-lg overflow-hidden">
                            <Image
                              src={product.image_url[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="text-sm font-semibold truncate">{product.name}</div>
                        <div className="text-primary font-bold">${product.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Browse our wide range of product categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 hover:border-primary/50 flex flex-col"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center flex-1">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 animate-fade-in">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground text-lg">Handpicked just for you</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 hover:border-primary/50"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader className="p-0">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      {product.image_url?.[0] ? (
                        <Image
                          src={product.image_url[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </CardHeader>
                <CardContent className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                </CardContent>
                <CardFooter className="p-4 pt-0 gap-2">
                  <Link href={`/products/${product.slug}`} className="flex-1">
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EZ-Carts?</h2>
            <p className="text-muted-foreground text-lg">We're committed to providing the best shopping experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <Card
                key={benefit.title}
                className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 hover:border-primary/50"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center ${benefit.color} group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Join thousands of satisfied customers</p>
          </div>

          <Card className="p-8 md:p-12 bg-card border-2 hover:shadow-xl transition-shadow animate-fade-in">
            <div className="flex items-center gap-1 mb-6 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-lg md:text-xl text-foreground mb-6 text-center italic">
              "My experience with EZ-Carts has been exceptional! The product quality is outstanding,
              shipping was fast, and customer service was incredibly helpful. I'll definitely be shopping here again!"
            </p>
            <div className="text-center">
              <p className="font-semibold text-lg">— Ms. Heang Heang</p>
              <p className="text-muted-foreground text-sm">Verified Customer</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-muted/30 to-primary/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Subscribe to our newsletter and get exclusive deals, new product alerts, and special offers
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              required
            />
            <Button type="submit" className="group">
              Subscribe
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/easycarts-128x128.png" alt="EZ-Carts" width={32} height={32} />
                <span className="text-xl font-bold">EZ-Carts.com</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Your trusted online shopping destination. Quality products, great prices, exceptional service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Shipping Info</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Returns</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@ezcarts.com</li>
                <li>Phone: 1-800-EZ-CARTS</li>
                <li>Hours: Mon-Fri 9AM-6PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EZ-Carts.com. All rights reserved.</p>
          </div>
        </div>
      </footer>


    </div>
  )
}
