"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { SearchBar } from "@/components/search/search-bar";
import { IngestPanel } from "@/components/ingestion/ingest-panel";

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Your knowledge spaces</p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={() => {}} />
        </div>

        {/* Ingestion Panel */}
        <div className="mb-8">
          <IngestPanel />
        </div>

        {/* Recent Documents */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Documents
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-400">
              No documents yet. Use the panel above to add your first content.
            </p>
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Spaces</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <p className="text-gray-400 col-span-full text-center py-12">
              No spaces yet. Create your first space to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
