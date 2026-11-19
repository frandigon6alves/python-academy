import en from "./en.json";
import es from "./es.json";

type Catalogue = { [key: string]: string | Catalogue };

function flatten(catalogue: Catalogue, prefix = ""): Record<string, string> {
  return Object.entries(catalogue).reduce<Record<string, string>>((all, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? { ...all, [path]: value } : { ...all, ...flatten(value, path) };
  }, {});
}

/** Top-level ICU arguments such as {count} or {name}. */
function placeholders(message: string): string[] {
  return [...message.matchAll(/\{(\w+)[,}]/g)].map((match) => match[1]!).sort();
}

describe("UI message catalogues", () => {
  const english = flatten(en);
  const spanish = flatten(es);

  it("have identical keys in English and Spanish", () => {
    expect(Object.keys(spanish).sort()).toEqual(Object.keys(english).sort());
  });

  it("use the same placeholders in both languages", () => {
    for (const [key, message] of Object.entries(english)) {
      expect({ key, args: placeholders(spanish[key] ?? "") }).toEqual({ key, args: placeholders(message) });
    }
  });

  it("have no empty messages", () => {
    expect(Object.values({ ...english, ...spanish }).filter((m) => !m.trim())).toEqual([]);
  });
});
