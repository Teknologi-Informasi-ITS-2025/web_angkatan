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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      
      {/* AREA BACKDROP */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-default w-full h-full border-none transition-opacity"
      />

      {/* MODAL CONTAINER - DARK GLASSMORPHISM BACKGROUND */}
      <div className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl sm:p-8">
        
        {/* TOMBOL CLOSE */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl leading-none transition-all duration-300 hover:rotate-90 hover:bg-red-500 hover:text-white"
        >
          x
        </button>

        {/* IMAGE - DIKEMBALIKAN PERSIS SEPERTI ASLI */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 shadow-inner group">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        {/* NAMA & ASAL */}
        <div className="pr-10">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <span>👋</span> D&apos;Qhaizhar Ari Dhiaulhaq
          </h2>
          <p className="mt-1 text-sm font-semibold text-indigo-200 flex items-center gap-2">
            <span>📍</span> 5027251083 - Surabaya
          </p>
        </div>

        {}
        {/* SOSIAL MEDIA - IG & LINKEDIN DIBUNGKUS ANIMASI HOVER */}
        <div className="mt-5 flex gap-4">
          <div className="transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:drop-shadow-[0_10px_20px_rgba(225,48,108,0.4)]">
            <Instagram username="dqh_zzr" />
          </div>
          <div className="transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:drop-shadow-[0_10px_20px_rgba(10,102,194,0.4)]">
            <LinkedInButtonLink username="d-qhaizhar-ari-dhiaulhaq" />
          </div>
        </div>

        {}
        {/* GRID HOBI & FUN FACT */}
        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="group rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 transition-all duration-300 hover:bg-indigo-500/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <p className="text-xs tracking-wide text-indigo-300 uppercase flex items-center gap-2">
              <span className="text-lg transition-transform group-hover:scale-125">💻</span> Hobi
            </p>
            <p className="mt-2 text-base">Nge ijoin github</p>
          </div>
          
          <div className="group rounded-xl border border-pink-500/20 bg-pink-500/10 p-4 transition-all duration-300 hover:bg-pink-500/20 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <p className="text-xs tracking-wide text-pink-300 uppercase flex items-center gap-2">
              <span className="text-lg transition-transform group-hover:scale-125">✨</span> Fun Fact
            </p>
            <p className="mt-2 text-base">aslinya anak introvert</p>
          </div>
        </div>

        {}
        {/* LAGU FAVORIT & SPOTIFY - DIKEMBALIKAN PERSIS SEPERTI ASLI */}
        <div className="mt-4 group rounded-xl border border-green-500/20 bg-green-500/10 p-4 transition-all duration-300 hover:bg-green-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <p className="text-xs font-bold tracking-wide text-green-300 uppercase flex items-center gap-2">
            <span className="text-lg transition-transform group-hover:scale-125 group-hover:animate-bounce">🎧</span> Lagu Favorit
          </p>
          <p className="my-2 text-sm font-semibold text-white">一路生花 (Yī Lù Shēng Huā)</p>

          <div className="mt-2">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/17N3Oqo2rklHgAyR7J9H0S?si=1e3dea4c3e474490" />
          </div>
        </div>
        
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
