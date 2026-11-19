import type { GlossaryEntry } from "@/lib/api/types";

/** Lowercase and strip accents, so "ambito" finds "Ámbito". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function filterTerms(entries: GlossaryEntry[], query: string): GlossaryEntry[] {
  const needle = normalize(query.trim());
  if (!needle) return entries;
  return entries.filter(
    (entry) => normalize(entry.term).includes(needle) || normalize(entry.definition).includes(needle),
  );
}

export function initialOf(term: string): string {
  const letter = normalize(term).charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : "#";
}

/** Groups entries by initial letter, keeping alphabetical order. */
export function groupByLetter(entries: GlossaryEntry[]): [string, GlossaryEntry[]][] {
  const groups = new Map<string, GlossaryEntry[]>();
  for (const entry of entries) {
    const letter = initialOf(entry.term);
    groups.set(letter, [...(groups.get(letter) ?? []), entry]);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}
