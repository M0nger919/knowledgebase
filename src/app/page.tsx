import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col">
      {/* Hero - Under Construction */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-background)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-background)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03]" />

        {/* Gradient orbs */}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            Under Construction
          </div>

          {/* Logo */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/25">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Knowbase
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            The context layer between your knowledge and your AI agents.
          </p>

          {/* Description */}
          <p className="mt-6 text-sm sm:text-base text-gray-500 dark:text-gray-500 max-w-lg mx-auto leading-relaxed">
            We&apos;re building something new. Knowbase automatically organizes your documents,
            powers semantic search, and provides rich context to any AI agent that needs it.
          </p>

          {/* Email signup */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-72 rounded-l-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="button"
                className="rounded-r-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Notify me
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            No spam. We&apos;ll only email you when we launch.
          </p>

          {/* Divider */}
          <div className="mt-16 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-600">
            <div className="h-px w-12 bg-gray-200 dark:bg-gray-800" />
            <span>Coming soon</span>
            <div className="h-px w-12 bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Feature hints */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-xl border border-gray-200 bg-white/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">Auto-Organize</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Documents sorted into spaces automatically</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">AI-Native</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Context layer for any AI agent</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">Semantic Search</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Find anything by meaning, not keywords</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
