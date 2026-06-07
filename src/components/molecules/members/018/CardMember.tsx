'use client'

import React, { useState } from 'react'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'

import DiscordEffect from '@/assets/images/members/discord-effect.svg'

import MemberPopup from './MemberPopup'
import ProfileImage from './image.jpeg'

const CardMember = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <>
      {/*  JANGAN PERNAH UBAH STRUKTUR CARD MEMBER KARENA KODE INI AKAN DI-CRAWL OLEH SCRIPT UNTUK MENGAMBIL DATA MEMBER, UBAH DATA MEMBER YANG DIPERLUKAN SAJA. JANGAN JUGA UBAH STYLE CARD MEMBER KARENA STYLE YANG SAMA DIBUTUHKAN AGAR TAMPILAN WEBSITE KONSISTEN */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsPopupOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsPopupOpen(true)
          }
        }}
        className="relative z-10 h-auto w-72 cursor-pointer overflow-hidden rounded-2xl border-2 border-neutral-50 px-6 py-7 backdrop-blur-lg transition-transform hover:scale-[1.02]"
      >
        <Image
          src={DiscordEffect}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50 select-none"
        />
        <div className="bg-blue-cs-40/10 absolute inset-0 -z-10 select-none"></div>
        <div className="flex h-full w-full flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 px-1" onClick={(event) => event.stopPropagation()}>
              {/* UBAH USERNAME INSTAGRAM KAMU */}
              <Instagram username="nazwaadp" />
              {/* UBAH USERNAME LINKEDIN KAMU */}
              <LinkedInButtonLink username="nazwaauliadwipurnomo" />
            </div>
            <div className="w-full rounded-2xl">
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-50 w-full rounded-2xl object-cover object-center"
              />
            </div>
          </div>
          {/*  JANGAN PERNAH UBAH STRUKTUR CARD MEMBER KARENA KODE INI AKAN DI-CRAWL OLEH SCRIPT UNTUK MENGAMBIL DATA MEMBER, UBAH DATA MEMBER YANG DIPERLUKAN SAJA. JANGAN JUGA UBAH STYLE CARD MEMBER KARENA STYLE YANG SAMA DIBUTUHKAN AGAR TAMPILAN WEBSITE KONSISTEN */}
          <div className="bg-blue-cs-40 rounded-2xl border-2 border-neutral-50 px-3 py-4 text-sm font-extrabold text-neutral-100">
            {/* UBAH NAMA KAMU */}
            <p>Nazwa Aulia Dwi P</p>
            {/* UBAH NRP KAMU */}
            <p>5027251018</p>
            {/* UBAH ASAL KOTA KAMU */}
            <p>Lumajang</p>
          </div>
        </div>
      </div>
      <MemberPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  )
}

export default CardMember
