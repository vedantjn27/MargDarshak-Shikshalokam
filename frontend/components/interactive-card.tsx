"use client"

import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
}

export function InteractiveCard({ children, className, glowColor = "primary", onClick }: InteractiveCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          `bg-gradient-to-br from-${glowColor}/5 to-transparent`,
        )}
      />
      {/* Border glow */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-primary/20" />
      {children}
    </Card>
  )
}
