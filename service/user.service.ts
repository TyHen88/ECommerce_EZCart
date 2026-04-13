import {
    ApiResponse,
    UserInfo,
    UserRequestDto,
    UserResponseDto,
    UserSearchParams
} from "@/lib/types"
import { http } from "@/utils/http"

const ServiceId = {
    USER_PROFILE: '/api/wb/v1/user/profile',
    CREATE_USER: '/api/wb/v1/user/create',
    UPDATE_PROFILE: '/api/wb/v1/user/update-profile',
    SEARCH_USER: '/api/wb/v1/user/search',
}

export const userService = {
    getUserProfile: async (): Promise<UserInfo | null> => {
        const response = await http.get(ServiceId.USER_PROFILE)
        return response.data

    },

    createUser: async (
        payload: UserRequestDto
    ): Promise<ApiResponse<UserResponseDto>> => {
        const response = await http.post(ServiceId.CREATE_USER, payload)
        return response.data
    },

    updateUserProfile: async (
        payload: Partial<UserRequestDto>
    ): Promise<ApiResponse<UserResponseDto>> => {
        const response = await http.put(ServiceId.UPDATE_PROFILE, payload)
        return response.data
    },

    searchUser: async (
        params: UserSearchParams
    ): Promise<ApiResponse<UserResponseDto>> => {
        const response = await http.get(ServiceId.SEARCH_USER, { params })
        return response.data
    },
}
