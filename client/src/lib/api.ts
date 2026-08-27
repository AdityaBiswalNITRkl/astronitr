export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("astronitr_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("astronitr_token", token);
  else localStorage.removeItem("astronitr_token");
}

// Keys under which the backend nests a list (paginated endpoints return
// `{ blogs: [...], currentPage, ... }`, `{ newsletters: [...] }`, etc).
const LIST_WRAPPER_KEYS = [
  "blogs",
  "newsletters",
  "events",
  "members",
  "registrations",
  "announcements",
  "articles",
  "results",
  "docs",
  "items",
  "data",
];

/**
 * Always returns an array. Use for every list-shaped API result so a
 * malformed / unexpected / paginated-wrapper payload can never crash a
 * `.map()` / `.filter()`. If given `{ blogs: [...] }` it returns the inner
 * array; anything non-array-ish becomes `[]`.
 */
export function asArray<T>(value: T[] | null | undefined): T[];
export function asArray<T = unknown>(value: unknown): T[];
export function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    for (const key of LIST_WRAPPER_KEYS) {
      if (Array.isArray((value as Record<string, unknown>)[key])) {
        return (value as Record<string, unknown[]>)[key];
      }
    }
  }
  return [];
}

// Envelope keys the backend uses to wrap the real payload. `data` is the
// standard one (ApiResponse); `events` / `event` / `members` are legacy
// hand-rolled responses in a few controllers. First match wins.
const PAYLOAD_KEYS = ["data", "events", "event", "members"] as const;
const ENVELOPE_META = new Set([
  "success",
  "statusCode",
  "message",
  "count",
  "error",
]);

function unwrap(json: any): any {
  if (
    json == null ||
    typeof json !== "object" ||
    Array.isArray(json) ||
    !("success" in json)
  ) {
    return json;
  }
  for (const key of PAYLOAD_KEYS) {
    if (key in json) return json[key];
  }
  // Unknown envelope: if exactly one non-meta key remains, treat it as payload.
  const rest = Object.keys(json).filter((k) => !ENVELOPE_META.has(k));
  if (rest.length === 1) return json[rest[0]];
  return json;
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
  return unwrap(json);
}

export function imageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}
