import { api, ApiError } from "./client";

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
});
