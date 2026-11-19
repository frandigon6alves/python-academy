import { filterTerms, groupByLetter, initialOf } from "./glossary-utils";

const entries = [
  { term: "Ámbito", definition: "Dónde es visible un nombre." },
  { term: "f-string", definition: "Cadena con formato." },
  { term: "Tupla", definition: "Secuencia inmutable." },
];

describe("glossary utilities", () => {
  it("search ignores case and accents in terms and definitions", () => {
    expect(filterTerms(entries, "AMBITO").map((e) => e.term)).toEqual(["Ámbito"]);
    expect(filterTerms(entries, "inmutable").map((e) => e.term)).toEqual(["Tupla"]);
    expect(filterTerms(entries, "  ")).toHaveLength(3);
  });

  it("groups terms by their unaccented initial", () => {
    expect(initialOf("Ámbito")).toBe("A");
    expect(groupByLetter(entries).map(([letter]) => letter)).toEqual(["A", "F", "T"]);
  });
});
