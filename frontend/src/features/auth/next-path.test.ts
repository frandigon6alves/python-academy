import { authHref, safeNextPath } from "./next-path";

describe("safeNextPath", () => {
  it("accepts same-site paths", () => {
    expect(safeNextPath("/courses/python-basics")).toBe("/courses/python-basics");
    expect(safeNextPath("/glossary?q=tuple")).toBe("/glossary?q=tuple");
  });

  it("drops a locale prefix", () => {
    expect(safeNextPath("/es/hub")).toBe("/hub");
    expect(safeNextPath("/en")).toBe("/");
    expect(safeNextPath("/english-lessons")).toBe("/english-lessons");
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/\\/evil.example",
    "javascript:alert(1)",
    "courses",
    "/ spaced",
    "",
    undefined,
    ["/hub"],
  ])("rejects %j", (value) => {
    expect(safeNextPath(value)).toBeNull();
  });
});

describe("authHref", () => {
  it("adds an encoded next parameter when there is one", () => {
    expect(authHref("/login", "/courses/a?x=1")).toBe("/login?next=%2Fcourses%2Fa%3Fx%3D1");
    expect(authHref("/signup", null)).toBe("/signup");
  });
});
