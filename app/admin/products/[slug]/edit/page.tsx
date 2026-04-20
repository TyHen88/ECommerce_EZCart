import { notFound } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { productService } from "@/service/product.service"
import { ProductResponseDto } from "@/lib/types"

// Note: generateStaticParams removed as it requires build-time data fetching
// For static generation with dynamic data, consider using generateStaticParams
// with fallback: 'blocking' or migrate to fully dynamic rendering

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // For demo purposes, we'll assume user is always admin
  // In a real app, you'd check authentication here

  try {
    // Fetch product by SLUG instead of ID
    const response = await productService.getProductBySlug(slug)
    const apiProduct = response.data

    // Transform product to match ProductForm expected format
    const product = {
      id: apiProduct.id.toString(),
      name: apiProduct.title,
      description: apiProduct.description || null,
      price: apiProduct.price,
      image_url: apiProduct.images.find((img: { isPrimary: boolean; imageUrl: string }) => img.isPrimary)?.imageUrl
        || apiProduct.images[0]?.imageUrl
        || null,
      stock: apiProduct.variations.reduce((sum: number, v: { stockQuantity: number }) => sum + v.stockQuantity, 0),
      category: apiProduct.categories.map((c: { name: string }) => c.name).join(", ") || null,
    }

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="w-full max-w-full flex h-16 items-center px-4 md:px-6">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </header>

        <main className="w-full max-w-full py-8 px-4 md:px-6 flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
              <p className="text-muted-foreground">Update product details</p>
            </div>

            <ProductForm product={product} />
          </div>
        </main>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
