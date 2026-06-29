import type { Metadata } from "../types/metadata";

export function normalizeSearchQuery(value: string) {
  return value.toLowerCase().trim();
}

export function metadataToSearchText(item: Metadata) {
  const parts: string[] = [];
  for (const value of Object.values(item)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      parts.push(value.filter(Boolean).join(" "));
      continue;
    }
    parts.push(String(value));
  }
  return parts.join(" ");
}

export function metadataMatchesQuery(item: Metadata, query: string) {
  const q = normalizeSearchQuery(query);
  if (!q) return true;
  return normalizeSearchQuery(metadataToSearchText(item)).includes(q);
}
