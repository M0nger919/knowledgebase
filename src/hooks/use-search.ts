"use client";

import { useState } from "react";
import type { SearchResult } from "@/types";

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(query: string, spaceId?: string) {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ query });
      if (spaceId) params.set("spaceId", spaceId);

      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, search };
}
