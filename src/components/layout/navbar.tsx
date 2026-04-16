"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Knowbase
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
