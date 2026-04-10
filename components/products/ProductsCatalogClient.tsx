"use client";

import * as React from "react";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { ProductsPageSkeleton } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { useInfiniteProducts, useProductCategories } from "@/hooks/useProducts";
import {
  mapProductToGridItem,
  normalizeCategorySlug,
} from "@/lib/product-mappers";
import { useSearchParams } from "next/navigation";
import { Loader2, Package } from "lucide-react";

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(
      (error as { message?: string }).message || "Failed to load products."
    );
  }

  return "Failed to load products.";
}

export function ProductsCatalogClient() {
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || undefined;
  const currentCategory = normalizeCategorySlug(
    searchParams.get("categorySlug") ?? searchParams.get("category")
  );

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoryError,
    error: categoryError,
  } = useProductCategories();

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteProducts({
    categorySlug: currentCategory,
    search: currentSearch,
    size: 12,
  });

  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const products = React.useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.data.data)
        .filter((product) => product.isActive)
        .map(mapProductToGridItem) ?? [],
    [data]
  );

  const totalProducts = data?.pages[0]?.data.pagination.total_elements ?? 0;

  if ((isLoading && !data) || isLoadingCategories) {
    return <ProductsPageSkeleton />;
  }

  if (isError || isCategoryError) {
    return (
      <main className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full py-8 px-4 md:px-6">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg font-semibold mb-2">Unable to load products</p>
              <p className="text-muted-foreground">
                {getErrorMessage(error || categoryError)}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <main className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full py-8 px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Browse Products from Every Shop
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore our diverse, handpicked selection just for you.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Showing {products.length} of {totalProducts} products
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-20">
              <ProductFilters
                categories={categories}
                currentCategory={currentCategory}
                currentSearch={currentSearch}
              />
            </aside>

            <div className="flex-1 min-w-0">
              {products.length > 0 ? (
                <>
                  <ProductGrid products={products} />

                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isFetchingNextPage ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more products...
                      </div>
                    ) : hasNextPage ? (
                      <div className="text-sm text-muted-foreground">
                        Scroll to load more
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        You&apos;ve reached the end of the catalog
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or category filter.
                    </p>
                  </CardContent>
                </Card>
              )}

              {isFetching && !isFetchingNextPage && products.length > 0 && (
                <div className="text-center text-sm text-muted-foreground pb-4">
                  Refreshing products...
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
