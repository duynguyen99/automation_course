// Evaluates CSS selectors and XPath in a document, for the in-browser locator exercises.

export type LocatorKind = "css" | "xpath";

export function detectKind(locator: string): LocatorKind {
  const s = locator.trim();
  return s.startsWith("/") || s.startsWith("(") || s.startsWith("./") ? "xpath" : "css";
}

export interface Evaluation {
  elements: Element[];
  error?: string;
}

export function evaluateLocator(doc: Document, locator: string, kind: LocatorKind = detectKind(locator)): Evaluation {
  const s = locator.trim();
  if (!s) return { elements: [] };
  try {
    if (kind === "css") return { elements: Array.from(doc.querySelectorAll(s)) };
    const snapshot = doc.evaluate(s, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const elements: Element[] = [];
    for (let i = 0; i < snapshot.snapshotLength; i++) {
      const node = snapshot.snapshotItem(i);
      if (node instanceof doc.defaultView!.Element) elements.push(node as Element);
    }
    return { elements };
  } catch {
    return {
      elements: [],
      error: kind === "css" ? "CSS selector chưa đúng cú pháp" : "XPath chưa đúng cú pháp",
    };
  }
}

export function sameElements(a: Element[], b: Element[]): boolean {
  if (a.length !== b.length || a.length === 0) return false;
  const set = new Set(b);
  return a.every((el) => set.has(el));
}
