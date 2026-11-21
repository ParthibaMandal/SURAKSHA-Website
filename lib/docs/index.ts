import rawDocs from "./docs-data.json";

export interface DocHeading {
  level: number;
  text: string;
  id: string;
}

export interface DocItem {
  id: string;
  path: string;
  title: string;
  category: string;
  order: number;
  summary: string;
  wordCount: number;
  readingTime: number;
  headings: DocHeading[];
  githubUrl: string;
  content: string;
}

export interface DocCategory {
  name: string;
  order: number;
  docs: DocItem[];
}

const docs: DocItem[] = rawDocs as DocItem[];

export function getAllDocs(): DocItem[] {
  return docs;
}

export function getDocById(id: string): DocItem | undefined {
  if (!id) return docs[0];
  const normalized = id.toLowerCase();
  return (
    docs.find((d) => d.id === normalized) ||
    docs.find((d) => d.path.toLowerCase() === normalized) ||
    docs.find((d) => d.id.includes(normalized)) ||
    docs[0]
  );
}

export function getDocCategories(): DocCategory[] {
  const categoryMap = new Map<string, { order: number; docs: DocItem[] }>();

  docs.forEach((doc) => {
    if (!categoryMap.has(doc.category)) {
      categoryMap.set(doc.category, { order: doc.order, docs: [] });
    }
    categoryMap.get(doc.category)!.docs.push(doc);
  });

  const categories: DocCategory[] = Array.from(categoryMap.entries()).map(
    ([name, data]) => ({
      name,
      order: data.order,
      docs: data.docs.sort((a, b) => a.title.localeCompare(b.title)),
    })
  );

  return categories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function searchDocs(query: string, categoryFilter?: string): DocItem[] {
  if (!query && !categoryFilter) return docs;
  const q = query.toLowerCase().trim();

  return docs.filter((doc) => {
    const matchesCat = categoryFilter ? doc.category === categoryFilter : true;
    if (!matchesCat) return false;
    if (!q) return true;

    return (
      doc.title.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.path.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q)
    );
  });
}
