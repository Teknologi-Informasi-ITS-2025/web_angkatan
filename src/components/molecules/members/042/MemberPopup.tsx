'use client'

import { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import TetrisGate from './TetrisGate'
import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [passed, setPassed] = useState(false)

  const handleClose = useCallback(() => {
    setPassed(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  if (!isOpen) {
    return null
  }

  if (!passed) {
    return createPortal(<TetrisGate onSuccess={() => setPassed(true)} />, document.body)
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="absolute inset-0 bg-[#050E1C]/80 backdrop-blur-sm"
      />

      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#1E3A5F] text-xl leading-none text-[#7EB8E8] hover:bg-[#1E3A5F]/30"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-[#1E3A5F]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black text-[#E8F4FF]">Nayla Arsha Adyuta - Acha</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-[#4A7FA8]">5027251042 - Tangerang</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="adyutaar" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="adyutaar" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-[#1E3A5F] bg-[#0D1F3A] p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide text-[#4A7FA8] uppercase">Hobi</p>
            <p className="mt-2 text-[#B8D8F0]">Turu 24/7</p>
          </div>
          <div className="rounded-xl border border-[#1E3A5F] bg-[#0D1F3A] p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide text-[#4A7FA8] uppercase">Fun Fact</p>
            <p className="mt-2 text-[#B8D8F0]">
              BHAAP APA YH, currently &quot;bhap-bhap&quot; hehe, cinta kopsus tetangga tuku, cinta kopsus kluarga
              famima, cinta caramel macchiato point, cinta bumi latte fore
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#1E3A5F] bg-[#0D1F3A] p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide text-[#4A7FA8] uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-[#E8F4FF]">Disillusioned</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1gUyF1kls2Q5MkuAi9djjx?si=ba0c1b7a9498419c" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
