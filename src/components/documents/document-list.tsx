"use client";

import Link from "next/link";
import type { Document } from "@/types";

interface DocumentListProps {
  documents: Document[];
  spaceId: string;
}

export function DocumentList({ documents, spaceId }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        No documents yet. Create your first document.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {documents.map((doc) => (
        <li key={doc.id}>
          <Link
            href={`/spaces/${spaceId}/documents/${doc.id}`}
            className="block px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium text-gray-900">{doc.title}</p>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {doc.content.slice(0, 100) || "Empty document"}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
