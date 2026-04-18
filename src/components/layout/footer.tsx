export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Knowbase. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/M0nger919/knowledgebase"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
