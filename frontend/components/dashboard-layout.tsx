"use client"

import type React from "react"

import { Header } from "./header"
import { SidebarNav } from "./sidebar-nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BackgroundEffects } from "./background-effects"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundEffects variant="dashboard" />

      <Header />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-sidebar/95 backdrop-blur-sm md:flex">
          <div className="flex h-16 items-center gap-2 border-b px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary animate-pulse-glow">
                <Sparkles className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground text-sm">MargDarshak</span>
                <span className="text-[10px] text-sidebar-foreground/60">From Blank Page to Blueprint</span>
              </div>
            </Link>
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <SidebarNav />
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
