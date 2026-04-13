export interface User {
  id: string;
  email: string;
  role: "admin" | "user" | "seller";
  created_at: string;
  updated_at: string;
}

export interface UserResponseDto {
  id: number;
  fullName: string;
  username: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  roles?: string[];
  permissions?: string[];
  profileImageUrl: string | null;
  authProvider: string;
  addresses?: AddressResponseDto[];
}

export interface UserInfo {
  data: UserResponseDto | null;
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

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdatePasswordRequestDto {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface SetupPasswordRequest {
  new_password: string;
  confirm_password: string;
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

export interface UserRequestDto {
  fullName: string;
  username: string;
  email: string;
  password: string;
  profileImageUrl?: string | null;
}

export interface UserSearchParams {
  email?: string;
  username?: string;
}

export interface CategoryRequestDto {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  parentId?: number | null;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  parentId?: number | null;
}

export interface AddressRequestDto {
  type: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface AddressResponseDto {
  id: number;
  type: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserRequestDto {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  roles: string[];
  active: boolean;
}

export interface AdminUserListParams {
  isActive?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface SellerProfileRequestDto {
  storeName: string;
  storeDescription: string;
  storeLogoUrl?: string | null;
  storeBannerUrl?: string | null;
  businessRegistrationNumber?: string | null;
  businessAddress?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  establishedDate?: string | null;
  returnPolicy?: string | null;
  shippingPolicy?: string | null;
}

export interface SellerProfileUpdateRequestDto {
  id: number;
  storeName: string;
  storeDescription: string;
  storeLogoUrl?: string | null;
  storeBannerUrl?: string | null;
  businessRegistrationNumber?: string | null;
  businessAddress?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  returnPolicy?: string | null;
  shippingPolicy?: string | null;
}

export interface SellerProfileResponseDto {
  id: number;
  userId: number;
  username: string;
  userEmail: string;
  storeName: string;
  storeDescription: string;
  storeLogoUrl?: string | null;
  storeBannerUrl?: string | null;
  sellerRating: number;
  totalReviews: number;
  totalSales: number;
  verifiedSeller: boolean;
  businessRegistrationNumber?: string | null;
  businessAddress?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  establishedDate?: string | null;
  returnPolicy?: string | null;
  shippingPolicy?: string | null;
  active: boolean;
  verificationDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfileListParams {
  isActive?: boolean;
  isVerified?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface PaywayPurchaseItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PaywayPurchaseRequest {
  req_time: string;
  merchant_id: string;
  tran_id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  type: string;
  payment_option: string;
  items_list: PaywayPurchaseItem[];
  shipping: number;
  amount: number;
  currency: string;
  return_url: string;
  cancel_url: string;
  continue_success_url: string;
  custom_fields: string;
  return_params: string;
  hash: string;
}

export interface PaywayVerifyRequest {
  tran_id: string;
}
