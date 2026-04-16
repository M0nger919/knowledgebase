"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search your knowledge base...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </form>
  );
}
