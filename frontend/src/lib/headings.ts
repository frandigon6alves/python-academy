/** Turns a heading into an id: "Checking a type with type()" -> "section-checking-a-type-with-type". */
export function headingId(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `section-${slug}`;
}

export interface Heading {
  id: string;
  text: string;
}

/** The "## " headings of a Markdown document, skipping fenced code blocks. */
export function headingsOf(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) inFence = !inFence;
    const match = !inFence && /^## (.+)$/.exec(line.trim());
    if (match) {
      // Inline code and bold markers are not part of the rendered text.
      const text = match[1]!.replace(/`/g, "").replace(/\*\*/g, "").trim();
      headings.push({ id: headingId(text), text });
    }
  }
  return headings;
}
