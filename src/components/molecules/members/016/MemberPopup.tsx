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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 font-sans selection:bg-white selection:text-black">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[640px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-100 shadow-2xl shadow-black/50 sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="text-md absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 leading-none text-neutral-400 transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
        >
          ✕
        </button>

        <div className="mb-6 overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900">
          <Image src={ProfileImage} alt="Profile Image" className="h-96 w-full object-cover object-[center_35%]" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-bold tracking-tight text-white">Annabel Clarissa</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1.5 font-mono text-xs tracking-widest text-neutral-400 uppercase">5027251016 • Surabaya</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="annabel_9936" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="annabelclarissa" />
        </div>

        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-4 transition-colors hover:border-neutral-700">
            {/* UBAH HOBI KAMU */}
            <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Hobi</p>
            <p className="mt-2 leading-relaxed font-medium text-neutral-300">
              Mendengarkan musik? menggambar? shodou? banyak sebenarnya
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-4 transition-colors hover:border-neutral-700">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Fun Fact</p>
            <p className="mt-2 leading-relaxed font-medium text-neutral-300">
              Susah menghapalkan orang lain (minim 6 bulan tapi harus sering ketemu TT)
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-4 transition-colors hover:border-neutral-700">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-neutral-200">Amanojaku</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0LgZadzsnpOYzCFD22FhqW?si=a43b923a93714c13" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
