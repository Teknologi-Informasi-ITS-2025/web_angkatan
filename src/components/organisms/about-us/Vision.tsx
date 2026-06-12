import Image from 'next/image'

import Star from '@/components/atoms/icon/Star'

import cloudIcon from '@/assets/images/icon/cloud.svg'

const Vision = () => {
  return (
    <section className="relative flex w-full flex-col items-center px-4 py-16 text-center">
      <h2 className="font-rubikone relative z-10 mb-8 text-4xl text-white md:text-5xl">Our Vision</h2>

      <p className="relative z-10 mx-auto max-w-4xl text-base leading-relaxed text-white md:text-xl">
        Mewujudkan Teknologi Informasi ITS angkatan 2025 sebagai{' '}
        <span className="text-yellow-cs-20 font-bold">ruang</span> untuk{' '}
        <span className="text-yellow-cs-20 font-bold">berkembang bersama</span> melalui{' '}
        <span className="text-yellow-cs-20 font-bold">kolaborasi</span> serta penguatan{' '}
        <span className="text-yellow-cs-20 font-bold">karakter</span> dan{' '}
        <span className="text-yellow-cs-20 font-bold">kompetensi</span>
      </p>

      {/* Cloud & Star Decoration Positioned between Vision and Mission */}
      <div className="pointer-events-none absolute right-0 -bottom-[30%] z-0 translate-x-[15%] md:translate-x-[0%]">
        <div className="relative">
          <Image
            src={cloudIcon}
            alt="Cloud decoration"
            width={400}
            height={150}
            className="h-auto w-[280px] object-contain opacity-90 md:w-[400px]"
          />
          <div className="absolute top-[5%] right-[10%] -translate-y-1/2 transform">
            <Star className="h-12 w-12 animate-pulse md:h-20 md:w-20" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Vision
