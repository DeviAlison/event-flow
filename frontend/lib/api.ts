const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://app.alaskami.space";
export const AUTH_STORAGE_KEY = "eventflow-auth";

export type StoredAuth = {
  token: string;
  email: string;
  nome?: string;
  sobrenome?: string;
};

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

function buildHeaders(options: ApiFetchOptions): Headers {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  if (options.headers) {
    const extraHeaders = options.headers;
    if (extraHeaders instanceof Headers) {
      extraHeaders.forEach((value, key) => headers.set(key, value));
    } else if (Array.isArray(extraHeaders)) {
      extraHeaders.forEach(([key, value]) => headers.set(key, value));
    } else {
      Object.entries(extraHeaders).forEach(([key, value]) => {
        if (typeof value === "string") {
          headers.set(key, value);
        }
      });
    }
  }

  return headers;
}

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}) {
  const token = getStoredAuth()?.token;
  const headers: Headers = buildHeaders(options);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const body: BodyInit | undefined = options.body !== undefined
    ? typeof options.body === "string"
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body,
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    const message = data?.erro || data?.message || response.statusText || "Erro na requisição";
    throw new Error(message);
  }

  return data as T;
}
