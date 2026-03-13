import Link from "next/link";
import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            TripCraft
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/planner" className="text-zinc-700 hover:text-zinc-950">
              AI Planner
            </Link>
            <Link href="/trips" className="text-zinc-700 hover:text-zinc-950">
              My Trips
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-10">{children}</main>
    </div>
  );
}

