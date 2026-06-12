import { defineMetadata, getMetadataBase } from '@/lib/metadata'

import AboutUs from '@/components/organisms/about-us/AboutUs'
import ColorPallete from '@/components/organisms/about-us/ColorPallete'
import Hero from '@/components/organisms/about-us/Hero'
import LogoPhilosophy from '@/components/organisms/about-us/LogoPhilosophy'
import Mission from '@/components/organisms/about-us/Mission'
import UsageVariants from '@/components/organisms/about-us/UsageVariants'
import Vision from '@/components/organisms/about-us/Vision'
import WhatWeMean from '@/components/organisms/about-us/WhatWeMean'

import memberBg from '@/assets/images/about-us/member-bg.svg'

export const metadata = defineMetadata({
  title: 'Tentang Kami - Evastra',
  description:
    'Pelajari lebih lanjut tentang Evastra, teknologi informasi ITS 2025. Temukan visi, misi, dan filosofi kami.',
  openGraph: {
    type: 'website',
    title: 'Tentang Kami - Evastra',
    description:
      'Pelajari lebih lanjut tentang Evastra, teknologi informasi ITS 2025. Temukan visi, misi, dan filosofi kami.',
    url: new URL('/about-us', getMetadataBase()).toString(),
    images: {
      url: new URL('/assets/images/metadata/og.webp', getMetadataBase()).toString(),
      width: 1200,
      height: 630,
      type: 'image/webp',
      alt: 'Tentang Kami - Evastra'
    }
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Kami - Evastra',
    description:
      'Pelajari lebih lanjut tentang Evastra, teknologi informasi ITS 2025. Temukan visi, misi, dan filosofi kami.',
    images: {
      url: new URL('/assets/images/metadata/og.webp ', getMetadataBase()).toString(),
      width: 1200,
      height: 630,
      type: 'image/webp',
      alt: 'Tentang Kami - Evastra'
    }
  }
})

export default function AboutUsPage() {
  return (
    <main className="bg-blue-cs-40 relative z-0 flex min-h-screen w-full flex-col overflow-hidden">
      <Hero />
      <div className="relative z-0 flex flex-col">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-repeat-y opacity-75"
          style={{
            backgroundImage: `url(${memberBg.src})`,
            backgroundPosition: 'top center',
            backgroundSize: '100% auto'
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(11,30,56,0.62)_0%,rgba(11,30,56,0.52)_22%,rgba(11,30,56,0.58)_100%)]"
          aria-hidden="true"
        />
        <div
          className="from-blue-cs-40 pointer-events-none absolute top-0 left-0 z-5 h-28 w-full bg-gradient-to-b via-[#0B1E38]/94 to-transparent sm:h-40 lg:h-56"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <AboutUs />
          <LogoPhilosophy />
          <UsageVariants />
          <ColorPallete />
          <Vision />
          <Mission />
          <WhatWeMean />
        </div>
      </div>
    </main>
  )
}
