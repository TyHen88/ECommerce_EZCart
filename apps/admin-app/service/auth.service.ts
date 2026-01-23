import { http } from "@/utils/http";

const ServiceId = {
  LOGIN: "/api/wb/v1/auth/login",
};

async function login(user_name: string, password: string) {
  return await http.post(ServiceId.LOGIN, { user_name, password });
}

export const authService = {
  login,
};
