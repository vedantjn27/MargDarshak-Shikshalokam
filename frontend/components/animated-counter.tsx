"use client"

import { useEffect, useState, useRef } from "react"

interface AnimatedCounterProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({
  target,
  duration = 1500,
  suffix = "",
  prefix = "",
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            const startTime = performance.now()
            const startValue = 0

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime
              const progress = Math.min(elapsed / duration, 1)

              // Easing function (ease-out-quart)
              const easeOut = 1 - Math.pow(1 - progress, 4)
              const currentValue = Math.floor(startValue + (target - startValue) * easeOut)

              setCount(currentValue)

              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }

            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.5 },
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={countRef} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
