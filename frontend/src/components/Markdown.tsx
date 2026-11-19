import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { headingId } from "@/lib/headings";
import { rehypePython } from "@/lib/highlight";

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

const rehypePlugins = [rehypePython];

/**
 * Renders lesson Markdown with Python syntax highlighting. Raw HTML is not rendered
 * (react-markdown escapes it) and the content comes from the repository, not from users.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown components={components} rehypePlugins={rehypePlugins}>
      {children}
    </ReactMarkdown>
  );
}
