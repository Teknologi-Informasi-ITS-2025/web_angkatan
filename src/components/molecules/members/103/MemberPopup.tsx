'use client'

import React, { useEffect, useState } from 'react'

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

const lines = [
  'How many miles to Babylon?',
  'Three score miles and ten.',
  'Can I get there by candle-light?',
  'Yes, and back again ...',
  'If your heels are nimble and your toes are light,',
  'You may get there by candle-light.'
]

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

  const [showProfile, setShowProfile] = useState(false)

  const [currentLine, setCurrentLine] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [charIndex, setCharIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const resetTimer = setTimeout(() => {
      setShowProfile(false)
      setCurrentLine(0)
      setTypedText('')
      setDisplayedLines([])
      setCharIndex(0)
      setIsFinished(false)
    }, 0)

    return () => clearTimeout(resetTimer)
  }, [isOpen])

  useEffect(() => {
    if (showProfile) return

    if (currentLine >= lines.length) {
      const finishTimer = setTimeout(() => {
        setIsFinished(true)
      }, 0)

      return () => clearTimeout(finishTimer)
    }

    const currentText = lines[currentLine]

    if (charIndex < currentText.length) {
      const timer = setTimeout(() => {
        setTypedText(currentText.slice(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
      }, 35)

      return () => clearTimeout(timer)
    }

    const nextTimer = setTimeout(() => {
      setDisplayedLines((prev) => [...prev, currentText])

      setCurrentLine((prev) => prev + 1)
      setTypedText('')
      setCharIndex(0)
    }, 1200)

    return () => clearTimeout(nextTimer)
  }, [charIndex, currentLine, showProfile])

  const handleTextClick = () => {
    if (currentLine >= lines.length) return

    const fullText = lines[currentLine]

    if (typedText !== fullText) {
      setTypedText(fullText)
      setCharIndex(fullText.length)
    }
  }

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

      <div className="border-neutral-cs-10 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 bg-gradient-to-b from-[#0400FA] via-[#5B7CFF] to-[#FFD700] p-6 text-white shadow-[0_0_40px_rgba(255,215,0,0.4)] shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>
        {!showProfile ? (
          <div className="relative flex min-h-[700px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF8E8] to-[#FFF2D0] text-center">
            <div className="absolute top-8 left-8 text-7xl opacity-70">🕊️</div>

            <div className="absolute top-16 right-12 text-3xl text-[#D4AF37]">✦</div>

            <div className="absolute bottom-20 left-16 text-2xl text-[#D4AF37]">✦</div>

            <div className="absolute right-20 bottom-24 text-4xl text-[#D4AF37]">✦</div>

            <h1 className="mb-20 px-4 font-serif text-5xl text-[#D4AF37]">How Many Miles to Babylon?</h1>

            <div
              onClick={handleTextClick}
              className="min-h-[320px] max-w-2xl cursor-pointer px-8 text-center text-2xl leading-relaxed text-[#4A3521]"
            >
              {displayedLines.map((line, index) => (
                <p key={index} className="mb-4">
                  {line}
                </p>
              ))}

              {!isFinished && (
                <p className="mb-4">
                  {typedText}
                  <span className="animate-pulse text-[#D4AF37]">|</span>
                </p>
              )}
            </div>

            {isFinished && (
              <button
                onClick={() => setShowProfile(true)}
                className="mt-12 rounded-full border-2 border-[#D4AF37] bg-white px-8 py-3 font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-white"
              >
                Next →
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            </div>

            <div className="pr-10">
              {/* UBAH NAMA ANDA */}
              <h2 className="text-2xl font-black">Wahyu Yoga Wicaksono</h2>
              {/* UBAH NRP DAN ASAL */}
              <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251103 - Yogyakarta</p>
            </div>

            <div className="mt-5 flex gap-2">
              {/* UBAH USERNAME INSTAGRAM */}
              <Instagram username="wyog._a" />
              {/* UBAH USERNAME LINKEDIN */}
              <LinkedInButtonLink username="jkt48.erine" />
            </div>

            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              <div className="rounded-xl border border-white/40 bg-white/15 p-4 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-md">
                {/* UBAH HOBI KAMU */}
                <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
                <p className="mt-2">nyoba hal baru apapun itu.</p>
              </div>
              <div className="rounded-xl border border-white/40 bg-white/15 p-4 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-md">
                {/* UBAH FUNFACT KAMU */}
                <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
                <p className="mt-2">pingin banyak hal dicoba tapi gabisa bisa</p>
              </div>
            </div>

            <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
              {/* UBAH LAGU FAVORIT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
              <p className="my-2 text-sm font-semibold">Ripples Of Past Reverie</p>

              {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6efouvscdEILOB0bpJB8GM?si=212ee96d7623415b" />
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
