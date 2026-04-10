import {
  ApiResponse,
  CreateProductRequest,
  PaginatedResponse,
  ProductCategoryDto,
  ProductListParams,
  ProductResponseDto,
  UpdateProductRequest,
} from "@/lib/types";
import { http } from "@/utils/http";

const ServiceId = {
  PRODUCTS: "/api/wb/v1/products",
  CATEGORIES: "/api/wb/v1/categories",
} as const;

function buildQueryParams(params?: ProductListParams): ProductListParams | undefined {
  if (!params) return undefined;

  const filteredEntries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  return filteredEntries.length > 0
    ? (Object.fromEntries(filteredEntries) as ProductListParams)
    : undefined;
}

export const productService = {
  getProducts: async (
    params?: ProductListParams
  ): Promise<ApiResponse<PaginatedResponse<ProductResponseDto>>> => {
    const response = await http.get(ServiceId.PRODUCTS, {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  getProductById: async (
    id: number | string
  ): Promise<ApiResponse<ProductResponseDto>> => {
    const response = await http.get(`${ServiceId.PRODUCTS}/${id}`);
    return response.data;
  },

  getProductBySlug: async (
    slug: string
  ): Promise<ApiResponse<ProductResponseDto>> => {
    const response = await http.get(`${ServiceId.PRODUCTS}/slug/${slug}`);
    return response.data;
  },

  createProduct: async (
    payload: CreateProductRequest
  ): Promise<ApiResponse<ProductResponseDto>> => {
    const response = await http.post(ServiceId.PRODUCTS, payload);
    return response.data;
  },

  updateProduct: async (
    id: number | string,
    payload: UpdateProductRequest
  ): Promise<ApiResponse<ProductResponseDto>> => {
    const response = await http.put(`${ServiceId.PRODUCTS}/${id}`, payload);
    return response.data;
  },

  deleteProduct: async (id: number | string): Promise<ApiResponse<unknown>> => {
    const response = await http.delete(`${ServiceId.PRODUCTS}/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<ProductCategoryDto[]> => {
    const response = await http.get(ServiceId.CATEGORIES);
    return response.data;
  },
};
