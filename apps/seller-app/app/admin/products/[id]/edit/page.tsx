import { notFound } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getProductById, getProducts } from "@/lib/data"

export async function generateStaticParams() {
  const products = getProducts()
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // For demo purposes, we'll assume user is always admin
  // In a real app, you'd check authentication here

  const dataProduct = getProductById(id)

  if (!dataProduct) {
    notFound()
  }

  // Transform product to match ProductForm expected format
  const product = {
    id: dataProduct.id,
    name: dataProduct.name,
    description: dataProduct.description || null,
    price: dataProduct.price,
    image_url: Array.isArray(dataProduct.image_url) && dataProduct.image_url.length > 0
      ? dataProduct.image_url[0].url
      : null,
    stock: dataProduct.stock,
    category: dataProduct.category || null,
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
}
