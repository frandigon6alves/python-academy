import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

/** Renders lesson Markdown with Python syntax highlighting. Raw HTML is not allowed. */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: false, plainText: ["text"] }]]}>
      {children}
    </ReactMarkdown>
  );
}

export function CodeSnippet({ code }: { code: string }) {
  return <Markdown>{"```python\n" + code + "\n```"}</Markdown>;
}
