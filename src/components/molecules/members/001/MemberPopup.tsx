'use client'

import React, { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import BarcaLogo from './barca.svg'
import ProfileImage from './image.jpeg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const backgroundVideoSrc = new URL('./background.mp4', import.meta.url).href
const popupSoundSrc = new URL('./sound.mp3', import.meta.url).href

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

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

  useEffect(() => {
    if (!isOpen || !popupRef.current) {
      return
    }

    const itemAnimations = Array.from(popupRef.current.querySelectorAll<HTMLElement>('[data-popup-item]')).map(
      (item, index) =>
        item.animate(
          [
            { opacity: 0, transform: 'translateY(-32px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          {
            duration: 450,
            delay: 100 + index * 90,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both'
          }
        )
    )

    return () => {
      itemAnimations.forEach((animation) => animation.cancel())
    }
  }, [isOpen])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (!isOpen) {
      audio.pause()
      audio.currentTime = 0
      return
    }

    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [isOpen])

  const toggleMute = () => {
    const audio = audioRef.current
    const nextMuted = !isMuted

    if (audio) {
      audio.muted = nextMuted
    }

    setIsMuted(nextMuted)
  }

  const togglePlay = () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(() => {
        setIsPlaying(false)
      })
  }

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-[5dvh]">
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={backgroundVideoSrc} type="video/mp4" />
      </video>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top, rgba(165,0,68,0.18), transparent 26%), radial-gradient(circle at bottom right, rgba(0,77,152,0.18), transparent 24%), linear-gradient(180deg, rgba(8,10,18,0.66), rgba(8,10,18,0.84))',
          backdropFilter: 'blur(8px)'
        }}
      />

      <div
        ref={popupRef}
        className="relative z-10 max-h-[90dvh] w-full max-w-[860px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-[12px] border-[5px] border-white bg-[#04122d]/92 text-white shadow-[10px_10px_0_#ffffff,22px_22px_0_rgba(0,0,0,0.18)] backdrop-blur-sm"
      >
        <audio
          ref={audioRef}
          src={popupSoundSrc}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="relative -m-4 min-h-[calc(100%+2rem)] p-4 sm:-m-6 sm:min-h-[calc(100%+3rem)] sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(6,17,44,0.66)_0%,rgba(6,17,44,0.48)_28%,rgba(165,0,68,0.18)_55%,rgba(6,17,44,0.38)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(165,0,68,0.22)_0,rgba(165,0,68,0.22)_72px,rgba(0,77,152,0.24)_72px,rgba(0,77,152,0.24)_144px)] mix-blend-screen" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_22%)]" />

          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-12 w-12 items-center justify-center border-[4px] border-white bg-black text-2xl leading-none font-black text-white shadow-[4px_4px_0_#1a1a1a] transition-transform hover:translate-x-0.5 hover:-translate-y-0.5"
          >
            x
          </button>

          <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3 pr-16 sm:pr-20">
            <div
              data-popup-item
              className="flex items-center gap-3 border-[4px] border-white bg-[#08162f]/85 px-3 py-2 shadow-[6px_6px_0_#111827] backdrop-blur-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden border-[3px] border-white bg-[#f4c300] p-2 shadow-[4px_4px_0_rgba(0,0,0,0.22)]">
                <Image src={BarcaLogo} alt="Barcelona crest" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.34em] text-[#f8d34a] uppercase">Blaugrana</p>
                <p className="text-lg font-black text-white italic [text-shadow:3px_3px_0_#111827]">Culer Card</p>
              </div>
            </div>

            <div data-popup-item className="mr-16 flex flex-wrap items-center gap-2 sm:mr-20">
              <button
                type="button"
                onClick={togglePlay}
                className="border-[3px] border-white bg-[#004d98] px-3 py-2 text-sm font-black tracking-[0.18em] text-white uppercase shadow-[4px_4px_0_#111827] transition-transform hover:-translate-y-0.5"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="border-[3px] border-white bg-[#a50044] px-3 py-2 text-sm font-black tracking-[0.18em] text-white uppercase shadow-[4px_4px_0_#111827] transition-transform hover:-translate-y-0.5"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>
          </div>

          <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <div className="space-y-5">
              <div
                data-popup-item
                className="relative overflow-hidden border-[4px] border-white bg-[#0b1730]/90 shadow-[6px_6px_0_#111827] backdrop-blur-sm"
              >
                <div className="absolute top-0 left-0 z-10 flex h-12 w-12 items-center justify-center overflow-hidden border-r-[4px] border-b-[4px] border-white bg-[#edbb00] p-2 text-[#a50044] shadow-[4px_4px_0_rgba(0,0,0,0.16)]">
                  <Image src={BarcaLogo} alt="Barcelona crest" className="h-full w-full object-cover" />
                </div>
                <Image
                  src={ProfileImage}
                  alt="Profile Image"
                  className="h-96 w-full object-cover object-top sm:h-[460px]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(0,0,0,0.1)_58%,rgba(0,0,0,0.65)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-5 bg-[repeating-linear-gradient(90deg,#a50044_0,#a50044_18px,#004d98_18px,#004d98_36px)]" />
              </div>

              <div
                data-popup-item
                className="border-[4px] border-white bg-[#0b1730]/82 p-4 shadow-[6px_6px_0_#111827] backdrop-blur-sm"
              >
                <p className="text-xs font-black tracking-[0.34em] text-[#edbb00] uppercase">Connect</p>
                <div className="mt-4 flex gap-3">
                  {/* UBAH USERNAME INSTAGRAM */}
                  <div className="border-[3px] border-white bg-[#a50044] p-2 shadow-[4px_4px_0_rgba(0,0,0,0.22)]">
                    <Instagram username="evandrarf" />
                  </div>
                  {/* UBAH USERNAME LINKEDIN */}
                  <div className="border-[3px] border-white bg-[#004d98] p-2 shadow-[4px_4px_0_rgba(0,0,0,0.22)]">
                    <LinkedInButtonLink username="evandraraditya" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div
                data-popup-item
                className="border-[4px] border-white bg-[#1436c3]/86 p-5 text-white shadow-[6px_6px_0_#111827] backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black tracking-[0.38em] text-[#d9e6ff] uppercase">Blaugrana Mode</p>
                    {/* UBAH NAMA ANDA */}
                    <h2 className="mt-3 text-4xl leading-[0.95] font-black tracking-tight italic [text-shadow:4px_4px_0_#111827] sm:text-6xl">
                      Evandra Raditya Fauzan
                    </h2>
                  </div>
                  <div className="mt-1 hidden h-20 w-16 shrink-0 border-[3px] border-white bg-[#a50044] shadow-[4px_4px_0_rgba(0,0,0,0.18)] sm:block">
                    <div className="flex h-full flex-col">
                      <div className="flex-1 bg-[#a50044]" />
                      <div className="flex-1 bg-[#004d98]" />
                      <div className="flex-1 bg-[#a50044]" />
                      <div className="flex-1 bg-[#004d98]" />
                    </div>
                  </div>
                </div>
                {/* UBAH NRP DAN ASAL */}
                <p className="mt-4 inline-block border-[3px] border-white bg-[#0b1730] px-4 py-2 text-sm font-black text-[#edbb00] shadow-[4px_4px_0_rgba(0,0,0,0.2)] sm:text-base">
                  5027251001 - Semarang
                </p>
              </div>

              <div data-popup-item className="grid gap-4 sm:grid-cols-2">
                <div className="border-[4px] border-white bg-[#a50044]/88 p-4 shadow-[6px_6px_0_#111827] backdrop-blur-sm">
                  {/* UBAH HOBI KAMU */}
                  <p className="inline-block border-[3px] border-white bg-[#edbb00] px-3 py-1 text-xs font-black tracking-[0.28em] text-[#111827] uppercase">
                    Hobi
                  </p>
                  <p className="mt-4 text-xl leading-snug font-black text-white">Billiard</p>
                </div>
                <div className="border-[4px] border-white bg-[#004d98]/88 p-4 shadow-[6px_6px_0_#111827] backdrop-blur-sm">
                  {/* UBAH FUNFACT KAMU */}
                  <p className="inline-block border-[3px] border-white bg-[#edbb00] px-3 py-1 text-xs font-black tracking-[0.28em] text-[#111827] uppercase">
                    Fun Fact
                  </p>
                  <p className="mt-4 text-xl leading-snug font-black text-white">
                    Pembaik++, ramah tamah, nongkrong sampe pagi gas ayok!!
                  </p>
                </div>
              </div>

              <div
                data-popup-item
                className="relative overflow-hidden border-[4px] border-white bg-[#0b1730]/82 p-5 shadow-[6px_6px_0_#111827] backdrop-blur-sm"
              >
                <div className="absolute top-4 right-4 h-14 w-14 rounded-full border-[3px] border-white bg-[#edbb00]/95" />
                <div className="absolute top-7 right-7 h-8 w-8 rounded-full border-[3px] border-white bg-[#a50044]" />
                {/* UBAH LAGU FAVORIT KAMU */}
                <p className="inline-block border-[3px] border-white bg-[#004d98] px-3 py-1 text-xs font-black tracking-[0.28em] text-[#d9e6ff] uppercase">
                  Lagu Favorit
                </p>
                <p className="my-4 max-w-[80%] text-2xl leading-snug font-black text-white italic [text-shadow:3px_3px_0_#111827]">
                  There Is a Light That Never Goes Out
                </p>

                <div className="rounded-[6px] border-[3px] border-white bg-black/30 p-2 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                  {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0WQiDwKJclirSYG9v5tayI?si=5a7585513fba4926" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
