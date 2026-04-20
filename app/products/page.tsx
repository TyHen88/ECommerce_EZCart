"use client"

import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { productService } from "@/service/product.service"
import { ProductCategoryDto, ProductResponseDto } from "@/lib/types"
import { useEffect, useState, useCallback, useRef } from "react"
import { Loader2 } from "lucide-react"

interface ProductGridItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
  created_at: string;
}

interface PaginationInfo {
  is_first: boolean;
  is_last: boolean;
  page_size: number;
  total_pages: number;
  current_page: number;
  current_total_elements: number;
  total_elements: number;
  is_empty: boolean;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const [products, setProducts] = useState<ProductGridItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [filters, setFilters] = useState<{ category?: string; search?: string }>({})
  const loadingRef = useRef(false)
  const paginationRef = useRef<PaginationInfo | null>(null)
  const currentPageRef = useRef(0)
  const filtersRef = useRef(filters)
  const fetchProductsRef = useRef<((page: number, isNewFilter: boolean) => void) | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initialize filters from searchParams
  useEffect(() => {
    searchParams.then(params => {
      setFilters({
        category: params.category,
        search: params.search
      })
    })
  }, [searchParams])

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catResponse = await productService.getCategories()
        setCategories(catResponse.map((c: ProductCategoryDto) => c.name))
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products with pagination
  const fetchProducts = useCallback(async (page: number, isNewFilter: boolean = false) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)

    try {
      const currentFilters = filtersRef.current
      const response = await productService.getProducts({
        categorySlug: currentFilters.category,
        search: currentFilters.search,
        page: page,
        size: 10
      })

      const apiProducts = response.data.data
      // Extract pagination from API response, fallback to computed values
      const apiPagination = (response.data as any).pagination
      const paginationInfo: PaginationInfo = apiPagination || {
        is_first: page === 0,
        is_last: apiProducts.length < 10,
        page_size: 10,
        total_pages: Math.ceil(apiProducts.length / 10),
        current_page: page + 1,
        current_total_elements: apiProducts.length,
        total_elements: apiProducts.length,
        is_empty: apiProducts.length === 0,
        has_next: apiProducts.length === 10,
        has_previous: page > 0,
        next_page: apiProducts.length === 10 ? page + 1 : null,
        previous_page: page > 0 ? page - 1 : null
      }

      setPagination(paginationInfo)
      paginationRef.current = paginationInfo

      const transformedProducts: ProductGridItem[] = apiProducts.map((p: ProductResponseDto) => ({
        id: p.id.toString(),
        slug: p.slug,
        name: p.title,
        description: p.description || "",
        price: p.price,
        image_url: p.images.find(img => img.isPrimary)?.imageUrl || p.images[0]?.imageUrl || "",
        stock: p.variations.reduce((sum, v) => sum + v.stockQuantity, 0),
        category: p.categories.map(c => c.name).join(", ") || "Uncategorized",
        created_at: p.createdAt
      }))

      if (isNewFilter) {
        setProducts(transformedProducts)
        setCurrentPage(0)
        currentPageRef.current = 0
      } else {
        setProducts(prev => [...prev, ...transformedProducts])
        currentPageRef.current = page
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      loadingRef.current = false
      setLoading(false)
      setInitialLoading(false)
    }
  }, [])

  // Initial fetch when filters change or on mount
  useEffect(() => {
    setProducts([])
    setCurrentPage(0)
    fetchProducts(0, true)
  }, [filters.category, filters.search])

  // Load more products
  const loadMore = useCallback(() => {
    if (pagination?.has_next && !loadingRef.current) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchProducts(nextPage, false)
    }
  }, [pagination?.has_next, currentPage, fetchProducts])

  // Keep refs in sync
  useEffect(() => {
    filtersRef.current = filters
    fetchProductsRef.current = fetchProducts
  }, [filters, fetchProducts])

  // Intersection observer for infinite scroll - setup once
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && paginationRef.current?.has_next && !loadingRef.current) {
          const nextPage = currentPageRef.current + 1
          setCurrentPage(nextPage)
          currentPageRef.current = nextPage
          fetchProductsRef.current?.(nextPage, false)
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  if (initialLoading) {
    return (
      <div className="w-full h-full flex flex-col">
        <main className="min-h-screen bg-background w-full">
          <div className="w-full max-w-full py-8 px-4 md:px-6">
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          </div>
        </main>
      </div>
    )
  }

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
              <ProductFilters 
                categories={categories} 
                currentCategory={filters.category} 
                currentSearch={filters.search} 
              />
            </aside>

            <div className="flex-1 min-w-0">
              {products.length > 0 ? (
                <>
                  <ProductGrid products={products} />
                  
                  {/* Load more trigger */}
                  <div 
                    ref={loadMoreRef}
                    className="flex justify-center py-8"
                  >
                    {loading && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading more...</span>
                      </div>
                    )}
                    {!loading && pagination?.has_next && (
                      <button
                        onClick={loadMore}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Load More
                      </button>
                    )}
                    {!loading && pagination?.is_last && products.length > 0 && (
                      <p className="text-muted-foreground text-sm">
                        Showing all {pagination.total_elements} products
                      </p>
                    )}
                  </div>
                </>
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
