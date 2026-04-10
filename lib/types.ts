export interface User {
  id: string;
  email: string;
  role: "admin" | "user" | "seller";
  created_at: string;
  updated_at: string;
}

export interface UserInfo {
  data: {
    id: number;
    fullName: string;
    username: string;
    email: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    role: string;
    profileImageUrl: string | null;
    authProvider: string;
  } | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  user_name: string;
  password: string;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  timestamp: string;
  data: T;
}

export interface PaginationInfo {
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export type FilterProductCateType = "ALL" | "NO_CATEGORY";

export interface ProductCategoryDto {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImageDto {
  id: number;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariationDto {
  id: number;
  name: string;
  value: string;
  priceAdjustment: number;
  sku: string;
  stockQuantity: number;
}

export interface ProductResponseDto {
  id: number;
  userId: number;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  sku: string;
  currency: string;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  taxRate: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  categories: ProductCategoryDto[];
  images: ProductImageDto[];
  variations: ProductVariationDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImagePayload {
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariationPayload {
  name: string;
  value: string;
  priceAdjustment: number;
  sku: string;
  stockQuantity: number;
}

export interface CreateProductRequest {
  userId: number;
  slug: string;
  title: string;
  description?: string | null;
  price: number;
  sku?: string | null;
  currency: string;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  taxRate?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  categoryIds: number[];
  images?: ProductImagePayload[];
  variations?: ProductVariationPayload[];
}

export interface UpdateProductRequest {
  title?: string;
  description?: string | null;
  price?: number;
  sku?: string | null;
  currency?: string;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  taxRate?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  categoryIds: number[];
}

export interface ProductListParams {
  categorySlug?: string;
  filterProductCateType?: FilterProductCateType;
  search?: string;
  sort?: string;
  page?: number;
  size?: number;
}
