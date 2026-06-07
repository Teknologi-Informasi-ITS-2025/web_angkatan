'use client'

import { useEffect, useRef } from 'react'

import { getTextStrokeStyle } from '@/lib/textStroke'

import Star from '@/components/atoms/icon/Star'

import useWindowBreakpoint from '@/hooks/useWindowBreakpoint'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const breakpoint = useWindowBreakpoint()

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

  const getStarSize = () => {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        return 20
      case 'md':
        return 30
      case 'lg':
        return 80
      default:
        return 80
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Autoplay prevented:', error)
      })
    }
  }, [])

  return (
    <section
      id="hero"
      className="bg-blue-cs-40 text-neutral-cs-10 relative flex min-h-[520px] w-full items-center justify-center overflow-hidden py-24 sm:min-h-[600px] md:py-16"
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
      <div className="from-blue-cs-30/20 to-blue-cs-40 absolute inset-0 bg-gradient-to-b" aria-hidden="true" />

      {/* 3. LAYER KONTEN: Cukup z-10 agar di atas background, sangat aman untuk Navbar */}
      <div className="relative z-10 flex min-h-[320px] w-full max-w-[1260px] flex-col items-center justify-center gap-8 px-6 py-16 text-center sm:px-10 md:gap-10 lg:min-h-screen lg:gap-[52px] lg:px-[90px] lg:py-[136px]">
        <div>
          <h1
            style={getTextStrokeStyle({ color: '#fff', width: getStrokeWidth() })}
            className="font-rubikone text-blue-cs-30 relative w-auto max-w-[11ch] text-4xl leading-tight sm:max-w-none md:text-6xl"
          >
            Profil Departemen
            <span>
              <Star
                className="absolute -top-3 -right-8 lg:-top-10 lg:-right-16"
                width={getStarSize()}
                height={getStarSize()}
              />
            </span>
          </h1>
        </div>
        <p className="w-full max-w-3xl text-center text-sm leading-7 font-semibold md:text-xl md:leading-8 lg:text-lg lg:leading-9">
          Merancang arsitektur sistem masa depan dan mengamankan ekosistem digital.
        </p>
      </div>
    </section>
  )
}

export default Hero
