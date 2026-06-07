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
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-3xl border-4 p-6 text-white shadow-2xl sm:p-8 bg-gradient-to-b from-amber-900 via-yellow-900 to-amber-950 border-yellow-600" style={{
        boxShadow: '0 0 40px rgba(217, 119, 6, 0.6), inset 0 0 20px rgba(217, 119, 6, 0.2)',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(217, 119, 6, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217, 119, 6, 0.1) 0%, transparent 50%)'
      }}>
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border-2 text-xl leading-none font-bold border-yellow-500 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 transition-all"
        >
          ✕
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border-4 border-yellow-600 shadow-lg" style={{
          boxShadow: '0 0 20px rgba(217, 119, 6, 0.5), inset 0 0 10px rgba(217, 119, 6, 0.2)'
        }}>
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-3xl font-black text-yellow-300" style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(217, 119, 6, 0.5)'
          }}>Nazwa Aulia Dwi P</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-yellow-200/80">5027251018 - Lumajang</p>
        </div>

        <div className="mt-5 flex gap-3">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="rounded-full border-2 border-yellow-500 bg-yellow-600/10 p-2.5 hover:bg-yellow-600/20 transition-all">
            <Instagram username="nazwaadp" />
          </div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="rounded-full border-2 border-yellow-500 bg-yellow-600/10 p-2.5 hover:bg-yellow-600/20 transition-all">
            <LinkedInButtonLink username="nazwaauliadwipurnomo" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border-2 border-yellow-600 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 p-4" style={{
            boxShadow: '0 0 15px rgba(217, 119, 6, 0.3), inset 0 0 10px rgba(217, 119, 6, 0.1)'
          }}>
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide uppercase text-yellow-300 font-bold">◆ Hobi</p>
            <p className="mt-2 text-yellow-100">Olahraga :D</p>
          </div>
          <div className="rounded-xl border-2 border-yellow-600 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 p-4" style={{
            boxShadow: '0 0 15px rgba(217, 119, 6, 0.3), inset 0 0 10px rgba(217, 119, 6, 0.1)'
          }}>
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide uppercase text-yellow-300 font-bold">◆ Fun Fact</p>
            <p className="mt-2 text-yellow-100">Ga suka matcha, padahal udah pernah sebulan maksa buat suka matcha</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-yellow-600 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 p-4 mt-4" style={{
          boxShadow: '0 0 15px rgba(217, 119, 6, 0.3), inset 0 0 10px rgba(217, 119, 6, 0.1)'
        }}>
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase text-yellow-300">◆ Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-yellow-100">Linger</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0gEyKnHvgkrkBM6fbeHdwK?si=eEXcL632TS-trYtvudIzJQ&rowId=f5f16ce58e208385" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
