'use client'
import React, { useEffect, useRef } from 'react'

import { getTextStrokeStyle } from '@/lib/textStroke'

import useWindowBreakpoint from '@/hooks/useWindowBreakpoint'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const breakpoint = useWindowBreakpoint()

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Autoplay prevented:', error)
      })
    }
  }, [])

  const getStrokeWidth = () => {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        return 3
      case 'md':
        return 4
      case 'lg':
        return 6
      default:
        return 6
    }
  }

  return (
    <section
      id="about-hero"
      className="text-neutral-cs-10 bg-blue-cs-40 relative flex min-h-[520px] w-full flex-col items-center justify-center overflow-hidden py-24 pt-40 text-center sm:min-h-[600px] md:py-16 md:pt-36"
    >
      {/* 1. LAYER VIDEO: Tanpa z-index (Otomatis paling bawah) */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/assets/videos/starrynight.mp4" type="video/mp4" />
      </video>

      {/* 2. LAYER OVERLAY: Tanpa z-index (Otomatis di atas video berdasarkan DOM) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E38] to-[#173679]/40" aria-hidden="true" />
      {/* {TITLE} */}
      <div className="relative inline-block w-full max-w-[325px] sm:max-w-[500px] lg:max-w-[890px]">
        <h1
          className="font-rubikone text-blue-cs-30 text-4xl lg:text-5xl"
          style={getTextStrokeStyle({ color: '#FFFFFF', width: getStrokeWidth() })}
        >
          Beyond The Identity
        </h1>

        {/* {TULISAN TITLE} */}
        <p className="mx-auto mt-3 w-full max-w-[800px] text-center font-sans text-[12px] leading-0 leading-relaxed font-semibold text-white sm:text-base md:text-lg">
          More than just a name. This is the story, vision, and philosophy that shape our identity.
        </p>
      </div>
    </section>
  )
}

export default Hero
