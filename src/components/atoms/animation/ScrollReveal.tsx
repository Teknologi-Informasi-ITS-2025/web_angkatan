'use client'

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/utils/cn'

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: RevealDirection
  distance?: number
  duration?: number
  once?: boolean
  rootMargin?: string
  threshold?: number
}

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 28,
  duration = 700,
  once = true,
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.18
}: ScrollRevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      const frame = window.requestAnimationFrame(() => {
        setIsReady(true)
        setIsVisible(true)
      })

      return () => {
        window.cancelAnimationFrame(frame)
      }
    }

    const readyFrame = window.requestAnimationFrame(() => {
      setIsReady(true)
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)

          if (once) {
            observer.unobserve(entry.target)
          }

          return
        }

        if (!once) {
          setIsVisible(false)
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    observer.observe(element)

    return () => {
      window.cancelAnimationFrame(readyFrame)
      observer.disconnect()
    }
  }, [once, rootMargin, threshold])

  return (
    <div
      ref={elementRef}
      className={cn(
        'scroll-reveal',
        `scroll-reveal-${direction}`,
        isReady && 'scroll-reveal-ready',
        isVisible && 'scroll-reveal-visible',
        className
      )}
      style={
        {
          '--scroll-reveal-delay': `${delay}ms`,
          '--scroll-reveal-distance': `${distance}px`,
          '--scroll-reveal-duration': `${duration}ms`
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}

export default ScrollReveal
