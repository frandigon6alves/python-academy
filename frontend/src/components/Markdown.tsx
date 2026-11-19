import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { headingId } from "@/lib/headings";

/** Plain text of rendered children, e.g. "Checking a type with type()". */
function textOf(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : isValidElement<{ children?: ReactNode }>(child)
          ? textOf(child.props.children)
          : "",
    )
    .join("");
}

const components: Components = {
  // Section headings get stable ids, so the lesson's table of contents can link to them.
  h2: ({ children }) => <h2 id={headingId(textOf(children))}>{children}</h2>,
  // Code blocks can scroll sideways, so keyboard users must be able to focus them.
  pre: ({ children }) => <pre tabIndex={0}>{children}</pre>,
};

/** Renders lesson Markdown with Python syntax highlighting. Raw HTML is not allowed. */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={components}
      rehypePlugins={[[rehypeHighlight, { detect: false, plainText: ["text"] }]]}
    >
      {children}
    </ReactMarkdown>
  );
}

export function CodeSnippet({ code }: { code: string }) {
  return <Markdown>{"```python\n" + code + "\n```"}</Markdown>;
}
