'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import People from '@/components/atoms/icon/People'

import type { ProvincePathData } from '@/types/maps'

type MapInteractiveProps = {
  provinces: ProvincePathData[]
  svgWidth: number
  svgHeight: number
}

const MapInteractive = ({ provinces, svgWidth, svgHeight }: MapInteractiveProps) => {
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number; placeBelow: boolean; arrowLeft: number } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const mapFrameRef = useRef<HTMLDivElement>(null)
  const provinceById = useMemo(
    () =>
      provinces.reduce<Record<string, ProvincePathData>>((acc, province) => {
        acc[province.id] = province
        return acc
      }, {}),
    [provinces]
  )
  const hoveredProvince = hoveredProvinceId ? (provinceById[hoveredProvinceId] ?? null) : null
  const tooltipWidthPx = 192
  const tooltipHalfWidthPx = 96
  const tooltipViewportGapPx = 16
  const tooltipVerticalGapPx = 14
  const tooltipEstimatedHeightPx = 96
  const tooltipArrowInsetPx = 22

  const handleProvinceToggle = (provinceId: string) => {
    setHoveredProvinceId((currentId) => (currentId === provinceId ? null : provinceId))
  }

  useEffect(() => {
    if (!hoveredProvince) return

    const updateTooltipPosition = () => {
      const mapFrame = mapFrameRef.current
      if (!mapFrame) return

      const rect = mapFrame.getBoundingClientRect()
      const provinceLeft = rect.left + (hoveredProvince.centerX / svgWidth) * rect.width
      const provinceTop = rect.top + (hoveredProvince.centerY / svgHeight) * rect.height
      const minLeft = tooltipHalfWidthPx + tooltipViewportGapPx
      const maxLeft = window.innerWidth - tooltipHalfWidthPx - tooltipViewportGapPx
      const placeBelow = provinceTop < tooltipEstimatedHeightPx + tooltipViewportGapPx
      const clampedLeft = Math.min(Math.max(provinceLeft, minLeft), maxLeft)
      const tooltipStart = clampedLeft - tooltipHalfWidthPx
      const arrowLeft = Math.min(
        Math.max(provinceLeft - tooltipStart, tooltipArrowInsetPx),
        tooltipWidthPx - tooltipArrowInsetPx
      )

      setTooltipPosition({
        left: clampedLeft,
        top: placeBelow ? provinceTop + tooltipVerticalGapPx : provinceTop - tooltipVerticalGapPx,
        placeBelow,
        arrowLeft
      })
    }

    updateTooltipPosition()

    const scrollContainer = scrollContainerRef.current
    const handleViewportChange = () => {
      window.requestAnimationFrame(updateTooltipPosition)
    }

    scrollContainer?.addEventListener('scroll', handleViewportChange, { passive: true })
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      scrollContainer?.removeEventListener('scroll', handleViewportChange)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [hoveredProvince, svgHeight, svgWidth])

  return (
    <div className="relative w-full max-w-[1440px] px-3 py-16 md:px-6">
      <div ref={scrollContainerRef} className="overflow-x-auto overscroll-x-contain touch-auto pb-3 md:overflow-visible md:pb-0">
        <div ref={mapFrameRef} className="relative mx-auto w-[980px] sm:w-[1120px] md:w-full">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="h-auto w-full"
            role="img"
            aria-label="Peta Indonesia per provinsi"
            onClick={() => setHoveredProvinceId(null)}
            onMouseLeave={() => setHoveredProvinceId(null)}
          >
            <g fillRule="evenodd" clipRule="evenodd">
              {provinces.map((province) => {
                const hasMahasiswa = province.totalMahasiswa > 0

                return (
                  <g key={province.id} transform={`translate(${province.x}, ${province.y})`}>
                    <g
                      className={`transition-[filter] duration-200 ${hasMahasiswa
                        ? 'cursor-pointer hover:brightness-110 hover:contrast-125 focus:outline-none focus-visible:outline-none'
                        : 'cursor-default filter grayscale opacity-50'
                        }`}
                      tabIndex={hasMahasiswa ? 0 : undefined}
                      aria-label={`${province.province}, total mahasiswa ${province.totalMahasiswa}`}
                      onMouseEnter={hasMahasiswa ? () => setHoveredProvinceId(province.id) : undefined}
                      onMouseLeave={hasMahasiswa ? () => setHoveredProvinceId(null) : undefined}
                      onClick={
                        hasMahasiswa
                          ? (event) => {
                              event.stopPropagation()
                              handleProvinceToggle(province.id)
                            }
                          : undefined
                      }
                      onFocus={hasMahasiswa ? () => setHoveredProvinceId(province.id) : undefined}
                      onBlur={hasMahasiswa ? () => setHoveredProvinceId(null) : undefined}
                    >
                      <title>{province.province}</title>
                      {province.paths.map((p, idx) => (
                        <path key={idx} d={p.d} fill={p.fill} />
                      ))}
                    </g>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>
      </div>
      {hoveredProvince && tooltipPosition
        ? createPortal(
            <div
              className={`pointer-events-none fixed z-20 -translate-x-1/2 ${tooltipPosition.placeBelow ? '' : '-translate-y-full'}`}
              style={{
                left: `${tooltipPosition.left}px`,
                top: `${tooltipPosition.top}px`
              }}
            >
              <div className="bg-neutral-cs-10 text-neutral-cs-100 relative w-48 rounded-2xl px-6 py-3 text-center shadow-lg">
                <p className="font-semibold">{hoveredProvince.province}</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <p className="text-yellow-cs-40 font-rubikone text-2xl leading-none">{hoveredProvince.totalMahasiswa}</p>
                  <People />
                </div>
                <span className="sr-only">Total mahasiswa {hoveredProvince.totalMahasiswa}</span>
                {tooltipPosition.placeBelow ? (
                  <div
                    className="absolute top-[-12px] h-0 w-0 -translate-x-1/2 border-r-[12px] border-b-[14px] border-l-[12px] border-r-transparent border-b-white border-l-transparent"
                    style={{ left: `${tooltipPosition.arrowLeft}px` }}
                  />
                ) : (
                  <div
                    className="absolute bottom-[-12px] h-0 w-0 -translate-x-1/2 border-t-[14px] border-r-[12px] border-l-[12px] border-t-white border-r-transparent border-l-transparent"
                    style={{ left: `${tooltipPosition.arrowLeft}px` }}
                  />
                )}
              </div>
            </div>,
            document.body
          )
        : null}
      <p className="text-blue-cs-30 text-center text-xs font-semibold md:hidden">
        Geser horizontal untuk melihat peta penuh.
      </p>
    </div>
  )
}

export default MapInteractive
