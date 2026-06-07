'use client'

import React, { type ReactNode, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import Star from '@/components/atoms/icon/StarMember'

import CloudAtas from '@/assets/images/members/cloud-atas.svg'
import CloudBawah from '@/assets/images/members/cloud-bawah.svg'
import CloudTengah from '@/assets/images/members/cloud-tengah.svg'
import MemberBg from '@/assets/images/members/member-bg.png'

const CLOUD_GAP_VH = 300
const EDGE_OFFSET_VH = 1
const STAR_FIELD_SEED = 20260603
const STAR_GAP_PX = 420
const STAR_MIN_COUNT = 4
const STAR_MAX_COUNT = 32
const TOP_CLOUD_MIN_SECTION_HEIGHT_VH = 150

const getVh = (value: number) => (window.innerHeight * value) / 100

type MemberListShellProps = {
  children: ReactNode
}

type DecorativeStar = {
  id: string
  left: number
  opacity: number
  rotate: number
  size: number
  top: number
}

const createSeededRandom = (seed: number) => {
  let value = seed

  return () => {
    value += 0x6d2b79f5

    let next = value
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)

    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

const getStarCount = (sectionHeight: number) => {
  const rawCount = Math.ceil(sectionHeight / STAR_GAP_PX)

  return Math.min(STAR_MAX_COUNT, Math.max(STAR_MIN_COUNT, rawCount))
}

const createStarField = (count: number): DecorativeStar[] => {
  const random = createSeededRandom(STAR_FIELD_SEED)

  return Array.from({ length: count }, (_, index) => {
    const side = index % 3
    const left = side === 0 ? 6 + random() * 24 : side === 1 ? 70 + random() * 24 : 18 + random() * 64

    return {
      id: `member-star-${index}`,
      left,
      opacity: 1,
      rotate: -26 + random() * 52,
      size: 75 + random() * 30,
      top: ((index + 0.18 + random() * 0.64) / count) * 100
    }
  })
}

const MemberListShell = ({ children }: MemberListShellProps) => {
  const sectionRef = useRef<HTMLElement>(null)
  const [middleCloudCount, setMiddleCloudCount] = useState(0)
  const [showTopCloud, setShowTopCloud] = useState(false)
  const [stars, setStars] = useState<DecorativeStar[]>([])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    const updateMiddleCloudCount = () => {
      const sectionHeight = section.getBoundingClientRect().height
      const viewportWidth = window.innerWidth
      const gap = getVh(CLOUD_GAP_VH)
      const edgeOffset = getVh(EDGE_OFFSET_VH)
      const topCloudHeight = (viewportWidth * 1204) / 1440
      const middleCloudHeight = (viewportWidth * 1249) / 1440
      const bottomCloudHeight = (viewportWidth * 1091) / 1440
      const availableHeight = sectionHeight - edgeOffset * 2 - topCloudHeight - bottomCloudHeight - gap * 2

      setMiddleCloudCount(Math.max(0, Math.floor(availableHeight / (middleCloudHeight + gap))))
      setShowTopCloud(sectionHeight >= getVh(TOP_CLOUD_MIN_SECTION_HEIGHT_VH))
      setStars(createStarField(getStarCount(sectionHeight)))
    }

    updateMiddleCloudCount()

    const resizeObserver = new ResizeObserver(updateMiddleCloudCount)

    resizeObserver.observe(section)
    window.addEventListener('resize', updateMiddleCloudCount)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateMiddleCloudCount)
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-blue-cs-40 relative min-h-[100vh] w-full">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-repeat-y opacity-80"
        style={{
          backgroundImage: `url(${MemberBg.src})`,
          backgroundPosition: 'top center',
          backgroundSize: '100% auto'
        }}
        aria-hidden="true"
      />
      <div
        className="from-blue-cs-40 pointer-events-none absolute top-0 left-0 z-4 h-[17vh] w-full bg-linear-to-b to-transparent md:h-[50vh] lg:h-[30vh]"
        aria-hidden="true"
      />
      {showTopCloud && (
        <Image
          src={CloudAtas}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-3 h-auto w-full opacity-40 select-none"
          priority
        />
      )}
      {Array.from({ length: middleCloudCount }, (_, index) => (
        <Image
          key={index}
          src={CloudTengah}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 z-10 h-auto w-full opacity-40 select-none"
          style={{
            top: `calc(1vh + (100vw * 1204 / 1440) + ${CLOUD_GAP_VH}vh + ${index} * ((100vw * 1249 / 1440) + ${CLOUD_GAP_VH}vh))`
          }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 z-5 overflow-hidden select-none" aria-hidden="true">
        {stars.map((star) => (
          <Star
            key={star.id}
            alt=""
            width={Math.round(star.size)}
            height={Math.round((star.size * 139) / 140)}
            className="absolute h-auto"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              transform: `translate(-50%, -50%) rotate(${star.rotate}deg)`
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-[1vh] left-0 z-2 h-auto w-full select-none">
        <div className="relative w-full">
          <Image src={CloudBawah} alt="cloud bawah" aria-hidden="true" className="w-full opacity-40" />

          <Star className="absolute top-[50%] left-24" />
          <Star className="absolute top-[20%] right-24" />
        </div>
      </div>

      <div className="relative z-20 -mt-56 flex flex-wrap justify-center gap-8 px-6 py-24 sm:px-10 lg:-mt-120 lg:px-20">
        {children}
      </div>
    </section>
  )
}

export default MemberListShell
