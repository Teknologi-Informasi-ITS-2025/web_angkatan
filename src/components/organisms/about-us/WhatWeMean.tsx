'use client'

import Image from 'next/image'
import { type ReactNode, useState } from 'react'

import panahIcon from '@/assets/images/icon/panah.svg'

type MeaningItem = {
  id: string
  title: string
  content: ReactNode
}

const meaningItems: MeaningItem[] = [
  {
    id: 'ruang-berkembang',
    title: 'Ruang untuk Berkembang Bersama',
    content: (
      <>
        Teknologi Informasi ITS angkatan 2025 diharapkan menjadi{' '}
        <span className="text-yellow-cs-20 font-bold">ruang</span> yang aman dan suportif. Kami meyakini bahwa{' '}
        <span className="text-yellow-cs-20 font-bold">perkembangan</span> merupakan proses yang dijalani{' '}
        <span className="text-yellow-cs-20 font-bold">bersama</span>. Kemajuan satu individu mendorong kemajuan yang
        lain, bukan kompetisi yang saling menjatuhkan.
      </>
    )
  },
  {
    id: 'kolaborasi-karakter-kompetensi',
    title: 'Kolaborasi, Karakter, dan Kompetensi',
    content: (
      <>
        <span className="text-yellow-cs-20 font-bold">Perkembangan</span> diwujudkan melalui Soft-skill (
        <span className="text-yellow-cs-20 font-bold">Karakter</span>) dan Hard-skill (
        <span className="text-yellow-cs-20 font-bold">Kompetensi</span>).{' '}
        <span className="text-yellow-cs-20 font-bold">Kolaborasi</span> menjadi kunci keberhasilan dengan saling
        bersinergi, kelemahan satu orang dapat ditutupi oleh kelebihan orang lain, menciptakan kekuatan yang{' '}
        <span className="text-yellow-cs-20 font-bold">saling mendukung</span>.
      </>
    )
  },
  {
    id: 'dampak-positif',
    title: 'Dampak Positif bagi Departemen',
    content: (
      <>
        Teknologi Informasi ITS angkatan 2025 hadir bukan hanya untuk mengambil ilmu, tetapi juga untuk{' '}
        <span className="text-yellow-cs-20 font-bold">memberikan kembali</span> dan mengangkat{' '}
        <span className="text-yellow-cs-20 font-bold">nama baik</span> Departemen Teknologi Informasi.
      </>
    )
  }
]

const WhatWeMean = () => {
  const [openItemId, setOpenItemId] = useState<string>(meaningItems[0].id)

  return (
    <section
      id="what-we-mean"
      className="relative flex w-full flex-col items-center px-6 py-18 text-center sm:px-10 lg:px-[90px]"
    >
      <div className="w-full max-w-[1060px]">
        <h2 className="text-neutral-cs-00 font-rubikone mb-10 text-[28px] tracking-wide sm:text-[38px] md:text-[48px]">
          What We Mean
        </h2>

        <div className="flex flex-col gap-6 text-left">
          {meaningItems.map((item) => {
            const isOpen = openItemId === item.id

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-[22px] border-2 border-white bg-[rgba(8,26,54,0.24)] shadow-[0_18px_44px_rgba(3,10,27,0.16)] backdrop-blur-[2px]"
              >
                <button
                  type="button"
                  onClick={() => setOpenItemId(isOpen ? '' : item.id)}
                  className="grid w-full grid-cols-[32px_minmax(0,1fr)] items-center gap-x-4 px-6 py-5 text-left text-white transition-colors hover:bg-white/[0.03] sm:px-8 sm:py-6"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  >
                    <Image src={panahIcon} alt="" className="h-[22px] w-[22px]" />
                  </span>
                  <span className="text-[20px] leading-tight font-bold">{item.title}</span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-85'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 px-6 pb-6 sm:px-8 sm:pb-8">
                      <div aria-hidden="true" />
                      <div
                        className={`text-[20px] leading-[1.35] font-normal text-white ${
                          isOpen ? 'animate-[what-we-mean-reveal_320ms_ease-out]' : ''
                        }`}
                      >
                        {item.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhatWeMean
