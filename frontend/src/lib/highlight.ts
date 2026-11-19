import type { Element, ElementContent, Root, RootContent } from "hast";
import python from "highlight.js/lib/languages/python";
import { createLowlight } from "lowlight";

// Only Python is registered: lessons use ```python and ```text fences, and loading
// highlight.js's "common" set would add ~35 unused grammars to the client bundle.
const lowlight = createLowlight({ python });

function isElementContent(node: RootContent): node is ElementContent {
  return node.type === "element" || node.type === "text" || node.type === "comment";
}

/** Python source as highlight.js tokens: text nodes and <span class="hljs-…"> elements. */
export function highlightPython(source: string): ElementContent[] {
  return lowlight.highlight("python", source).children.filter(isElementContent);
}

function highlight(code: Element): void {
  const classes = code.properties.className;
  if (!Array.isArray(classes) || !classes.includes("language-python")) return;
  const source = code.children.map((child) => (child.type === "text" ? child.value : "")).join("");
  code.properties.className = ["hljs", ...classes];
  code.children = highlightPython(source);
}

function visit(parent: Root | Element): void {
  for (const child of parent.children) {
    if (child.type !== "element") continue;
    if (child.tagName === "code" && parent.type === "element" && parent.tagName === "pre") highlight(child);
    else visit(child);
  }
}

/** Rehype plugin: highlights ```python code blocks; other blocks and inline code stay plain. */
export function rehypePython() {
  return (tree: Root) => visit(tree);
}
