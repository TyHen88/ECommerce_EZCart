import {
  ApiResponse,
  CategoryRequestDto,
  CategoryResponseDto,
} from "@/lib/types";
import { http } from "@/utils/http";

const ServiceId = {
  CATEGORIES: "/api/wb/v1/categories",
} as const;

export const categoryService = {
  getCategories: async (): Promise<
    ApiResponse<CategoryResponseDto[]> | CategoryResponseDto[]
  > => {
    const response = await http.get(ServiceId.CATEGORIES);
    return response.data;
  },

  getCategoryById: async (
    id: number | string
  ): Promise<ApiResponse<CategoryResponseDto>> => {
    const response = await http.get(`${ServiceId.CATEGORIES}/${id}`);
    return response.data;
  },

  createCategory: async (
    payload: CategoryRequestDto
  ): Promise<ApiResponse<CategoryResponseDto>> => {
    const response = await http.post(ServiceId.CATEGORIES, payload);
    return response.data;
  },

  updateCategory: async (
    id: number | string,
    payload: CategoryRequestDto
  ): Promise<ApiResponse<CategoryResponseDto>> => {
    const response = await http.put(`${ServiceId.CATEGORIES}/${id}`, payload);
    return response.data;
  },

  deleteCategory: async (
    id: number | string
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.delete(`${ServiceId.CATEGORIES}/${id}`);
    return response.data;
  },

  removeProductFromCategory: async (
    categoryId: number | string,
    productId: number | string
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.delete(
      `${ServiceId.CATEGORIES}/${categoryId}/products/${productId}`
    );
    return response.data;
  },

  addProductToCategory: async (
    categoryId: number | string,
    productId: number | string
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(
      `${ServiceId.CATEGORIES}/${categoryId}/products/${productId}`
    );
    return response.data;
  },

  bulkDeleteProductsFromCategory: async (
    categoryId: number | string,
    productIds: number[]
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.delete(
      `${ServiceId.CATEGORIES}/${categoryId}/products/bulk-delete`,
      {
        data: productIds,
      }
    );
    return response.data;
  },

  bulkAddProductsToCategory: async (
    categoryId: number | string,
    productIds: number[]
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(
      `${ServiceId.CATEGORIES}/${categoryId}/products/bulk-add`,
      productIds
    );
    return response.data;
  },
};
