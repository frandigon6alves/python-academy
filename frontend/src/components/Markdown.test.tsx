import { render } from "@testing-library/react";
import { Markdown } from "./Markdown";

describe("Markdown", () => {
  it("highlights Python blocks and leaves text blocks and inline code plain", () => {
    const { container } = render(
      <Markdown>
        {'## Printing `text`\n\n```python\nprint("hi")\n```\n\n```text\nhi\n```\n\nUse `print`.'}
      </Markdown>,
    );
    const [python, text] = container.querySelectorAll("pre code");
    expect(python).toHaveClass("hljs", "language-python");
    expect(python?.querySelector(".hljs-built_in")).toHaveTextContent("print");
    expect(python).toHaveTextContent('print("hi")');
    expect(text).not.toHaveClass("hljs");
    expect(text?.children).toHaveLength(0);
    expect(container.querySelector("p code")?.children).toHaveLength(0);
    expect(container.querySelector("h2")).toHaveAttribute("id", "section-printing-text");
  });

  it("escapes raw HTML instead of rendering it", () => {
    const { container } = render(<Markdown>{'<img src="x" onerror="alert(1)">'}</Markdown>);
    expect(container.querySelector("img")).toBeNull();
  });
});
