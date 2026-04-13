import {
  AddressRequestDto,
  AddressResponseDto,
  ApiResponse,
} from "@/lib/types";
import { http } from "@/utils/http";

const ServiceId = {
  ADDRESSES: "/api/wb/v1/addresses",
  ALL_ADDRESSES: "/api/wb/v1/addresses/all-addresses",
} as const;

export const addressService = {
  createAddress: async (
    payload: AddressRequestDto
  ): Promise<ApiResponse<AddressResponseDto>> => {
    const response = await http.post(ServiceId.ADDRESSES, payload);
    return response.data;
  },

  getAddressById: async (
    id: number | string
  ): Promise<ApiResponse<AddressResponseDto>> => {
    const response = await http.get(`${ServiceId.ADDRESSES}/${id}`);
    return response.data;
  },

  getAllAddresses: async (): Promise<ApiResponse<AddressResponseDto[]>> => {
    const response = await http.get(ServiceId.ALL_ADDRESSES);
    return response.data;
  },

  updateAddress: async (
    id: number | string,
    payload: AddressRequestDto
  ): Promise<ApiResponse<AddressResponseDto>> => {
    const response = await http.put(`${ServiceId.ADDRESSES}/${id}`, payload);
    return response.data;
  },

  deleteAddress: async (
    id: number | string
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.delete(`${ServiceId.ADDRESSES}/${id}`);
    return response.data;
  },

  setPrimaryAddress: async (
    id: number | string
  ): Promise<ApiResponse<AddressResponseDto>> => {
    const response = await http.patch(
      `${ServiceId.ADDRESSES}/${id}/is-primary`
    );
    return response.data;
  },
};
