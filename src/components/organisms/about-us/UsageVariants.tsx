import Image, { type StaticImageData } from 'next/image'

import { cn } from '@/utils/cn'

import horizontalColored from '@/assets/images/about-us/horizontal-colored.svg'
import logoColored from '@/assets/images/about-us/logo-colored.svg'
import verticalColored from '@/assets/images/about-us/vertical-colored.svg'

type UsageVariantItem = {
  id: string
  label: string
  src: StaticImageData | string
  width: number
  height: number
  monochrome?: boolean
  cardClassName: string
  artFrameClassName: string
  imageClassName: string
}

const usageVariantItems: UsageVariantItem[] = [
  {
    id: 'logo-monochrome',
    label: 'Logo Monochrome',
    src: logoColored,
    width: 194,
    height: 221,
    monochrome: true,
    cardClassName: 'w-[260px] sm:w-[290px] lg:w-[310px]',
    artFrameClassName: 'min-h-[290px] sm:min-h-[320px] lg:min-h-[340px]',
    imageClassName: 'w-[148px] sm:w-[168px] lg:w-[182px]'
  },
  {
    id: 'logo-colored',
    label: 'Logo Colored',
    src: logoColored,
    width: 194,
    height: 221,
    cardClassName: 'w-[260px] sm:w-[290px] lg:w-[310px]',
    artFrameClassName: 'min-h-[290px] sm:min-h-[320px] lg:min-h-[340px]',
    imageClassName: 'w-[148px] sm:w-[168px] lg:w-[182px]'
  },
  {
    id: 'vertical-monochrome',
    label: 'Vertical Monochrome',
    src: verticalColored,
    width: 430,
    height: 320,
    monochrome: true,
    cardClassName: 'w-[300px] sm:w-[350px] lg:w-[390px]',
    artFrameClassName: 'min-h-[290px] sm:min-h-[320px] lg:min-h-[340px]',
    imageClassName: 'w-[210px] sm:w-[248px] lg:w-[278px]'
  },
  {
    id: 'vertical-colored',
    label: 'Vertical Colored',
    src: verticalColored,
    width: 430,
    height: 320,
    cardClassName: 'w-[300px] sm:w-[350px] lg:w-[390px]',
    artFrameClassName: 'min-h-[290px] sm:min-h-[320px] lg:min-h-[340px]',
    imageClassName: 'w-[210px] sm:w-[248px] lg:w-[278px]'
  },
  {
    id: 'horizontal-monochrome',
    label: 'Horizontal Monochrome',
    src: horizontalColored,
    width: 186,
    height: 46,
    monochrome: true,
    cardClassName: 'w-[350px] sm:w-[430px] lg:w-[500px]',
    artFrameClassName: 'min-h-[290px] sm:min-h-[320px] lg:min-h-[340px]',
    imageClassName: 'w-[220px] sm:w-[288px] lg:w-[350px]'
  },
  {
    id: 'horizontal-colored',
    label: 'Horizontal Colored',
    src: horizontalColored,
    width: 186,
    height: 46,
    cardClassName: 'w-[350px] sm:w-[430px] lg:w-[500px]',
    artFrameClassName: 'min-h-[290px] sm:min-h-[320px] lg:min-h-[340px]',
    imageClassName: 'w-[220px] sm:w-[288px] lg:w-[350px]'
  }
]

const monochromeFilter = 'grayscale(1) saturate(0) contrast(1.05) brightness(0.72)'

const UsageVariants = () => {
  return (
    <section
      id="usage-variants"
      className="relative flex w-full flex-col items-center gap-10 overflow-hidden px-0 py-18 text-center"
    >
      <h2 className="text-neutral-cs-00 font-rubikone mb-10 text-[28px] tracking-wide sm:text-[38px] md:text-[48px]">
        Usage and Variants
      </h2>

      <div className="relative w-full max-w-[1122px] overflow-hidden">
        <div className="usage-variants-marquee-track flex w-max">
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex shrink-0 gap-5 pr-5 sm:gap-6 sm:pr-6">
              {usageVariantItems.map((item) => (
                <article
                  key={`${copyIndex}-${item.id}`}
                  className={`bg-neutral-cs-00 flex shrink-0 flex-col rounded-[34px] px-5 pt-6 pb-7 shadow-[0_22px_60px_rgba(2,9,28,0.22)] sm:px-6 sm:pt-7 sm:pb-8 ${item.cardClassName}`}
                >
                  <div className={`flex items-center justify-center ${item.artFrameClassName}`}>
                    <Image
                      src={item.src}
                      alt={item.label}
                      width={item.width}
                      height={item.height}
                      className={`h-auto ${item.imageClassName}`}
                      style={item.monochrome ? { filter: monochromeFilter } : undefined}
                    />
                  </div>

                  <p
                    className={cn('text-base leading-tight font-semibold md:text-[20px]', {
                      'text-blue-cs-30': !item.monochrome,
                      'text-black': item.monochrome
                    })}
                  >
                    {item.label}
                  </p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UsageVariants
