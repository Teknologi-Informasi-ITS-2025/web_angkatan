'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

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

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto  bg-[radial-gradient(circle_at_top,_rgba(243,216,255,0.14),_transparent_36%),linear-gradient(180deg,_rgba(10,6,18,0.55),_rgba(10,6,18,0.82))] px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-[#12081d]/70 backdrop-blur-md"
      />

      <div className="border border-[#d9b8ff]/35 bg-bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_34%),linear-gradient(145deg,_#3a215c_0%,_#27183f_48%,_#160f26_100%)] relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[28px] border-2 p-6 text-[#f7ecff] shadow-[0_24px_80px_rgba(56,18,92,0.55)] ring-1 ring-white/10 sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border border-[#e1c4ff]/40 bg-white/5 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-[#f6e9ff] transition hover:border-[#f2d9ff] hover:bg-white/15 hover:text-white"
        >
          x
        </button>

        <div className="border border-[#ebd7ff]/35 mb-5 overflow-hidden rounded-[24px] shadow-[0_12px_36px_rgba(26,9,44,0.35)]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black tracking-tight text-[#fff8ff]">Hendra Manudinata</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-[#e7cfff]/75 mt-1 text-sm font-semibold">5027251051 - Denpasar</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="manoedinata" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="manoedinata" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e8d0ff]/25 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
            {/* UBAH HOBI KAMU */}
            <p className="text-[#e8d0ff]/70 text-xs tracking-[0.28em] uppercase">Hobi</p>
            <p className="mt-2 leading-6 text-[#fff7ff]">baca novel Tere Liye, seru bgt</p>
          </div>
          <div className="rounded-2xl border border-[#e8d0ff]/25 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-[#e8d0ff]/70 text-xs tracking-[0.28em] uppercase">Fun Fact</p>
            <p className="mt-2 leading-6 text-[#fff7ff]">penghuni bengkel robotik kata orang mah</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#e8d0ff]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-[#e8d0ff]/70 text-xs font-bold tracking-[0.28em] uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-[#fff7ff]">Di Balik Pertanda</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3uLb3akDowAYWp5QbbKN0w?si=3b43b6440fe44366" />
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -top-10 right-4 z-[5] h-36 w-36 opacity-25 blur-[0.5px] sm:-top-12 sm:right-8 sm:h-44 sm:w-44">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_0_18px_rgba(235,207,255,0.35)]">
          <path d="M119.5 122.5C116 97 95 73 67 63c-19-7-37 2-38 21-1 22 17 41 40 49 15 5 32 4 50-11-4 10-4 19 0 30-18-15-35-16-50-11-23 8-41 27-40 49 1 19 19 28 38 21 28-10 49-34 52-59 3 25 24 49 52 59 19 7 37-2 38-21 1-22-17-41-40-49-15-5-32-4-50 11 4-11 4-20 0-30 18 15 35 16 50 11 23-8 41-27 40-49-1-19-19-28-38-21-28 10-49 34-52 59Z" fill="url(#butterflyGradient)" fillOpacity="0.9" />
          <path d="M119.5 122.5c-5 6-10 12-15 17" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M119.5 122.5c5 6 10 12 15 17" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="butterflyGradient" x1="54" y1="58" x2="186" y2="184" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f7d9ff" />
              <stop offset="0.5" stopColor="#c57dff" />
              <stop offset="1" stopColor="#7a3cff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute top-14 left-3 z-[5] h-24 w-24 -rotate-12 opacity-18 blur-[0.75px] sm:top-16 sm:left-8 sm:h-28 sm:w-28">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_0_14px_rgba(235,207,255,0.28)]">
          <path d="M119.5 122.5C116 97 95 73 67 63c-19-7-37 2-38 21-1 22 17 41 40 49 15 5 32 4 50-11-4 10-4 19 0 30-18-15-35-16-50-11-23 8-41 27-40 49 1 19 19 28 38 21 28-10 49-34 52-59 3 25 24 49 52 59 19 7 37-2 38-21 1-22-17-41-40-49-15-5-32-4-50 11 4-11 4-20 0-30 18 15 35 16 50 11 23-8 41-27 40-49-1-19-19-28-38-21-28 10-49 34-52 59Z" fill="rgba(247,217,255,0.78)" />
        </svg>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-2 z-[5] h-24 w-24 rotate-12 opacity-12 blur-[1px] sm:bottom-6 sm:left-6 sm:h-28 sm:w-28">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <path d="M119.5 122.5C116 97 95 73 67 63c-19-7-37 2-38 21-1 22 17 41 40 49 15 5 32 4 50-11-4 10-4 19 0 30-18-15-35-16-50-11-23 8-41 27-40 49 1 19 19 28 38 21 28-10 49-34 52-59 3 25 24 49 52 59 19 7 37-2 38-21 1-22-17-41-40-49-15-5-32-4-50 11 4-11 4-20 0-30 18 15 35 16 50 11 23-8 41-27 40-49-1-19-19-28-38-21-28 10-49 34-52 59Z" fill="rgba(247,217,255,0.8)" />
        </svg>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-10 right-2 z-[5] h-20 w-20 rotate-[18deg] opacity-14 blur-[1px] sm:bottom-12 sm:right-10 sm:h-24 sm:w-24">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <path d="M119.5 122.5C116 97 95 73 67 63c-19-7-37 2-38 21-1 22 17 41 40 49 15 5 32 4 50-11-4 10-4 19 0 30-18-15-35-16-50-11-23 8-41 27-40 49 1 19 19 28 38 21 28-10 49-34 52-59 3 25 24 49 52 59 19 7 37-2 38-21 1-22-17-41-40-49-15-5-32-4-50 11 4-11 4-20 0-30 18 15 35 16 50 11 23-8 41-27 40-49-1-19-19-28-38-21-28 10-49 34-52 59Z" fill="rgba(247,217,255,0.72)" />
        </svg>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
