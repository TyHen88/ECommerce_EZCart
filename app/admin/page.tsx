import { redirect } from "next/navigation"
import { AdminProductList } from "@/components/admin-product-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { productService } from "@/service/product.service"
import { ProductResponseDto } from "@/lib/types"

export default async function AdminPage() {
  // For demo purposes, we'll assume user is always admin
  // In a real app, you'd check authentication here

  // Fetch products from API
  const response = await productService.getProducts({ page: 0, size: 100 })
  const apiProducts = response.data.data

  // Transform products to match AdminProductList expected format
  const products = apiProducts.map((product: ProductResponseDto) => ({
    id: product.id.toString(),
    slug: product.slug,
    name: product.title,
    description: product.description || null,
    price: product.price,
    image_url: product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl || null,
    stock: product.variations.reduce((sum, v) => sum + v.stockQuantity, 0),
    category: product.categories.map(c => c.name).join(", ") || null,
  }))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="w-full max-w-full flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="outline">View Store</Button>
            </Link>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-full py-8 px-4 md:px-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>

        <AdminProductList products={products} />
      </main>
    </div>
  )
}
