'use client'
import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import LogoArusKeAtas from '@/assets/images/about-us/arusAtas.png'
import LogoArusKeBawah from '@/assets/images/about-us/arusBawah.png'
import LogoBintang from '@/assets/images/about-us/bintang.png'
import LogoDuaArus from '@/assets/images/about-us/duaArus.png'
import LogoGradient from '@/assets/images/about-us/full.png'
import HurufE from '@/assets/images/about-us/hurufE.png'
import LogoTitik from '@/assets/images/about-us/titik.png'

const AUTO_SLIDE_INTERVAL_MS = 7_000

const philosophyData = [
  {
    id: 1,
    title: 'Bintang',
    image: LogoBintang,
    description: (
      <>
        Perlambangan dari <span className="text-yellow-cs-30">Astra</span>, sebagai bentuk dari{' '}
        harapan dan <span className="text-yellow-cs-30">tujuan</span>, serta
        cita-cita bersama yang ingin kami capai.
      </>
    )
  },
  {
    id: 2,
    title: 'Arus ke Atas',
    image: LogoArusKeAtas,
    description: (
      <>
        Melambangkan proses <span className="text-yellow-cs-30">perkembangan karakter</span> dan{' '}
        <span className="text-yellow-cs-30">kompetensi</span> untuk mencapai{' '}
        <span className="text-yellow-cs-30">bintang</span> <span className="text-yellow-cs-30">(tujuan)</span>
      </>
    )
  },
  {
    id: 3,
    title: 'Titik',
    image: LogoTitik,
    description: (
      <>
        Simbol dari <span className="text-yellow-cs-30">Titik Awal</span>, menggambarkan bahwa tiap individu memiliki{' '}
        <span className="text-yellow-cs-30">potensi</span> serta mimpi yang menjadi awal{' '}
        <span className="text-yellow-cs-30">perjalanan</span>
      </>
    )
  },
  {
    id: 4,
    title: 'Arus ke Bawah',
    image: LogoArusKeBawah,
    description: (
      <>
        Bentuk menyerupai tangan yang merangkul menyimbolkan <span className="text-yellow-cs-30">kepedulian</span> dan{' '}
        <span className="text-yellow-cs-30">saling merangkul</span> untuk menciptakan lingkungan yang{' '}
        <span className="text-yellow-cs-30">inklusif</span>
      </>
    )
  },
  {
    id: 5,
    title: 'Dua Arus',
    image: LogoDuaArus,
    description: (
      <>
        Melambangkan <span className="text-yellow-cs-30">kolaborasi</span> antar Individu baik secara internal atau
        eksternal dalam upaya <span className="text-yellow-cs-30">berkembang bersama</span>
      </>
    )
  },
  {
    id: 6,
    title: 'Huruf E',
    image: HurufE,
    description: (
      <>
        Bentuk menyerupai huruf <span className="text-yellow-cs-30">‘e’</span> yang menjadi simbol dari nama{' '}
        <span className="text-yellow-cs-30">‘EVASTRA’</span>
      </>
    )
  },
  {
    id: 7,
    title: 'Gradasi',
    image: LogoGradient,
    description: (
      <>
        Melambangkan <span className="text-yellow-cs-30">keberagaman individu</span> yang{' '}
        <span className="text-yellow-cs-30">saling melengkapi</span> dalam satu tujuan bersama melalui proses
        perkembangan yang berjalan secara <span className="text-yellow-cs-30">bertahap</span>, dari mengenal diri,
        belajar bersama, hingga mencapai <span className="text-yellow-cs-30">potensi terbaik</span>
      </>
    )
  }
]

const carouselSlides = [philosophyData[philosophyData.length - 1], ...philosophyData, philosophyData[0]]
const firstRealSlideIndex = 1
const lastRealSlideIndex = philosophyData.length
const firstCloneSlideIndex = 0
const lastCloneSlideIndex = philosophyData.length + 1

