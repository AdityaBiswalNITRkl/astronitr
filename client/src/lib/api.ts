export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("astronitr_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("astronitr_token", token);
  else localStorage.removeItem("astronitr_token");
}

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T = any>(
  path: string,
  { body, ...options }: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: payload,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json?.data !== undefined ? json.data : json;
}

export function imageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}
