'use client'

import Image from 'next/image'

import { getTextStrokeStyle } from '@/lib/textStroke'

import cloudIcon from '@/assets/images/dti-profile/awan1.svg'
import cloudIcon2 from '@/assets/images/dti-profile/awan2.svg'
import Tower2 from '@/assets/images/dti-profile/tw.png'
import useWindowBreakpoint from '@/hooks/useWindowBreakpoint'

const AboutDti = () => {
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
    <section
      id="about-us"
      className="relative flex w-full flex-col overflow-hidden px-6 py-20 sm:px-10 md:min-h-[700px] md:flex-row md:items-center md:py-24 lg:px-24"
    >
      <div className="pointer-events-none absolute top-0 -left-36 z-0 w-[360px] -scale-x-100 transform sm:w-[480px] lg:-left-[20%] lg:w-[600px]">
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
      <div className="pointer-events-none absolute top-32 left-1/3 z-0 hidden w-[420px] -scale-x-100 transform opacity-80 md:block lg:w-[600px]">
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
      <div className="relative z-10 w-full md:w-1/2">
        <h1
          style={getTextStrokeStyle({ color: '#fff', width: getStrokeWidth() })}
          className="font-rubikone text-blue-cs-30 relative w-auto text-center text-4xl leading-tight sm:text-5xl md:text-left lg:text-6xl"
        >
          Who We Are
        </h1>

        <p className="mt-10 text-center text-sm leading-7 font-medium text-white sm:text-base md:mt-16 md:text-left md:text-lg md:leading-8 lg:mt-24">
          Sebagai pusat keunggulan inovasi di ITS, <b>Departemen Teknologi Informasi (DTI)</b> memadukan{' '}
          <b>infrastruktur jaringan cerdas, integrasi sistem,</b> dan <b>keamanan siber</b>. Fokus utama kami adalah
          membangun fondasi teknologi yang tangguh dan terukur untuk menjawab tantangan era digital.
        </p>
        <p className="mt-6 text-center text-sm leading-7 font-medium text-white sm:text-base md:mt-8 md:text-left md:text-lg md:leading-8">
          Dari mengorkestrasi tata kelola sistem informasi hingga membangun pertahanan dari ancaman siber, mahasiswa DTI
          dibentuk menjadi <b>arsitek teknologi masa depan</b> yang mampu <b>memastikan</b> setiap ekosistem digital{' '}
          <b>beroperasi secara efisien dan aman.</b>
        </p>
      </div>
      <div className="relative mt-12 h-[280px] w-full md:mt-0 md:h-[560px] md:w-1/2 lg:h-[680px]">
        <Image
          src={Tower2}
          alt="tower 2"
          width={800}
          height={1000}
          className="absolute right-1/2 bottom-0 h-auto w-[360px] translate-x-1/2 object-contain sm:w-[460px] md:-right-20 md:bottom-auto md:w-[660px] md:translate-x-0 lg:-right-16 lg:w-[820px]"
          priority
        />
      </div>
    </section>
  )
}

export default AboutDti
