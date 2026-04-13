import {
  ApiResponse,
  ForgotPasswordRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SetupPasswordRequest,
  UpdatePasswordRequestDto,
} from "@/lib/types";
import { http } from "@/utils/http";

const ServiceId = {
  LOGIN: "/api/wb/v1/auth/login",
  REGISTER: "/api/wb/v1/auth/register",
  REFRESH: "/api/wb/v1/auth/refresh",
  ENCRYPT: "/api/wb/v1/auth/encrypt",
  GENERATE_PASSWORD: "/api/wb/v1/auth/generate-password",
  FORGOT_PASSWORD: "/api/wb/v1/auth/forgot-password",
  RESET_PASSWORD: "/api/wb/v1/auth/reset-password",
  UPDATE_PASSWORD: "/api/wb/v1/auth/update-password",
  SETUP_PASSWORD: "/api/wb/v1/auth/setup-password",
};

async function login(user_name: string, password: string) {
  const response = await http.post(ServiceId.LOGIN, {
    username: user_name,
    user_name,
    password,
  });
  return response.data as ApiResponse<Record<string, unknown>>;
}

export const authService = {
  login,
  register: async (
    payload: RegisterRequest
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(ServiceId.REGISTER, payload);
    return response.data;
  },

  refreshToken: async (
    payload: RefreshTokenRequest
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(ServiceId.REFRESH, payload);
    return response.data;
  },

  encryptPassword: async (password: string): Promise<ApiResponse<unknown>> => {
    const response = await http.post(ServiceId.ENCRYPT, password);
    return response.data;
  },

  generatePassword: async (length?: number): Promise<ApiResponse<unknown>> => {
    const response = await http.get(ServiceId.GENERATE_PASSWORD, {
      params: length ? { length } : undefined,
    });
    return response.data;
  },

  forgotPassword: async (
    payload: ForgotPasswordRequest
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(ServiceId.FORGOT_PASSWORD, payload);
    return response.data;
  },

  resetPassword: async (
    payload: ResetPasswordRequest
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(ServiceId.RESET_PASSWORD, payload);
    return response.data;
  },

  updatePassword: async (
    payload: UpdatePasswordRequestDto
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.patch(ServiceId.UPDATE_PASSWORD, payload);
    return response.data;
  },

  setupPassword: async (
    payload: SetupPasswordRequest
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(ServiceId.SETUP_PASSWORD, payload);
    return response.data;
  },
};
