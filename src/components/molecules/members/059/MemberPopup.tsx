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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-6">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_300ms_ease-out] overflow-y-auto rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-950 p-6 text-white shadow-[0_0_40px_rgba(59,130,246,0.35)] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/30 bg-white/10 text-xl leading-none backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-cyan-400/20"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-3xl border border-cyan-200/20 shadow-lg shadow-blue-500/20">
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-120 w-full object-cover object-center transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="pr-10">
          <h2 className="text-3xl font-black tracking-wide text-cyan-100">
            Salsabila Rafa Syafira
          </h2>

          <p className="mt-1 text-sm font-semibold text-blue-100/80">
            5027251059 - Mojokerto
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <Instagram username="rafaable" />
          <LinkedInButtonLink username="rafaable" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-2xl border border-cyan-200/20 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10">
            <p className="text-xs uppercase tracking-widest text-cyan-300">
              Hobi
            </p>

            <p className="mt-2 text-white">Lari, meditasi</p>
          </div>

          <div className="rounded-2xl border border-cyan-200/20 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10">
            <p className="text-xs uppercase tracking-widest text-cyan-300">
              Fun Fact
            </p>

            <p className="mt-2 text-white">
              Suka bgt nonton film sedih, lmk if u have one!
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-cyan-200/20 bg-white/5 p-4 backdrop-blur-sm">
          <p className="text-xs font-bold tracking-widest uppercase text-cyan-300">
            Lagu Favorit
          </p>

          <p className="my-2 text-sm font-semibold text-white">
            On The Ground by Rose
          </p>

          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2xgACMNtJ5YktyvOC83SPO?si=919ec17d0d654bd1" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup