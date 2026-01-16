"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressCardProps {
  title: string
  value: number
  max?: number
  description?: string
  variant?: "default" | "success" | "warning" | "danger"
  icon?: React.ReactNode
}

export function ProgressCard({ title, value, max = 100, description, variant = "default", icon }: ProgressCardProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const variantClasses = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  }

  const progressVariants = {
    default: "[&>div]:bg-primary",
    success: "[&>div]:bg-success",
    warning: "[&>div]:bg-warning",
    danger: "[&>div]:bg-destructive",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className={cn("h-4 w-4", variantClasses[variant])}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", variantClasses[variant])}>
          {value}
          {max !== 100 && `/${max}`}
          {max === 100 && "%"}
        </div>
        <Progress value={percentage} className={cn("mt-2", progressVariants[variant])} />
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  )
}
