'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#ff4fd8]/20 px-4 font-mono">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-[#101010]/70"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[760px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-none border-4 border-black bg-[#fff200] p-4 text-black shadow-[12px_12px_0_#000] sm:p-7">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-none border-4 border-black bg-[#ff3b30] text-2xl leading-none font-black text-white shadow-[5px_5px_0_#000] transition-transform hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000]"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-none border-4 border-black bg-white shadow-[8px_8px_0_#000]">
          <Image src={ProfileImage} alt="Profile Image" className="h-96 w-full object-cover object-top sm:h-120" />
        </div>

        <div className="border-4 border-black bg-white p-4 pr-14 shadow-[7px_7px_0_#000]">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-3xl leading-tight font-black tracking-normal sm:text-5xl">Evandra Raditya Fauzan</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-3 inline-block border-4 border-black bg-[#00e5ff] px-3 py-1 text-sm font-black sm:text-base">
            5027251001 - Semarang
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="border-4 border-black bg-black p-3 shadow-[5px_5px_0_#00e5ff] transition-transform hover:-translate-y-1">
            <Instagram username="evandrarf" />
          </div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="border-4 border-black bg-black p-3 shadow-[5px_5px_0_#ff4fd8] transition-transform hover:-translate-y-1">
            <LinkedInButtonLink username="evandraraditya" />
          </div>
        </div>

        <div className="mt-7 grid gap-5 text-sm font-black sm:grid-cols-2">
          <div className="rounded-none border-4 border-black bg-[#39ff14] p-4 shadow-[7px_7px_0_#000]">
            {/* UBAH HOBI KAMU */}
            <p className="inline-block border-4 border-black bg-white px-2 py-1 text-xs font-black tracking-normal uppercase">
              Hobi
            </p>
            <p className="mt-4 text-xl leading-snug">Billiard</p>
          </div>
          <div className="rounded-none border-4 border-black bg-[#ff4fd8] p-4 shadow-[7px_7px_0_#000]">
            {/* UBAH FUNFACT KAMU */}
            <p className="inline-block border-4 border-black bg-white px-2 py-1 text-xs font-black tracking-normal uppercase">
              Fun Fact
            </p>
            <p className="mt-4 text-xl leading-snug">Sering dikira buaya, padahal aslinya pembaik</p>
          </div>
        </div>

        <div className="mt-6 rounded-none border-4 border-black bg-white p-4 shadow-[7px_7px_0_#000]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="inline-block border-4 border-black bg-[#ff6b00] px-2 py-1 text-xs font-black tracking-normal uppercase">
            Lagu Favorit
          </p>
          <p className="my-4 text-lg leading-snug font-black">There Is a Light That Never Goes Out</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0WQiDwKJclirSYG9v5tayI?si=5a7585513fba4926" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
