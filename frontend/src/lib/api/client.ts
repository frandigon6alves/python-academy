/** Problem details returned by the backend (RFC 9457). */
export interface Problem {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: { field: string; message: string }[];
}

function isProblem(value: unknown): value is Problem {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof value.type === "string" &&
    "detail" in value &&
    typeof value.detail === "string"
  );
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly problem: Problem | null,
  ) {
    super(problem?.detail ?? `Request failed with status ${status}`);
  }

  /** Short code from the problem type, e.g. "/problems/email-taken" -> "email-taken". */
  get code(): string | null {
    return this.problem?.type.split("/").pop() ?? null;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  lang?: string;
}

const BASE_URL = "/api/v1";

/**
 * Tagged template for API paths that encodes every interpolated value as a single path
 * segment, so a slug taken from the URL cannot add segments or a query string:
 * apiPath`/courses/${slug}`.
 */
export function apiPath(strings: TemplateStringsArray, ...values: (string | number)[]): string {
  return strings.reduce((path, part, index) => {
    const value = values[index - 1];
    return path + encodeURIComponent(String(value)) + part;
  });
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (options.lang) url.searchParams.set("lang", options.lang);

  const response = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      // Required by the backend's CSRF guard for every state-changing request.
      "X-Requested-With": "fetch",
      ...(options.body !== undefined && { "Content-Type": "application/json" }),
    },
    ...(options.body !== undefined && { body: JSON.stringify(options.body) }),
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new ApiError(response.status, isProblem(body) ? body : null);
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}
