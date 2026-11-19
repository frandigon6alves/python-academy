import { render } from "@testing-library/react";
import { CodeSnippet } from "./CodeSnippet";

describe("CodeSnippet", () => {
  it("renders focusable, highlighted Python", () => {
    const { container } = render(<CodeSnippet code={'name = "Ada"\nprint(name)'} />);
    const pre = container.querySelector("pre");
    expect(pre).toHaveAttribute("tabindex", "0");
    expect(pre?.querySelector("code")).toHaveClass("hljs", "language-python");
    expect(pre?.querySelector(".hljs-string")).toHaveTextContent('"Ada"');
    expect(pre).toHaveTextContent('name = "Ada" print(name)', { normalizeWhitespace: true });
  });
});
