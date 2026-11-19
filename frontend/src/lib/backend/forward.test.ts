import { describe, expect, it } from "vitest";
import { backendHeaders, backendUrl, clientIp, CLIENT_IP_HEADER, PROXY_SECRET_HEADER } from "./forward";

describe("clientIp", () => {
  it("prefers X-Real-IP, then the first X-Forwarded-For entry", () => {
    expect(clientIp(new Headers({ "x-real-ip": "203.0.113.7" }))).toBe("203.0.113.7");
    expect(clientIp(new Headers({ "x-forwarded-for": "198.51.100.1, 10.0.0.1" }))).toBe("198.51.100.1");
    expect(clientIp(new Headers())).toBeNull();
  });
});

describe("backendHeaders", () => {
  const forged = new Headers({
    "x-real-ip": "203.0.113.7",
    [CLIENT_IP_HEADER]: "192.0.2.1",
    [PROXY_SECRET_HEADER]: "guess",
    cookie: "academy_session=abc",
  });

  it("adds the secret and the client IP when a secret is configured", () => {
    const headers = backendHeaders(forged, "s3cret");
    expect(headers.get(PROXY_SECRET_HEADER)).toBe("s3cret");
    expect(headers.get(CLIENT_IP_HEADER)).toBe("203.0.113.7");
    expect(headers.get("cookie")).toBe("academy_session=abc");
  });

  it("drops browser-supplied proxy headers when no secret is configured", () => {
    const headers = backendHeaders(forged, undefined);
    expect(headers.has(PROXY_SECRET_HEADER)).toBe(false);
    expect(headers.has(CLIENT_IP_HEADER)).toBe(false);
  });
});

describe("backendUrl", () => {
  it("keeps the path and query string", () => {
    expect(backendUrl("https://api.example.com", "/api/v1/courses", "?lang=es").href).toBe(
      "https://api.example.com/api/v1/courses?lang=es",
    );
    expect(backendUrl("https://api.example.com/", "/api/v1/health", "").href).toBe(
      "https://api.example.com/api/v1/health",
    );
  });
});
