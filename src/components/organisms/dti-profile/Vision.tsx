'use client'

import Image from 'next/image'

import { getTextStrokeStyle } from '@/lib/textStroke'

import cloudIcon from '@/assets/images/dti-profile/awan1.svg'
import Frame from '@/assets/images/dti-profile/frame-vis.png'
import useWindowBreakpoint from '@/hooks/useWindowBreakpoint'

const Vision = () => {
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
  return (
    <section className="relative w-full overflow-hidden px-4 py-16 sm:px-8 md:min-h-[600px] md:py-20 lg:px-16">
      <div className="pointer-events-none absolute top-0 -left-32 z-0 w-[360px] scale-x-100 transform sm:w-[480px] lg:-left-[10%] lg:w-[600px]">
        <div className="relative">
          <Image
            src={cloudIcon}
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
        Vision
      </h1>

      <div className="relative z-10 mt-8 flex w-full items-center justify-center md:mt-10">
        <div className="relative w-full max-w-[1100px]">
          <Image src={Frame} alt="Frame" className="hidden h-auto w-full sm:block" priority />

          <div className="rounded-2xl border-2 border-white/70 bg-[#0D294F]/80 px-5 py-8 shadow-[0_16px_40px_rgba(0,0,0,0.24)] sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-center sm:rounded-none sm:border-0 sm:bg-transparent sm:px-10 sm:py-0 sm:shadow-none">
            <p className="mx-auto max-w-3xl text-center text-sm leading-7 font-semibold text-white sm:text-base md:text-lg md:leading-relaxed">
              Menjadi pengelola program studi bidang teknologi informasi yang memiliki reputasi internasional serta
              berkontribusi pada keilmuan dan kemanusiaan.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Vision
