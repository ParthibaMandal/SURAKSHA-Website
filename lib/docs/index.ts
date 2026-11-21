import rawDocs from "./docs-data.json";
import rawManifest from "./docs-manifest.json";

export interface DocHeading {
  level: number;
  text: string;
  id: string;
}

export type DocStatus = "VERIFIED" | "IMPLEMENTED" | "IN PROGRESS" | "PROPOSED";

export interface DocItem {
  id: string;
  path: string;
  title: string;
  category: string;
  categoryId: string;
  order: number;
  status: DocStatus;
  summary: string;
  wordCount: number;
  readingTime: number;
  headings: DocHeading[];
  tags: string[];
  githubUrl: string;
  lastVerified: string;
  content: string;
}

export interface DocCategory {
  id: string;
  order: number;
  name: string;
  icon: string;
  description: string;
  badge: string;
  docCount: number;
  docIds: string[];
  docs?: DocItem[];
}

export interface LearningPathStep {
  title: string;
  id: string;
}

export interface LearningPath {
  id: string;
  title: string;
  tag: string;
  description: string;
  steps: LearningPathStep[];
}

export interface DocsManifestMetadata {
  releaseVersion: string;
  documentationCommit: string;
  backendBranch: string;
  lastSynchronized: string;
  totalDocuments: number;
  totalWords: number;
  statusCounts: {
    VERIFIED: number;
    IMPLEMENTED: number;
    "IN PROGRESS": number;
    PROPOSED: number;
  };
  operationalContext: {
    primaryRiverBasin: string;
    primaryGeographicFocus: string;
    primaryGaugeStation: string;
    warningThresholdMeters: number;
    dangerThresholdMeters: number;
    activeModule: string;
    physicalGateActuation: string;
  };
}

export interface DocsManifest {
  metadata: DocsManifestMetadata;
  categories: DocCategory[];
  learningPaths: LearningPath[];
}

const docs: DocItem[] = rawDocs as DocItem[];
const manifest: DocsManifest = rawManifest as DocsManifest;

export function getManifest(): DocsManifest {
  return manifest;
}

export function getAllDocs(): DocItem[] {
  return docs;
}

export function getDocById(idOrSlug: string): DocItem | undefined {
  if (!idOrSlug) return undefined;
  const normalized = idOrSlug.toLowerCase().trim();

  // Exact ID match
  const exact = docs.find((d) => d.id === normalized);
  if (exact) return exact;

  // Path match
  const byPath = docs.find((d) => d.path.toLowerCase() === normalized);
  if (byPath) return byPath;

  // Slug suffix match
  const bySuffix = docs.find(
    (d) => d.id.endsWith(`--${normalized}`) || d.id.endsWith(normalized)
  );
  if (bySuffix) return bySuffix;

  // Partial ID or title match
  return docs.find(
    (d) =>
      d.id.includes(normalized) ||
      d.title.toLowerCase().includes(normalized)
  );
}

export function getDocCategories(): (DocCategory & { docs: DocItem[] })[] {
  return manifest.categories.map((cat) => {
    const catDocs = docs
      .filter((d) => d.categoryId === cat.id)
      .sort((a, b) => a.title.localeCompare(b.title));
    return {
      ...cat,
      docs: catDocs,
    };
  });
}

export function getCategoryById(
  catId: string
): (DocCategory & { docs: DocItem[] }) | undefined {
  const cat = manifest.categories.find((c) => c.id === catId);
  if (!cat) return undefined;
  const catDocs = docs
    .filter((d) => d.categoryId === cat.id)
    .sort((a, b) => a.title.localeCompare(b.title));
  return {
    ...cat,
    docs: catDocs,
  };
}

export function getLearningPaths(): LearningPath[] {
  return manifest.learningPaths;
}

export function searchDocs(
  query: string,
  categoryFilter?: string,
  statusFilter?: string
): DocItem[] {
  const q = (query || "").toLowerCase().trim();

  return docs.filter((doc) => {
    if (categoryFilter && categoryFilter !== "All") {
      if (doc.categoryId !== categoryFilter && doc.category !== categoryFilter) {
        return false;
      }
    }

    if (statusFilter && statusFilter !== "All") {
      if (doc.status !== statusFilter) {
        return false;
      }
    }

    if (!q) return true;

    return (
      doc.title.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q)) ||
      doc.path.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q)
    );
  });
}

export function getRelatedDocs(currentDoc: DocItem, limit = 3): DocItem[] {
  if (!currentDoc) return [];

  // Filter out current doc
  const others = docs.filter((d) => d.id !== currentDoc.id);

  // Score by shared category and shared tags
  const scored = others.map((doc) => {
    let score = 0;
    if (doc.categoryId === currentDoc.categoryId) score += 3;
    const sharedTags = doc.tags.filter((t) => currentDoc.tags.includes(t));
    score += sharedTags.length * 2;
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.doc);
}
