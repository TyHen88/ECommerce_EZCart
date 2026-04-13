import {
  ApiResponse,
  PaginatedResponse,
  SellerProfileListParams,
  SellerProfileRequestDto,
  SellerProfileResponseDto,
  SellerProfileUpdateRequestDto,
} from "@/lib/types";
import { http } from "@/utils/http";

const ServiceId = {
  SELLER_PROFILES: "/api/wb/v1/seller-profiles",
  MY_PROFILE: "/api/wb/v1/seller-profiles/my-profile",
} as const;

function buildQueryParams(
  params?: SellerProfileListParams
): SellerProfileListParams | undefined {
  if (!params) return undefined;

  const filteredEntries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  return filteredEntries.length > 0
    ? (Object.fromEntries(filteredEntries) as SellerProfileListParams)
    : undefined;
}

export const sellerProfileService = {
  createSellerProfile: async (
    payload: SellerProfileRequestDto
  ): Promise<ApiResponse<SellerProfileResponseDto>> => {
    const response = await http.post(ServiceId.SELLER_PROFILES, payload);
    return response.data;
  },

  getSellerProfileById: async (
    id: number | string
  ): Promise<ApiResponse<SellerProfileResponseDto>> => {
    const response = await http.get(`${ServiceId.SELLER_PROFILES}/${id}`);
    return response.data;
  },

  getSellerProfileByUserId: async (
    userId: number | string
  ): Promise<ApiResponse<SellerProfileResponseDto>> => {
    const response = await http.get(
      `${ServiceId.SELLER_PROFILES}/user/${userId}`
    );
    return response.data;
  },

  getMySellerProfile: async (): Promise<ApiResponse<SellerProfileResponseDto>> => {
    const response = await http.get(ServiceId.MY_PROFILE);
    return response.data;
  },

  updateSellerProfile: async (
    payload: SellerProfileUpdateRequestDto
  ): Promise<ApiResponse<SellerProfileResponseDto>> => {
    const response = await http.put(ServiceId.SELLER_PROFILES, payload);
    return response.data;
  },

  deleteSellerProfile: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.delete(ServiceId.SELLER_PROFILES);
    return response.data;
  },

  getSellerProfiles: async (
    params?: SellerProfileListParams
  ): Promise<ApiResponse<PaginatedResponse<SellerProfileResponseDto>>> => {
    const response = await http.get(ServiceId.SELLER_PROFILES, {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  verifySeller: async (
    id: number | string
  ): Promise<ApiResponse<SellerProfileResponseDto>> => {
    const response = await http.post(
      `${ServiceId.SELLER_PROFILES}/${id}/verify`
    );
    return response.data;
  },

  updateSellerRating: async (
    id: number | string,
    newRating: number,
    totalReviews: number
  ): Promise<ApiResponse<SellerProfileResponseDto>> => {
    const response = await http.put(
      `${ServiceId.SELLER_PROFILES}/${id}/rating`,
      undefined,
      {
        params: {
          newRating,
          totalReviews,
        },
      }
    );
    return response.data;
  },

  incrementSellerSales: async (
    id: number | string
  ): Promise<ApiResponse<SellerProfileResponseDto>> => {
    const response = await http.post(
      `${ServiceId.SELLER_PROFILES}/${id}/increment-sales`
    );
    return response.data;
  },
};
