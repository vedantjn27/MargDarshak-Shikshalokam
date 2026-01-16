"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function BackgroundEffects({ variant = "default" }: { variant?: "default" | "dashboard" | "landing" }) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  if (variant === "landing") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-float"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(0,180,160,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,180,160,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl animate-float"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(255,170,50,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,170,50,0.1) 0%, transparent 70%)",
            animationDelay: "-3s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full blur-3xl animate-float"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(130,100,255,0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(130,100,255,0.08) 0%, transparent 70%)",
            animationDelay: "-1.5s",
          }}
        />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>
    )
  }

  if (variant === "dashboard") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Subtle gradient */}
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-30"
          style={{
            background: isDark
              ? "radial-gradient(circle at top right, rgba(0,180,160,0.1) 0%, transparent 50%)"
              : "radial-gradient(circle at top right, rgba(0,180,160,0.08) 0%, transparent 50%)",
          }}
        />
        {/* Dots pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)"
              : "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>
    )
  }

  return null
}
