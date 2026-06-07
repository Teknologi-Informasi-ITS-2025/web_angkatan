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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        // Deepened the background blur and opacity
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Main Container - Added slate border, deep neutral background, and slate glow */}
      <div className="relative z-10 w-full max-w-[720px] max-h-[100dvh] overflow-y-auto rounded-2xl border border-slate-600/40 bg-neutral-950 p-6 sm:p-8 text-neutral-300 shadow-[0_0_40px_-10px_rgba(100,116,139,0.3)] animate-[member-popup-show_200ms_ease-out]">
        
        {/* Close Button - Terminal brackets style hover effect */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded border border-slate-700/50 text-neutral-500 hover:text-slate-300 hover:border-slate-500 hover:shadow-[0_0_10px_rgba(100,116,139,0.5)] transition-all text-xl leading-none focus:outline-none"
        >
          x
        </button>

        {/* Image Container - Added inner shadow to inset the image nicely */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-700/50 bg-neutral-900/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] p-2">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-contain rounded-xl" />
        </div>

        <div className="pr-10">
          {/* Slate blue text glow matching the shirt */}
          <h2 className="text-2xl font-black text-slate-100 drop-shadow-[0_0_8px_rgba(148,163,184,0.4)]">
            Muhammad Syihan Zhafiri
          </h2>
          {/* Emerald green glow matching the glasses reflection */}
          <p className="mt-1 text-sm font-semibold text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">
            5027251052 - Sidoarjo
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="hannngotrekt" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="getrektboy" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          {/* Hobi Card - Left bordered with Sky Blue */}
          <div className="rounded-xl border border-slate-700/50 bg-neutral-900/40 p-4 border-l-2 border-l-sky-500 shadow-[0_4px_20px_-5px_rgba(14,165,233,0.15)]">
            <p className="text-xs tracking-wide uppercase text-sky-400">Hobi</p>
            <p className="mt-2 text-slate-200">Main MLBB, ngoding, nerd shit</p>
          </div>
          
          {/* Fun Fact Card - Left bordered with Emerald Green */}
          <div className="rounded-xl border border-slate-700/50 bg-neutral-900/40 p-4 border-l-2 border-l-emerald-500 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.15)]">
            <p className="text-xs tracking-wide uppercase text-emerald-400">Fun Fact</p>
            <p className="mt-2 text-slate-200">pp 30km setiap kali ke kampus</p>
          </div>
        </div>

        {/* Lagu Favorit Card - Left bordered with Violet */}
        <div className="mt-4 rounded-xl border border-slate-700/50 bg-neutral-900/40 p-4 border-l-2 border-l-violet-500 shadow-[0_4px_20px_-5px_rgba(139,92,246,0.15)]">
          <p className="text-xs font-bold tracking-wide uppercase text-violet-400">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-slate-200">Multo</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4cBm8rv2B5BJWU2pDaHVbF?si=65722ce7b02c4907" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup