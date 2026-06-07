'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-6">
  <button
    type="button"
    aria-label="Close member detail"
    onClick={onClose}
    className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-cyan-700/70 to-amber-500/40 backdrop-blur-md"
  />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[32px] border border-cyan-200/30 bg-gradient-to-b from-cyan-900/95 via-sky-800/95 to-blue-950/95 p-6 text-white shadow-[0_0_60px_rgba(34,211,238,0.25)] backdrop-blur-lg sm:p-8">
    <button
      type="button"
      aria-label="Close member detail"
      onClick={onClose}
      className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-500/10 text-cyan-100 text-xl leading-none transition-all hover:rotate-90 hover:bg-cyan-500/20"
    >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-[28px] border-2 border-cyan-200/20 shadow-xl">
      <Image
        src={ProfileImage}
        alt="Profile Image"
        className="h-120 w-full object-cover object-center"
      />
    </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="bg-gradient-to-r from-cyan-200 via-sky-100 to-amber-200 bg-clip-text text-3xl font-black text-transparent">
        Maitasya Rohmatul Ula
      </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-medium text-cyan-100/70">
        5027251026 - Tulungagung
      </p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="my_mayytl" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="Maitasya Rohmatul Ula" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
      <div className="rounded-2xl border border-cyan-200/20 bg-cyan-950/30 p-4 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-cyan-900/40">
         {/* UBAH HOBI KAMU */}
        <p className="text-xs uppercase tracking-widest text-amber-200">
          🌴 Hobi
        </p>
        <p className="mt-2 text-white">
          Mencoba hal baru
        </p>
      </div>
      {/* UBAH FUNFACT KAMU */}
       <div className="rounded-2xl border border-cyan-200/20 bg-cyan-950/30 p-4 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-cyan-900/40">
        <p className="text-xs uppercase tracking-widest text-amber-200">
          🏖️ Fun Fact
        </p>
        <p className="mt-2 text-white">
          mukaku ada di Hymne ITS dan kalau denger Hymne ITS pasti ngantuk
        </p>
      </div>
    </div>
       {/* UBAH LAGU FAVORIT KAMU */}
     <div className="mt-4 rounded-2xl border border-cyan-200/20 bg-cyan-950/30 p-4 backdrop-blur-md">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-200">
        🌊 Lagu Favorit
      </p>
          <p className="my-2 text-sm font-semibold text-white">
        Terima Kasih Sudah Bertahan
      </p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/playlist/5tHvHtdJFiIRR3uxewLq9P" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
