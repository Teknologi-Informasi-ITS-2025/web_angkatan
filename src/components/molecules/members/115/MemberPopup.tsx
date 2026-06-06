'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

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

  return (
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-[#7f1d1d] bg-[#1a1111]/95 relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-2xl shadow-black/50 sm:max-h-[calc(100vh-10rem)] sm:p-8 backdrop-blur-xl">
        <div className="absolute -top-20 -right-20 -z-10 h-64 w-64 rounded-full bg-[#f97316] opacity-10 blur-[80px] pointer-events-none"></div>
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-[#f97316] hover:bg-[#f97316]/20 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none transition-colors"
        >
          x
        </button>

        <div className="relative mb-5">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#f97316]/30 to-transparent blur-md"></div>
          <div className="border-[#f97316]/40 relative overflow-hidden rounded-2xl border bg-[#1a1111]">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="bg-gradient-to-r from-[#f97316] to-[#fed7aa] bg-clip-text text-3xl font-black text-transparent drop-shadow-sm">Irsa Fairuza</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-stone-300/80 mt-1 text-sm font-semibold">5027251115 - Depok</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="irsaaf_" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="irsa-fairuza-299696379" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-[#f97316]/30 rounded-xl border p-4 bg-[#2a1a1a]/40 backdrop-blur-sm shadow-inner shadow-white/5 transition-all hover:bg-[#2a1a1a]/60">
            <p className="text-stone-400/80 text-xs tracking-wide uppercase font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span> Hobi
            </p>
            {/* UBAH HOBI KAMU */}
            <p className="mt-2 text-stone-100 font-medium">drakoran, denger musik, jalan kemana aja asal jalan</p>
          </div>
          <div className="border-[#f97316]/30 rounded-xl border p-4 bg-[#2a1a1a]/40 backdrop-blur-sm shadow-inner shadow-white/5 transition-all hover:bg-[#2a1a1a]/60">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-stone-400/80 text-xs tracking-wide uppercase font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fca5a5]"></span> Fun Fact
            </p>
            <p className="mt-2 text-stone-100 font-medium">suka dengerin cerita tapi besoknya bakal lupa</p>
          </div>
        </div>

        <div className="border-[#f97316]/30 mt-4 rounded-xl border p-4 bg-[#2a1a1a]/40 backdrop-blur-sm shadow-inner shadow-white/5">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-stone-400/80 text-xs font-bold tracking-wide uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Lagu Favorit
          </p>
          <p className="my-2 text-sm font-medium text-stone-100">someone like u</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-white/10">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6VMuD05WDxorQZJr5e9sDI?si=255c6aec9b0c45de" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberPopup
