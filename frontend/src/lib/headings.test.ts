import { headingId, headingsOf } from "./headings";

describe("headings", () => {
  it("makes readable, accent-free ids", () => {
    expect(headingId("Checking a type with type()")).toBe("section-checking-a-type-with-type");
    expect(headingId("Añadir y eliminar")).toBe("section-anadir-y-eliminar");
  });

  it("lists level-2 headings outside code blocks, without inline Markdown", () => {
    const markdown = [
      "Intro",
      "## Numbers",
      "```python",
      "## not a heading",
      "```",
      "### Sub-heading",
      '## The `if __name__ == "__main__":` guard',
    ].join("\n");
    expect(headingsOf(markdown)).toEqual([
      { id: "section-numbers", text: "Numbers" },
      { id: "section-the-if-name-main-guard", text: 'The if __name__ == "__main__": guard' },
    ]);
  });
});
