"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateProductRequest,
  ProductListParams,
  UpdateProductRequest,
} from "@/lib/types";
import { productService } from "@/service/product.service";

type InfiniteProductParams = Omit<ProductListParams, "page">;

function invalidateProductQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["products"] });
  queryClient.invalidateQueries({ queryKey: ["products-page"] });
  queryClient.invalidateQueries({ queryKey: ["product"] });
  queryClient.invalidateQueries({ queryKey: ["product-slug"] });
  queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  queryClient.invalidateQueries({ queryKey: ["product-categories"] });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: productService.getCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsPage(params?: ProductListParams) {
  return useQuery({
    queryKey: ["products-page", params],
    queryFn: () => productService.getProducts(params),
    staleTime: 60 * 1000,
  });
}

export function useInfiniteProducts(params?: InfiniteProductParams) {
  return useInfiniteQuery({
    queryKey: ["products", params],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productService.getProducts({
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.has_next
        ? lastPage.data.pagination.current_page
        : undefined,
    staleTime: 60 * 1000,
  });
}

export function useProduct(id?: number | string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id!),
    enabled: id !== undefined && id !== null && id !== "",
    staleTime: 60 * 1000,
  });
}

export function useProductBySlug(slug?: string) {
  return useQuery({
    queryKey: ["product-slug", slug],
    queryFn: () => productService.getProductBySlug(slug!),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductRequest) =>
      productService.createProduct(payload),
    onSuccess: () => invalidateProductQueries(queryClient),
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateProductRequest;
    }) => productService.updateProduct(id, payload),
    onSuccess: () => invalidateProductQueries(queryClient),
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => productService.deleteProduct(id),
    onSuccess: () => invalidateProductQueries(queryClient),
  });
}
