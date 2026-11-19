import type { ElementContent } from "hast";
import type { ReactNode } from "react";
import { highlightPython } from "@/lib/highlight";

function toReact(nodes: ElementContent[]): ReactNode[] {
  return nodes.map((node, index) => {
    if (node.type === "text") return node.value;
    if (node.type !== "element") return null;
    const { className } = node.properties;
    return (
      <span key={index} className={Array.isArray(className) ? className.join(" ") : undefined}>
        {toReact(node.children)}
      </span>
    );
  });
}

/**
 * A highlighted Python snippet (quiz questions). Same markup as a ```python block in
 * <Markdown>, without pulling the Markdown parser into pages that only show snippets.
 */
export function CodeSnippet({ code }: { code: string }) {
  return (
    // Code blocks can scroll sideways, so keyboard users must be able to focus them.
    <pre tabIndex={0}>
      <code className="hljs language-python">{toReact(highlightPython(code))}</code>
    </pre>
  );
}