const LogoPhilosophy = () => {
  const [slideIndex, setSlideIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const currentIndex = (slideIndex - 1 + philosophyData.length) % philosophyData.length

  const normalizeSlideIndex = (index: number) => {
    if (index < firstRealSlideIndex) return lastRealSlideIndex
    if (index > lastRealSlideIndex) return firstRealSlideIndex
    return index
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsTransitioning(true)
      setSlideIndex((prev) => normalizeSlideIndex(prev) + 1)
    }, AUTO_SLIDE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  const handlePrev = () => {
    setIsTransitioning(true)
    setSlideIndex((prev) => normalizeSlideIndex(prev) - 1)
  }

  const handleNext = () => {
    setIsTransitioning(true)
    setSlideIndex((prev) => normalizeSlideIndex(prev) + 1)
  }

  const handleTransitionEnd = () => {
    if (slideIndex <= firstCloneSlideIndex) {
      setIsTransitioning(false)
      setSlideIndex(lastRealSlideIndex)
    } else if (slideIndex >= lastCloneSlideIndex) {
      setIsTransitioning(false)
      setSlideIndex(firstRealSlideIndex)
    }
  }

  const handleIndicatorClick = (index: number) => {
    setIsTransitioning(true)
    setSlideIndex(index + 1)
  }

  return (
    <section
      id="logo-philosophy"
      className="text-neutral-cs-10 font-rubik relative flex w-full flex-col items-center justify-center px-4 py-16 text-center sm:px-10 lg:px-[90px]"
    >
      {/* JUDUL */}
      <h2 className="text-neutral-cs-00 font-rubikone mb-10 text-[28px] tracking-wide sm:text-[38px] md:text-[48px]">
        Logo Philosophy
      </h2>

      {/* WRAPPER SLIDER UTAMA */}
      <div className="relative w-full max-w-[1122px]">
        {/* CARD LUAR*/}
        <div
          className="relative w-full rounded-[42px] p-[16px] md:rounded-[75px] md:p-[25px]"
          style={{
            background: 'linear-gradient(180deg, #E8E163 0%, #214580 100%)'
          }}
        >
          {/* Inner card */}
          <div className="relative flex min-h-[420px] w-full items-center overflow-hidden rounded-[75px] bg-[#FFFCF2] px-2 py-12 sm:min-h-[400px] sm:min-h-[470px] md:min-h-[420px] md:rounded-[75px] md:px-20 md:py-14 lg:min-h-[360px]">
            {/* ISI KONTEN */}
            <div className="w-full overflow-hidden">
              <div
                className={`flex w-full motion-reduce:transition-none ${
                  isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''
                }`}
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                onTransitionEnd={handleTransitionEnd}
              >
                {carouselSlides.map((philosophy, index) => (
                  <div
                    key={`${philosophy.id}-${index}`}
                    className="flex w-full min-w-full flex-col items-center gap-6 px-2 text-center md:flex-row md:items-center md:gap-12 md:px-6 md:text-left"
                    aria-hidden={index !== slideIndex}
                  >
                    {/* LOGO CONTAINER */}
                    <div className="flex h-[140px] w-[140px] flex-shrink-0 items-center justify-center overflow-hidden md:h-[231px] md:w-[203px]">
                      <div className="relative h-full max-h-[110px] w-full max-w-[110px] md:max-h-[231px] md:max-w-[203px]">
                        <Image
                          src={philosophy.image}
                          alt={philosophy.title}
                          fill
                          priority={philosophy.id === philosophyData[0].id}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* TEKS FILOSOFI */}
                    <div className="flex flex-1 flex-col items-center gap-3 md:items-start">
                      <h3
                        className="font-rubikone text-xl tracking-wide sm:text-2xl md:text-3xl"
                        style={{ color: '#173679' }}
                      >
                        {philosophy.title}
                      </h3>

                      <div className="flex w-full max-w-[821px] flex-col gap-4 text-center font-sans text-xs leading-relaxed font-semibold text-[#173679] sm:text-base md:text-left md:text-base lg:text-xl">
                        <p>{philosophy.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANAH  */}
            <div className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center justify-between px-3 md:px-5">
              <button
                onClick={handlePrev}
                aria-label="Previous"
                className="pointer-events-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-3xl font-light text-[#1a3a6e] transition-all select-none hover:bg-black/5 active:bg-black/10 md:h-10 md:w-10"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                aria-label="Next"
                className="pointer-events-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-3xl font-light text-[#1a3a6e] transition-all select-none hover:bg-black/5 active:bg-black/10 md:h-10 md:w-10"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ITULAH */}
      <div className="mt-6 flex justify-center gap-2">
        {philosophyData.map((_, i) => (
          <button
            key={i}
            onClick={() => handleIndicatorClick(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentIndex ? '24px' : '8px',
              height: '8px',
              background: i === currentIndex ? '#c8d45a' : 'rgba(255,255,255,0.4)'
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default LogoPhilosophy
