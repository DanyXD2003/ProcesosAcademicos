const DEFAULT_API_BASE_URL = "https://procesosacademicos.onrender.com";

const rawBaseUrl = `${import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL}`.trim();
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const AUTH_ERROR_CODES = new Set([
  "AUTH_INVALID_TOKEN",
  "AUTH_TOKEN_EXPIRED",
  "AUTH_REFRESH_INVALID",
  "AUTH_REFRESH_EXPIRED"
]);

let getSession = () => null;
let onSessionRefreshed = () => {};
let onSessionInvalid = () => {};
let refreshPromise = null;

export class ApiClientError extends Error {
  constructor(message, { status = 0, code = "API_ERROR", details = null, errors = [] } = {}) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.errors = errors;
  }
}

export function configureApiClientAuth({
  getSession: nextGetSession,
  onSessionRefreshed: nextOnSessionRefreshed,
  onSessionInvalid: nextOnSessionInvalid
}) {
  getSession = typeof nextGetSession === "function" ? nextGetSession : () => null;
  onSessionRefreshed = typeof nextOnSessionRefreshed === "function" ? nextOnSessionRefreshed : () => {};
  onSessionInvalid = typeof nextOnSessionInvalid === "function" ? nextOnSessionInvalid : () => {};
}

function normalizePath(path) {
  if (!path) {
    return "";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function toQueryString(query) {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, `${value}`);
  });

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

function buildUrl(path, query) {
  return `${API_BASE_URL}${normalizePath(path)}${toQueryString(query)}`;
}

async function parseEnvelope(response) {
  const text = await response.text();

  if (!text) {
    if (!response.ok) {
      throw new ApiClientError(`HTTP ${response.status}`, {
        status: response.status,
        code: `HTTP_${response.status}`
      });
    }

    return {
      data: null,
      meta: null,
      errors: []
    };
  }

  let payload;

  try {
    payload = JSON.parse(text);
  } catch (error) {
    if (!response.ok) {
      throw new ApiClientError(`HTTP ${response.status}`, {
        status: response.status,
        code: `HTTP_${response.status}`,
        details: text
      });
    }

    throw new ApiClientError("Respuesta JSON invalida del servidor.", {
      status: response.status,
      code: "INVALID_JSON",
      details: text
    });
  }

  const errors = Array.isArray(payload?.errors) ? payload.errors : [];

  if (!response.ok || errors.length > 0) {
    const firstError = errors[0] ?? {};

    throw new ApiClientError(firstError.message ?? `HTTP ${response.status}`, {
      status: response.status,
      code: firstError.code ?? `HTTP_${response.status}`,
      details: firstError.details ?? null,
      errors
    });
  }

  return {
    data: payload?.data ?? null,
    meta: payload?.meta ?? null,
    errors: []
  };
}

function shouldAttemptRefresh(error) {
  if (!(error instanceof ApiClientError)) {
    return false;
  }

  return error.status === 401 || AUTH_ERROR_CODES.has(error.code);
}

async function refreshSession() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const currentSession = getSession();

    if (!currentSession?.refreshToken) {
      onSessionInvalid();
      return false;
    }

    try {
      const refreshed = await request("/api/v1/auth/refresh", {
        method: "POST",
        body: {
          refreshToken: currentSession.refreshToken
        },
        auth: false,
        retryOnUnauthorized: false
      });

      if (!refreshed?.data?.accessToken || !refreshed?.data?.refreshToken) {
        onSessionInvalid();
        return false;
      }

      const expiresIn = Number(refreshed.data.expiresIn ?? 1800);
      const nextSession = {
        ...currentSession,
        accessToken: refreshed.data.accessToken,
        refreshToken: refreshed.data.refreshToken,
        expiresAt: new Date(Date.now() + Math.max(expiresIn, 60) * 1000).toISOString(),
        currentUser: refreshed.data.user ?? currentSession.currentUser
      };

      onSessionRefreshed(nextSession);
      return true;
    } catch {
      onSessionInvalid();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function request(
  path,
  {
    method = "GET",
    query,
    body,
    headers,
    auth = true,
    retryOnUnauthorized = true
  } = {}
) {
  const requestHeaders = new Headers(headers ?? {});

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const session = getSession();

    if (session?.accessToken) {
      requestHeaders.set("Authorization", `Bearer ${session.accessToken}`);
    }
  }

  let response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (error) {
    throw new ApiClientError("No fue posible conectar con la API.", {
      code: "NETWORK_ERROR",
      details: error instanceof Error ? error.message : error
    });
  }

  try {
    return await parseEnvelope(response);
  } catch (error) {
    if (auth && retryOnUnauthorized && shouldAttemptRefresh(error)) {
      const refreshed = await refreshSession();

      if (refreshed) {
        return request(path, {
          method,
          query,
          body,
          headers,
          auth,
          retryOnUnauthorized: false
        });
      }
    }

    throw error;
  }
}

export function getItems(envelopeData) {
  return Array.isArray(envelopeData?.items) ? envelopeData.items : [];
}

export function getPagination(meta) {
  return meta?.pagination ?? {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1
  };
}

export function getFunctionalCode(error, fallback = "UNEXPECTED_ERROR") {
  if (error instanceof ApiClientError && error.code) {
    return error.code;
  }

  return fallback;
}
