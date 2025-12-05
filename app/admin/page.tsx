import { redirect } from "next/navigation"
import { AdminProductList } from "@/components/admin-product-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getProducts } from "@/lib/data"

export default async function AdminPage() {
  // For demo purposes, we'll assume user is always admin
  // In a real app, you'd check authentication here
  const dataProducts = await getProducts()

  // Transform products to match AdminProductList expected format
  const products = dataProducts.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description || null,
    price: product.price,
    image_url: Array.isArray(product.image_url) && product.image_url.length > 0
      ? product.image_url[0].url
      : null,
    stock: product.stock,
    category: product.category || null,
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
