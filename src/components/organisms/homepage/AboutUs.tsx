import Image from 'next/image'

import ScrollReveal from '@/components/atoms/animation/ScrollReveal'

import { getTextStrokeStyle } from '@/lib/textStroke'

import cloudIcon from '@/assets/images/icon/cloud-2.svg'

const AboutUs = () => {
  return (
    <section id="about-us" className="bg-blue-cs-40 text-neutral-cs-10 w-full overflow-x-clip">
      <div className="mx-auto flex w-full max-w-[1260px] flex-col items-center gap-8 px-6 py-16 text-center sm:px-10 lg:px-[90px] lg:py-[110px]">
        <div className="relative flex min-h-[104px] w-full items-start justify-center overflow-hidden pt-2 sm:min-h-0 sm:items-center sm:overflow-visible sm:pt-0">
          <Image
            src={cloudIcon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-[42px] right-[calc(50%+28px)] z-0 h-auto w-[38vw] max-w-[172px] min-w-[112px] scale-x-[-1] -rotate-12 sm:hidden"
          />
          <ScrollReveal direction="down" distance={18}>
            <h2
              className="font-rubikone text-blue-cs-30 relative z-10 text-[32px] leading-[40px] sm:text-[40px] sm:leading-[52px] lg:text-[56px] lg:leading-[70px]"
              style={getTextStrokeStyle({ color: '#ffffff', width: 2 })}
            >
              About Us
            </h2>
          </ScrollReveal>
          <Image
            src={cloudIcon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-[42px] left-[calc(50%+28px)] z-0 h-auto w-[38vw] max-w-[172px] min-w-[112px] rotate-12 sm:hidden"
          />
        </div>

        <ScrollReveal className="relative w-full max-w-[1040px] overflow-visible" delay={120} distance={34}>
          <Image
            src={cloudIcon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-[-50px] left-[-66px] z-20 hidden h-auto w-[260px] max-w-none scale-x-[-1] -rotate-6 sm:block lg:top-[-86px] lg:left-[-128px] lg:w-[450px]"
          />
          <Image
            src={cloudIcon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[-98px] bottom-[-34px] z-20 hidden h-auto w-[260px] max-w-none rotate-6 sm:block lg:right-[-128px] lg:bottom-[-68px] lg:w-[450px]"
          />

          <div className="border-blue-cs-20/60 to-blue-cs-30 relative w-full overflow-hidden rounded-[40px] border bg-gradient-to-b from-[#35569C] px-6 py-10 sm:px-10 sm:py-12 lg:px-[104px] lg:py-[70px]">
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                backgroundImage: "url('/assets/images/texture/noise-monotone.svg')",
                backgroundSize: '170px 170px',
                mixBlendMode: 'multiply',
                opacity: 0.5
              }}
              aria-hidden="true"
            />

            <p className="text-neutral-cs-10 relative z-10 text-base leading-7 font-semibold sm:text-lg sm:leading-8 lg:text-[20px] lg:leading-[33px]">
              <span className="text-yellow-cs-20">EVASTRA</span> merupakan nama angkatan Teknologi Informasi ITS 2025
              yang merepresentasikan semangat untuk berkembang bersama, menguatkan karakter, dan meningkatkan
              kompetensi.
              <span className="mt-6 block lg:mt-8">
                Terinspirasi dari pepatah Latin klasik, “<span className="text-yellow-cs-20">ad astra per aspera</span>”
                yang berarti, “melalui rintangan, menuju <span className="text-yellow-cs-20">bintang-bintang</span>”.
                Makna ini menggambarkan <span className="text-yellow-cs-20">EVASTRA</span> yang diharapkan menjadi
                angkatan yang mampu menghadapi rintangan dan menggapai impiannya.
              </span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default AboutUs
