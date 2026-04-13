import {
  ApiResponse,
  PaywayPurchaseRequest,
  PaywayVerifyRequest,
} from "@/lib/types";
import { http } from "@/utils/http";

const ServiceId = {
  PURCHASE: "/api/wb/v1/payments/payway/purchase",
  RETURN: "/api/wb/v1/payments/payway/return",
  VERIFY: "/api/wb/v1/payments/payway/verify",
} as const;

export const paywayService = {
  createTransaction: async (payload: PaywayPurchaseRequest): Promise<string> => {
    const response = await http.post(ServiceId.PURCHASE, payload, {
      responseType: "text",
    });
    return response.data;
  },

  handleReturnCallback: async (
    payload: Record<string, unknown>
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(ServiceId.RETURN, payload);
    return response.data;
  },

  verifyTransaction: async (
    payload: PaywayVerifyRequest
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await http.post(ServiceId.VERIFY, payload);
    return response.data;
  },
};
