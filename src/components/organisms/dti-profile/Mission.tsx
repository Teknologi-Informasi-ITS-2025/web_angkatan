'use client'

import { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'

import { getTextStrokeStyle } from '@/lib/textStroke'

import cloudIcon2 from '@/assets/images/dti-profile/awan2.svg'
import Frame from '@/assets/images/dti-profile/frame-mis.png'
import useWindowBreakpoint from '@/hooks/useWindowBreakpoint'

// Mission data array with different content
const missions = [
  {
    id: 1,
    title: 'Mission 1',
    content:
      'Menyelenggarakan pendidikan dan pengajaran Teknologi Informasi dengan menggunakan kurikulum yang adaptif, berorientasi ke masa depan dan didukung Sumber Daya Manusia yang berkualitas serta fasilitas yang memadai.'
  },
  {
    id: 2,
    title: 'Mission 2',
    content:
      'Melaksanakan penelitian yang bermutu di bidang Cybersecurity, System Integration dan Cloud Computing Services, serta Internet of Things for Smart City.'
  },
  {
    id: 3,
    title: 'Mission 3',
    content: 'Menjalin kemitraan dengan instansi dalam maupun luar negeri.'
  },
  {
    id: 4,
    title: 'Mission 4',
    content:
      'Menyelenggarakan pengabdian kepada masyarakat berupa pelatihan, penyuluhan, penerapan hasil penelitian untuk pengembangan potensi dan pemberdayaan masyarakat daerah.'
  }
]

const Mission = () => {
  const breakpoint = useWindowBreakpoint()
  const [currentIndex, setCurrentIndex] = useState(0)

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

  // Handle next with infinite loop
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % missions.length)
  }, [])

  // Handle previous with infinite loop
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + missions.length) % missions.length)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev()
      } else if (event.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext])

  const currentMission = missions[currentIndex]

  return (
    <section className="relative w-full overflow-hidden px-4 py-16 pb-24 sm:px-8 md:min-h-[670px] md:py-20 md:pb-28 lg:px-16">
      <div className="pointer-events-none absolute top-0 -right-32 z-0 w-[360px] -scale-x-100 transform sm:w-[480px] lg:-right-[10%] lg:w-[600px]">
        <div className="relative">
          <Image
            src={cloudIcon2}
            alt="Cloud decoration"
            width={600}
            height={150}
            className="h-auto w-full object-contain opacity-90"
          />
        </div>
      </div>
      <h1
        style={getTextStrokeStyle({ color: '#fff', width: getStrokeWidth() })}
        className="font-rubikone text-blue-cs-30 relative z-10 w-auto text-center text-4xl leading-tight sm:text-5xl md:text-6xl"
      >
        Mission
      </h1>

      <div className="relative z-10 mt-8 flex w-full items-center justify-center md:mt-10 md:py-8">
        <div className="relative w-full max-w-[1200px]">
          <Image src={Frame} alt="Frame" className="hidden h-auto w-full sm:block" priority />

          <div className="min-h-[260px] rounded-2xl border-2 border-white/70 bg-[#0D294F]/80 px-12 py-10 shadow-[0_16px_40px_rgba(0,0,0,0.24)] sm:absolute sm:inset-0 sm:flex sm:min-h-0 sm:flex-col sm:items-center sm:justify-center sm:rounded-none sm:border-0 sm:bg-transparent sm:px-16 sm:py-0 sm:shadow-none md:px-24">
            <p className="animate-in fade-in mx-auto max-w-3xl text-center text-sm leading-7 font-semibold text-white transition-all duration-300 sm:text-base md:text-lg md:leading-relaxed">
              {currentMission.content}
            </p>
          </div>
          <button
            onClick={handlePrev}
            aria-label="Previous mission"
            className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-3xl leading-none font-light text-white transition-all select-none hover:scale-110 hover:text-gray-300 active:scale-95 sm:left-4 sm:h-12 sm:w-12 md:text-6xl lg:left-24"
          >
            ‹
          </button>

          <button
            onClick={handleNext}
            aria-label="Next mission"
            className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-3xl leading-none font-light text-white transition-all select-none hover:scale-110 hover:text-gray-300 active:scale-95 sm:right-4 sm:h-12 sm:w-12 md:text-6xl lg:right-24"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}

export default Mission
