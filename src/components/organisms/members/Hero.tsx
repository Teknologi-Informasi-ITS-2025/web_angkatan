'use client'

import React, { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { getTextStrokeStyle } from '@/lib/textStroke'

import Star from '@/components/atoms/icon/Star'

import useWindowBreakpoint from '@/hooks/useWindowBreakpoint'

type SortValue = 'member-asc' | 'name-asc' | 'name-desc' | 'nrp-asc' | 'nrp-desc'

type MemberFilters = {
  search?: string | string[]
  region?: string | string[]
  sort?: string | string[]
}

const FILTER_DEBOUNCE_MS = 250

const sortOptions: { label: string; value: SortValue }[] = [
  { label: 'Member Asc. (001 -> 129)', value: 'member-asc' },
  { label: 'Name Asc. (A -> Z)', value: 'name-asc' },
  { label: 'Name Dsc. (Z -> A)', value: 'name-desc' },
  { label: 'NRP Asc. (1 -> 129)', value: 'nrp-asc' },
  { label: 'NRP Dsc. (129 -> 1)', value: 'nrp-desc' }
]

const getSingleValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

const getInitialSort = (value: string | string[] | undefined): SortValue => {
  const sort = getSingleValue(value)

  if (sortOptions.some((option) => option.value === sort)) {
    return sort as SortValue
  }

  return 'member-asc'
}

type HeroProps = {
  filters: MemberFilters
}

const Hero = ({ filters }: HeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const [search, setSearch] = useState(() => getSingleValue(filters.search))
  const [region, setRegion] = useState(() => getSingleValue(filters.region))
  const [sort, setSort] = useState<SortValue>(() => getInitialSort(filters.sort))
  const [isSortOpen, setIsSortOpen] = useState(false)

  const selectedSort = sortOptions.find((option) => option.value === sort) ?? sortOptions[0]

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search)

      if (search.trim()) {
        params.set('search', search.trim())
      } else {
        params.delete('search')
      }

      if (region.trim()) {
        params.set('region', region.trim())
      } else {
        params.delete('region')
      }

      if (sort !== 'member-asc') {
        params.set('sort', sort)
      } else {
        params.delete('sort')
      }

      const queryString = params.toString()
      const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname

      router.replace(nextUrl, { scroll: false })
    }, FILTER_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [region, router, search, sort])

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
        return 30
      case 'md':
        return 50
      case 'lg':
        return 100
      default:
        return 100
    }
  }

  return (
    <section
      id="hero"
      className="bg-blue-cs-40 text-neutral-cs-10 pointer-events-none relative flex w-full items-center justify-center py-36 md:py-16"
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

      {/* 3. LAYER KONTEN: Di atas member list overlap, tetap di bawah navbar fixed. */}
      <div className="relative z-30 flex min-h-[640px] w-full max-w-[1260px] flex-col items-center gap-10 px-6 py-24 text-center sm:px-10 lg:min-h-[916px] lg:gap-[52px] lg:px-[90px] lg:py-[136px]">
        <div>
          <h1
            style={getTextStrokeStyle({ color: '#fff', width: getStrokeWidth() })}
            className="font-rubikone text-blue-cs-30 relative w-auto text-4xl md:text-6xl"
          >
            Meet The Members
            <span>
              <Star
                className="absolute -top-3 -right-8 lg:-top-12 lg:-right-24"
                width={getStarSize()}
                height={getStarSize()}
              />
            </span>
          </h1>
        </div>
        <p className="w-full text-center text-lg leading-8 font-semibold md:text-xl lg:w-3/4 lg:text-2xl">
          129 individuals, countless dreams, one constellation. EVASTRA is a space where every member grows through
          learning, exploration, and shared experiences.
        </p>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="pointer-events-auto grid w-full max-w-[920px] grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-[320px_320px_240px]"
        >
          <label className="flex flex-col gap-2">
            <span className="text-neutral-cs-10/70 text-sm leading-5 font-bold tracking-wide uppercase">Search</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or NRP..."
              className="border-neutral-cs-10 text-neutral-cs-10 placeholder:text-neutral-cs-10/70 focus:ring-neutral-cs-10/40 h-[54px] w-full rounded-[12px] border-2 bg-[#071c35]/70 px-5 text-[15px] leading-6 font-semibold transition outline-none focus:ring-2 lg:rounded-l-[12px] lg:rounded-r-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-neutral-cs-10/70 text-sm leading-5 font-bold tracking-wide uppercase">Region</span>
            <input
              type="search"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              placeholder="Search by region"
              className="border-neutral-cs-10 text-neutral-cs-10 placeholder:text-neutral-cs-10/70 focus:ring-neutral-cs-10/40 h-[54px] w-full rounded-[12px] border-2 bg-[#071c35]/70 px-5 text-[15px] leading-6 font-semibold transition outline-none focus:ring-2 lg:rounded-none"
            />
          </label>

          <div className="relative flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
            <span className="text-neutral-cs-10/70 text-sm leading-5 font-bold tracking-wide uppercase">Sort By</span>
            <button
              type="button"
              aria-expanded={isSortOpen}
              onClick={() => setIsSortOpen((current) => !current)}
              className={`border-neutral-cs-10 text-neutral-cs-10 focus:ring-neutral-cs-10/40 flex h-[54px] w-full items-center justify-between border-2 bg-[#071c35]/70 px-5 text-[15px] leading-6 font-semibold transition outline-none focus:ring-2 ${
                isSortOpen
                  ? 'rounded-t-[12px] rounded-b-none lg:rounded-tl-none'
                  : 'rounded-[12px] lg:rounded-l-none lg:rounded-r-[12px]'
              }`}
            >
              <span>{selectedSort.label}</span>
              <span
                aria-hidden="true"
                className={`h-2 w-2 border-t-2 border-l-2 border-current transition ${isSortOpen ? 'rotate-45' : 'rotate-[225deg]'}`}
              />
            </button>

            {isSortOpen ? (
              <div className="border-neutral-cs-10 absolute top-[82px] right-0 left-0 z-100 overflow-hidden rounded-b-[12px] border-2 border-t-0 bg-[#071c35] lg:rounded-br-[12px] lg:rounded-bl-none">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value)
                      setIsSortOpen(false)
                    }}
                    className={`block h-[54px] w-full px-5 text-left text-[15px] leading-6 font-bold transition ${
                      option.value === sort
                        ? 'bg-neutral-cs-10 text-blue-cs-40'
                        : 'text-neutral-cs-10 hover:bg-neutral-cs-10/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}

export default Hero
