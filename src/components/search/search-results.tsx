"use client";

import Link from "next/link";
import type { SearchResult } from "@/types";

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
}

export function SearchResults({ results, loading }: SearchResultsProps) {
  if (loading) {
    return <p className="text-gray-500 py-4">Searching...</p>;
  }

  if (results.length === 0) {
    return (
      <p className="text-gray-500 py-4">No results found.</p>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <Link
          key={result.document.id}
          href={`/spaces/${result.document.space_id}/documents/${result.document.id}`}
          className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <p className="font-medium text-gray-900">
            {result.document.title}
          </p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {result.document.content.slice(0, 150)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Relevance: {(result.score * 100).toFixed(1)}%
          </p>
        </Link>
      ))}
    </div>
  );
}
