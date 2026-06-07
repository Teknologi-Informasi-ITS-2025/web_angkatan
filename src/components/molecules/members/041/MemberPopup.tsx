'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[760px] animate-[member-popup-show_250ms_ease-out] overflow-y-auto rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-6 text-white shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
        <div className="absolute -top-24 -left-20 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-52 w-52 rounded-full bg-purple-500/20 blur-3xl" />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-2xl font-light text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:rotate-90 hover:bg-red-500"
        >
          x
        </button>

        <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="w-full bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text object-cover object-center text-3xl font-extrabold text-transparent transition duration-500 hover:scale-105">
            Muhamad Sabilil Haq
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 w-full object-cover object-center text-sm font-semibold transition duration-500 hover:scale-95">
            5027251041 - Ciamis
          </p>
        </div>

        <div className="mt-5 flex gap-2 rounded-2xl transition duration-300 hover:-translate-y-1">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="sbillhq_" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="muhamad-sabilil-haq-110665379" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2">Maen game, tidur, jalan santai</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2">Alergi seafood, khususnya udang</p>
          </div>
        </div>

        <div className="border-neutral-cs-10/40 mt-4 rounded-2xl rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">&quot;We Are!&quot;</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1PdWDLJNk040dkuXoLLE2F?si=634305d2ac014320" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
