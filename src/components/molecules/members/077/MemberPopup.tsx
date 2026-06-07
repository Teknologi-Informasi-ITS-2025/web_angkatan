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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#05050e]/90 px-4 py-8 backdrop-blur-md">
      {/* --- INJEKSI CUSTOM CSS UNTUK ANIMASI ABSTRAK --- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin-gradient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes float-slow { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(15px, -20px); } }
        @keyframes float-reverse { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-15px, 20px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.1; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px currentColor; } }
        @keyframes abstract-float-1 { 0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); } 50% { transform: translateY(-25px) rotate(15deg) scale(1.1); } }
        @keyframes abstract-float-2 { 0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); } 50% { transform: translateY(20px) translateX(15px) rotate(-20deg); } }
        @keyframes abstract-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes abstract-pulse-spin { 0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; } 50% { transform: scale(1.2) rotate(90deg); opacity: 1; } }
        .animate-spin-slow { animation: spin-gradient 5s linear infinite; }
        .animate-float-1 { animation: float-slow 7s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 9s ease-in-out infinite; }
        .glass-panel { background: linear-gradient(145deg, rgba(15, 15, 26, 0.9), rgba(10, 11, 20, 0.95)); box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); }
        .glass-bento { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .glass-bento:hover { transform: translateY(-4px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
      `
        }}
      />

      {/* Background Orbs Global */}
      <div className="animate-float-1 pointer-events-none fixed top-20 left-10 z-0 h-[300px] w-[300px] rounded-full bg-fuchsia-600/10 blur-[100px]"></div>
      <div className="animate-float-2 pointer-events-none fixed right-10 bottom-20 z-0 h-[250px] w-[250px] rounded-full bg-cyan-600/10 blur-[100px]"></div>

      <button type="button" aria-label="Close member detail" onClick={onClose} className="absolute inset-0 z-0" />

      {/* Wrapper Card Utama */}
      <div className="group animate-in fade-in zoom-in relative z-10 w-full max-w-[720px] duration-300">
        {/* ELEMEN ABSTRAK LUAR 1: Bintang Neon */}
        <svg
          className="pointer-events-none absolute -top-12 -right-8 z-20 h-16 w-16 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          style={{ animation: 'abstract-pulse-spin 6s ease-in-out infinite' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>

        {/* ELEMEN ABSTRAK LUAR 2: Plus/Cross */}
        <svg
          className="pointer-events-none absolute -top-6 -left-10 z-0 h-12 w-12 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
          style={{ animation: 'abstract-float-1 5s ease-in-out infinite' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        {/* ELEMEN ABSTRAK LUAR 3: Ring / Cincin 3D */}
        <svg
          className="pointer-events-none absolute -right-12 -bottom-8 z-20 h-20 w-20 text-purple-500/60 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          style={{ animation: 'abstract-float-2 7s ease-in-out infinite' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        >
          <circle cx="12" cy="12" r="9" strokeDasharray="4 4" />
          <circle cx="12" cy="12" r="5" />
        </svg>

        {/* Spinning Gradient Border */}
        <div className="absolute inset-0 z-10 overflow-hidden rounded-[28px]">
          <div className="animate-spin-slow absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#f472b6_0%,#a855f7_25%,#22d3ee_50%,#4ade80_75%,#f472b6_100%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>
        </div>

        {/* Inner Card Container */}
        <div className="glass-panel relative z-10 m-[2px] overflow-hidden rounded-[26px] p-6 text-white sm:p-8">
          {/* Partikel Twinkle di dalam Card */}
          <div
            className="pointer-events-none absolute top-[10%] left-[15%] h-1.5 w-1.5 rounded-full bg-pink-400"
            style={{ animation: 'twinkle 3s ease-in-out infinite' }}
          ></div>
          <div
            className="pointer-events-none absolute top-[25%] right-[20%] h-1 w-1 rounded-full bg-cyan-400"
            style={{ animation: 'twinkle 4s ease-in-out infinite 1s' }}
          ></div>
          <div
            className="pointer-events-none absolute bottom-[30%] left-[10%] h-1.5 w-1.5 rounded-full bg-purple-400"
            style={{ animation: 'twinkle 2.5s ease-in-out infinite 0.5s' }}
          ></div>

          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-6 right-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:rotate-90 hover:bg-white/10 hover:text-white"
          >
            x
          </button>

          {/* Profile Header Area */}
          <div className="relative z-10 mb-6 flex flex-col items-center gap-5 pt-2 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="group/avatar relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-purple-500/30 bg-[#0d0d1f] shadow-[0_0_20px_rgba(168,85,247,0.15)] sm:h-40 sm:w-40">
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
              />
            </div>

            <div className="flex-1 pb-1">
              {/* UBAH NAMA ANDA */}
              <h2 className="bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                Rifqi Dwi Muslim
              </h2>
              {/* UBAH NRP DAN ASAL */}
              <p className="mt-2 text-sm font-semibold tracking-wide text-cyan-400/90 sm:text-base">
                5027251077 - Prabumulih
              </p>
            </div>
          </div>

          <div className="relative z-10 mb-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <div className="transition-transform hover:-translate-y-1">
              {/* UBAH USERNAME INSTAGRAM */}
              <Instagram username="rifqidwm" />
            </div>
            <div className="transition-transform hover:-translate-y-1">
              {/* UBAH USERNAME LINKEDIN */}
              <LinkedInButtonLink username="rifqidwm" />
            </div>
          </div>

          {/* Separator Glow Line */}
          <div className="relative z-10 mb-6 h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent">
            <div className="absolute top-1/2 left-1/2 h-[2px] w-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/30 blur-[2px]"></div>
          </div>

          <div className="relative z-10 mb-4 grid gap-4 sm:grid-cols-2">
            <div className="glass-bento group/card relative overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-rose-500/10 blur-xl transition-colors group-hover/card:bg-rose-500/20"></div>
              {/* UBAH HOBI KAMU */}
              <p className="mb-2 text-[10px] font-bold tracking-widest text-rose-400 uppercase sm:text-xs">Hobi</p>
              <p className="text-sm leading-snug font-semibold text-white/90 sm:text-lg">
                Kadang membaca, nulis, desain🖍️
              </p>
            </div>

            <div className="glass-bento group/card relative overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-purple-500/10 blur-xl transition-colors group-hover/card:bg-purple-500/20"></div>
              {/* UBAH FUNFACT KAMU */}
              <p className="mb-2 text-[10px] font-bold tracking-widest text-purple-400 uppercase sm:text-xs">
                Fun Fact
              </p>
              <p className="text-sm leading-snug font-semibold text-white/90 sm:text-lg">
                Ga dengerin musik dan lagu kecuali diplay sama orang lain🔊{' '}
              </p>
            </div>
          </div>

          <div className="glass-bento group/spotify relative z-10 mt-4 overflow-hidden rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition-colors group-hover/spotify:bg-cyan-500/20"></div>

            <div className="mb-4">
              {/* UBAH LAGU FAVORIT KAMU */}
              <p className="mb-1 text-[10px] font-bold tracking-widest text-cyan-400 uppercase sm:text-xs">
                Lagu Favorit
              </p>
              <p className="text-sm font-semibold text-white/90 sm:text-base">Blinding Lights</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/5 shadow-inner">
              {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b" />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
