"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type Product, getProductsByShop } from "@/lib/data";
import { useCartStore } from "@/stores";
import {
  ArrowLeft,
  CheckIcon,
  Package,
  ShoppingCartIcon,
  Tag,
  XIcon,
  Star,
  Truck,
  Shield,
  RotateCcw,
  BookmarkIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ShopProductGrid } from "@/components/persona-shop/shop-product-grid";

interface ProductDetailClientProps {
  product: Product;
  shop_slug: string;
}

export function ProductDetailClient({ product, shop_slug }: ProductDetailClientProps) {
  const { addItem, removeItem, items } = useCartStore();
  const router = useRouter();

  const relatedProducts = useMemo(() => {
    if (!product || !shop_slug) return [];
    const shopProducts = getProductsByShop(shop_slug, { inStock: true });
    return shopProducts
      .filter(
        (p) => p.id !== product.id && p.category === product.category
      )
      .slice(0, 6);
  }, [product, shop_slug]);

  useEffect(() => {
    const cartItems = localStorage.getItem("cart-items");
    if (cartItems) {
      const cartItemsArray = JSON.parse(cartItems);
      cartItemsArray.forEach((item: any) => {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          category: item.category,
        });
      });
    }
  }, [addItem]);

  const isInCart = items.some((p) => p.id === product.id);

  const handleToggleCart = (productData: Product, checked: boolean) => {
    if (checked) {
      addItem({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image_url: productData.image_url?.[0]?.url || "",
        category: productData.category || "",
      });
      toast(`${productData.name} has been added.`, {
        icon: <CheckIcon className="text-green-500 w-5 h-5" />,
      });
    } else {
      removeItem(productData.id);
      toast(`${productData.name} has been removed.`, {
        icon: <XIcon className="text-red-500 w-5 h-5" />,
      });
    }
  };

  return (
    <main className="min-h-[60vh] bg-background w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/shop/${shop_slug}?category=${encodeURIComponent(
            product.category || ""
          )}`}
          scroll={false}
        >
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          <div className="relative w-full">
            <Card className="overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.image_url?.map(
                    (
                      image: { url: string; alt: string } | null,
                      index: number
                    ) => (
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
                    )
                  )}
                </CarouselContent>
                {product.image_url && product.image_url.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 h-10 w-10 shadow-lg hover:shadow-xl transition-shadow" />
                    <CarouselNext className="right-4 h-10 w-10 shadow-lg hover:shadow-xl transition-shadow" />
                  </>
                )}
              </Carousel>

              {product.image_url && product.image_url.length > 1 && (
                <div className="flex justify-center gap-2 p-4 border-t">
                  {product.image_url.map(
                    (
                      image: { url: string; alt: string } | null,
                      index: number
                    ) => (
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
                    )
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              {product.category && (
                <Link
                  href={`/shop/${shop_slug}/product/${product.id}?category=${encodeURIComponent(
                    product.category
                  )}`}
                >
                  <Badge
                    variant="secondary"
                    className="mb-3 hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
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

            <Card className="mb-6 border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        product.stock > 0 ? "bg-green-100" : "bg-destructive/10"
                      }`}
                    >
                      <Package
                        className={`h-5 w-5 ${
                          product.stock > 0
                            ? "text-green-600"
                            : "text-destructive"
                        }`}
                      />
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
                      variant={
                        product.stock > 10 ? "default" : "secondary"
                      }
                      className="text-sm"
                    >
                      {product.stock > 10 ? "In Stock" : "Low Stock"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

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
                className={`w-1/2 h-10 text-sm cursor-pointer ${
                  isInCart ? "bg-green-600 hover:bg-green-700" : ""
                }`}
                variant="outline"
                size="lg"
                disabled={product.stock === 0}
                onClick={() => handleToggleCart(product, !isInCart)}
              >
                <BookmarkIcon className="h-5 w-5 mr-2" />
                {isInCart ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">
                      {product.category || "N/A"}
                    </span>
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

        {relatedProducts.length > 0 && (
          <section className="border-t pt-12">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Related Products
              </h2>
              <p className="text-muted-foreground">
                You might also like these {product.category} products from this
                shop
              </p>
            </div>
            <ShopProductGrid
              products={relatedProducts.map((p) => ({
                ...p,
                image_url: Array.isArray(p.image_url)
                  ? p.image_url?.[0]?.url || ""
                  : typeof p.image_url === "string"
                  ? p.image_url
                  : "",
              }))}
              shop_slug={shop_slug}
            />
          </section>
        )}
      </div>
    </main>
  );
}
