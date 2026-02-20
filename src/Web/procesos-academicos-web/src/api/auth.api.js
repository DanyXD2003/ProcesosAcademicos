import { request } from "./client";

export async function login(requestBody) {
  const response = await request("/api/v1/auth/login", {
    method: "POST",
    body: requestBody,
    auth: false,
    retryOnUnauthorized: false
  });

  return response.data;
}

export async function me() {
  const response = await request("/api/v1/auth/me", {
    method: "GET"
  });

  return response.data;
}

export async function logout(refreshToken) {
  const response = await request("/api/v1/auth/logout", {
    method: "POST",
    body: {
      refreshToken: refreshToken ?? null
    }
  });

  return response.data;
}
