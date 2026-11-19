import { api, ApiError, apiPath } from "./client";

describe("api client", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends the CSRF header, JSON body and language", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await api("/lessons/1/quiz", { method: "POST", body: { answers: [] }, lang: "es" });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [URL, RequestInit];
    expect(url.pathname + url.search).toBe("/api/v1/lessons/1/quiz?lang=es");
    expect(init.headers).toMatchObject({ "X-Requested-With": "fetch", "Content-Type": "application/json" });
    expect(init.body).toBe('{"answers":[]}');
  });

  it("turns problem+json responses into an ApiError with a code", async () => {
    const problem = { type: "/problems/email-taken", title: "Conflict", status: 409, detail: "Taken." };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(problem), { status: 409 })),
    );

    const error = await api("/auth/signup", { method: "POST", body: {} }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe("email-taken");
    expect((error as ApiError).status).toBe(409);
  });

  it("ignores error bodies that are not problem details", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response('{"detail": 1}', { status: 500 })),
    );
    const error = await api("/courses").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).problem).toBeNull();
    expect((error as ApiError).code).toBeNull();
  });
});

describe("apiPath", () => {
  it("encodes each value as one path segment", () => {
    expect(apiPath`/courses/${"python-basics"}/lessons/${"types"}`).toBe(
      "/courses/python-basics/lessons/types",
    );
    expect(apiPath`/courses/${"../auth/me?x=1"}`).toBe("/courses/..%2Fauth%2Fme%3Fx%3D1");
    expect(apiPath`/lessons/${3}/quiz`).toBe("/lessons/3/quiz");
  });
});
