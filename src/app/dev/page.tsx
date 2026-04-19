import Link from "next/link";
import { Button } from "@/components/ui/button";

const APP_SECTIONS = [
  {
    title: "Auth",
    description: "Login, signup, and session management",
    links: [
      { label: "Login", href: "/login", color: "bg-blue-600 hover:bg-blue-700" },
      { label: "Signup", href: "/signup", color: "bg-blue-600 hover:bg-blue-700" },
    ],
  },
  {
    title: "Dashboard",
    description: "Main app dashboard with search, ingest, and spaces",
    links: [
      { label: "Dashboard", href: "/dashboard", color: "bg-violet-600 hover:bg-violet-700" },
    ],
  },
  {
    title: "API Endpoints",
    description: "Backend API routes for testing",
    links: [
      { label: "Search API", href: "/api/search", color: "bg-emerald-600 hover:bg-emerald-700" },
      { label: "File Ingest", href: "/api/ingest/file", color: "bg-emerald-600 hover:bg-emerald-700" },
      { label: "Text Ingest", href: "/api/ingest/text", color: "bg-emerald-600 hover:bg-emerald-700" },
      { label: "URL Ingest", href: "/api/ingest/url", color: "bg-emerald-600 hover:bg-emerald-700" },
      { label: "Job Status", href: "/api/jobs/status", color: "bg-emerald-600 hover:bg-emerald-700" },
    ],
  },
] as const;

export default function DevPage() {
  return (
    <div className="flex flex-col">
      {/* Dev banner */}
      <div className="bg-amber-500 text-white text-center text-sm font-medium py-2 px-4">
        Internal Development Environment — Not for public access
      </div>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Knowbase Dev Hub</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Internal testing and development portal
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Framework</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Next.js 16</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Stack</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">TypeScript + Tailwind</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Backend</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Supabase</p>
          </div>
        </div>

        {/* App sections */}
        <div className="space-y-6">
          {APP_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {section.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span
                      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors ${link.color}`}
                    >
                      {link.label}
                      <svg className="ml-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Environment info */}
        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Environment Info
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-amber-700 dark:text-amber-400">
            <li>Domain: quantafelis.org</li>
            <li>Deploy: Vercel (auto-deploy on push to main)</li>
            <li>DB: Supabase (ytvvmxxglbulcyzmagsv)</li>
            <li>Repo: github.com/M0nger919/knowledgebase</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
