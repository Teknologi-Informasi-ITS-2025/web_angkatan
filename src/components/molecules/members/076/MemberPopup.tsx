'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

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
        className="absolute inset-0 bg-black/80"
      />

      <div className="relative z-10 max-h-screen w-full max-w-[720px] overflow-y-auto rounded-2xl border-2 border-red-700 bg-black p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-red-600 text-red-400 hover:bg-red-900/30"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-red-700">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black text-red-500">Muhammad Hugo Rayandra E</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-red-200">5027251076 - Bandung</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="hugorayandra" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="www.linkedin.com/in/hugorayandra" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-red-700 bg-zinc-900 p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-red-400 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2">ngoding, makan</p>
          </div>
          <div className="rounded-xl border border-red-700 bg-zinc-900 p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-red-400 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2">gasuka semua seafood</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-red-700 bg-zinc-900 p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-red-400 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">Movie</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0kKrJbP4oATz98qQp2iXeC?si=101a3464ac3547b2" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
