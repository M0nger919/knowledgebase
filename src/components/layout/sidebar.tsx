"use client";

import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 min-h-screen p-4">
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard"
          className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors"
        >
          All Spaces
        </Link>
      </div>
    </aside>
  );
}
