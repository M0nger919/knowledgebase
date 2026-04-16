"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { SearchBar } from "@/components/search/search-bar";

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Your knowledge spaces</p>
        </div>
        <div className="mb-8">
          <SearchBar onSearch={() => {}} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Space cards will go here */}
          <p className="text-gray-400 col-span-full text-center py-12">
            No spaces yet. Create your first space to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
