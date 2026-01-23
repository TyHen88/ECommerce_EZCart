import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { getCategories, getProducts } from "@/lib/data"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams

  const products = getProducts({
    category: params.category,
    search: params.search,
    inStock: true
  })

  const categories = getCategories()

  return (
    <div className="w-full h-full flex flex-col">
      <main className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full py-8 px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Browse Products from Every Shop</h1>
            <p className="text-muted-foreground text-lg">Explore our diverse, handpicked selection just for you.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-20">
              <ProductFilters categories={categories} currentCategory={params.category} currentSearch={params.search} />
            </aside>

            <div className="flex-1 min-w-0">
              {products.length > 0 ? (
                <ProductGrid products={products.map(product => ({
                  ...product,
                  image_url: product.image_url?.[0]?.url || ""
                }))} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
