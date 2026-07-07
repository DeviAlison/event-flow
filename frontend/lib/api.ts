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

function normalizePath(path: string): string {
  // If an absolute URL was provided, keep it as-is
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Ensure leading slash
  let p = path.startsWith("/") ? path : `/${path}`;

  // Heuristic: backend exposes event resources under /api/eventos while
  // auth endpoints are at the root (eg. /login, /register). If caller used
  // `/eventos` (the old frontend convention), automatically prefix `/api`.
  // This keeps existing calls working without changing many files.
  if (!/^\/api\//i.test(p) && /^\/(eventos)(?:\/|\?|$)/i.test(p)) {
    p = `/api${p}`;
  }

  return p;
}

function buildUrl(path: string): string {
  const p = normalizePath(path);
  if (/^https?:\/\//i.test(p)) {
    return p;
  }
  // If this is an API route under /api, prefer a relative path so
  // Next.js rewrites (proxy) can forward the request to the backend
  // and avoid CORS issues during development.
  if (p.startsWith("/api")) {
    return p;
  }

  return `${API_BASE_URL}${p}`;
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
