"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Target,
  Workflow,
  Network,
  Users,
  BarChart3,
  CheckCircle2,
  Download,
  BookTemplate as FileTemplate,
  Menu,
  ChevronRight,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react"

const navItems = [
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "nav.organization", href: "/dashboard/organization", icon: Building2 },
  { key: "nav.problem", href: "/dashboard/problem", icon: AlertTriangle },
  { key: "nav.outcomes", href: "/dashboard/outcomes", icon: Target },
  { key: "nav.methodology", href: "/dashboard/methodology", icon: Workflow },
  { key: "nav.toc", href: "/dashboard/theory-of-change", icon: Network },
  { key: "nav.stakeholders", href: "/dashboard/stakeholders", icon: Users },
  { key: "nav.indicators", href: "/dashboard/indicators", icon: BarChart3 },
  { key: "nav.quality", href: "/dashboard/quality", icon: CheckCircle2 },
  { key: "nav.export", href: "/dashboard/export", icon: Download },
  { key: "nav.templates", href: "/dashboard/templates", icon: FileTemplate },
  { key: "nav.settings", href: "/dashboard/settings", icon: Settings },
]

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const { t, language } = useLanguage()

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                isActive && "bg-primary/10 text-primary hover:bg-primary/15",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t(item.key)}</span>
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Button>
          </Link>
        )
      })}

      <Separator className="my-4" />

      <Link href="/">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>{language === "en" ? "Exit Dashboard" : "डैशबोर्ड से बाहर निकलें"}</span>
        </Button>
      </Link>
    </nav>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const { t, language } = useLanguage()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">{language === "en" ? "MargDarshak" : "मार्गदर्शक"}</span>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
          <SidebarNav />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
