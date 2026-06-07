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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[100vh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 border-lime-400 bg-black bg-[linear-gradient(rgba(163,230,53,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.08)_1px,transparent_1px)] bg-[size:20px_20px] p-6 text-white shadow-[0_0_25px_rgba(163,230,53,0.4)] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-lime-400 text-xl leading-none text-lime-400 transition hover:bg-lime-400/10"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-lime-400">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black">
            <span className="text-lime-400">Dian</span> Hanna Simanjuntak
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">502725116 - Jakarta</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="the.antna" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="dianhannasm116" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-lime-400 bg-zinc-950 p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide text-lime-400 uppercase">Hobi</p>
            <p className="mt-2">Baca manhwa</p>
          </div>
          <div className="rounded-xl border border-lime-400 bg-zinc-950 p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide text-lime-400 uppercase">Fun Fact</p>
            <p className="mt-2">Ga suka susu</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-lime-400 bg-zinc-950 p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide text-lime-400 uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">annie.</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/57KdzjdxoBml2rx0rajGRg?si=c74bbba0d8054b0a" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
