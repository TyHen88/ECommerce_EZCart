import {
  AdminUserListParams,
  AdminUserRequestDto,
  ApiResponse,
  PaginatedResponse,
  UserResponseDto,
} from "@/lib/types";
import { http } from "@/utils/http";

const ServiceId = {
  ADMIN_USERS: "/api/wb/v1/admin/users",
  REGISTER_USER: "/api/wb/v1/admin/users/register",
  UPDATE_STATUS: "/api/wb/v1/admin/users/update-status",
} as const;

function buildQueryParams(
  params?: AdminUserListParams
): AdminUserListParams | undefined {
  if (!params) return undefined;

  const filteredEntries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  return filteredEntries.length > 0
    ? (Object.fromEntries(filteredEntries) as AdminUserListParams)
    : undefined;
}

export const adminUserService = {
  getUsers: async (
    params?: AdminUserListParams
  ): Promise<ApiResponse<PaginatedResponse<UserResponseDto>>> => {
    const response = await http.get(ServiceId.ADMIN_USERS, {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  registerUser: async (
    payload: AdminUserRequestDto
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(ServiceId.REGISTER_USER, payload);
    return response.data;
  },

  updateUserStatus: async (
    id: number | string,
    status: boolean
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.put(
      `${ServiceId.UPDATE_STATUS}/${id}/${status}`
    );
    return response.data;
  },
};
