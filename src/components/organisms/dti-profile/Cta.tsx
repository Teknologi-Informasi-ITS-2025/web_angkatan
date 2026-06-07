'use client'

import Image from 'next/image'

import { getTextStrokeStyle } from '@/lib/textStroke'

import Frame from '@/assets/images/dti-profile/ara7.jpg'
import cloudIcon2 from '@/assets/images/dti-profile/awan3.svg'
import Bg from '@/assets/images/dti-profile/cta.png'
import useWindowBreakpoint from '@/hooks/useWindowBreakpoint'

const achievements = ['Juara 1 CTF', 'Juara 1 CTF', 'Juara 1 CTF']

const Cta = () => {
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
    <section className="relative w-full overflow-hidden px-6 py-20 sm:px-10 md:min-h-[750px] lg:px-24">
      <div className="pointer-events-none absolute top-0 -left-28 z-10 h-auto w-[320px] scale-x-100 transform sm:w-[420px] lg:-left-[10%] lg:w-1/2">
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
      <Image src={Bg} alt="Background" fill sizes="100vw" className="absolute inset-0 object-cover" />

      <div className="relative z-10">
        <h1
          style={getTextStrokeStyle({ color: '#fff', width: getStrokeWidth() })}
          className="font-rubikone text-blue-cs-30 relative w-auto text-center text-4xl leading-tight sm:text-5xl md:text-right md:text-6xl"
        >
          Proven Result
        </h1>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-5 pt-16 sm:grid-cols-2 md:pt-24 lg:grid-cols-3 lg:gap-6 lg:pt-36">
        {achievements.map((achievement, index) => (
          <article
            key={`${achievement}-${index}`}
            className="w-full overflow-hidden rounded-lg border-2 border-white p-3 sm:p-4"
            style={{
              background: 'linear-gradient(180deg, #0D294F 12.02%, #1B3C6A 50.96%, #4071B3 100%)'
            }}
          >
            <div className="relative w-full">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
                <Image
                  src={Frame}
                  alt={`${achievement} thumbnail`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div
                className="mt-3 w-full rounded-lg border border-[#FFFCF2]"
                style={{
                  background: 'linear-gradient(180deg, #4888C8 0%, #9DBDBA 56.73%, #FEFAA9 100%)'
                }}
              >
                <div className="px-4 py-2 text-center">
                  <p className="text-sm font-semibold text-white md:text-base">{achievement}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Cta
