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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <style>{`
        @keyframes joker-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px -5px rgba(153, 27, 27, 0.4), inset 0 0 10px rgba(153, 27, 27, 0.1);
            border-color: rgba(153, 27, 27, 0.5);
          }
          10% {
            box-shadow: 0 0 80px 15px rgba(220, 38, 38, 0.85), inset 0 0 30px rgba(220, 38, 38, 0.4);
            border-color: rgba(239, 68, 68, 1);
          }
        }
      `}</style>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-black/95 backdrop-blur-md"
      />

      <div className="group/main relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_400ms_ease-out] cursor-crosshair perspective-[2000px]">
        <div className="relative h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover/main:[transform:rotateY(180deg)]">
          <div className="absolute inset-0 flex h-full w-full [animation:joker-glow-pulse_2s_ease-in-out_infinite] flex-col items-center justify-center overflow-hidden border border-red-900/40 bg-neutral-950 shadow-2xl shadow-black/50 [backface-visibility:hidden]">
            <div className="absolute top-6 left-6 text-center font-serif text-4xl font-bold text-red-700/90 drop-shadow-[0_0_6px_rgba(153,27,27,0.5)]">
              D<br />
              <span className="text-4xl text-neutral-500">☠</span>
            </div>

            <div className="flex flex-col items-center gap-6 opacity-90">
              <span className="text-8xl text-red-800/60 drop-shadow-[0_0_20px_rgba(153,27,27,0.8)]">☠</span>

              <h1 className="ml-[0.5em] font-serif text-5xl font-black tracking-[0.5em] text-neutral-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
                DANGER
              </h1>
            </div>

            <div className="absolute right-6 bottom-6 rotate-180 text-center font-serif text-4xl font-bold text-red-800/90 drop-shadow-[0_0_6px_rgba(153,27,27,0.5)]">
              D<br />
              <span className="text-3xl text-neutral-600">☠</span>
            </div>
          </div>

          <div
            onMouseMove={handleMouseMove}
            className="absolute inset-0 flex h-full w-full [transform:rotateY(180deg)] flex-col overflow-y-auto border border-red-900/40 bg-neutral-950 p-8 text-neutral-200 shadow-[0_0_40px_-10px_rgba(153,27,27,0.2)] transition-all duration-700 [backface-visibility:hidden] group-hover/main:border-red-600/80 group-hover/main:shadow-[0_0_120px_10px_rgba(185,28,28,0.4)]"
          >
            <div
              className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-700 group-hover/main:opacity-100"
              style={{
                background:
                  'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(220,38,38,0.25), transparent 45%)'
              }}
            />

            <div className="absolute top-0 left-0 z-10 h-[2px] w-full bg-gradient-to-r from-transparent via-red-800 to-transparent opacity-40 transition-opacity duration-1000 group-hover/main:opacity-100"></div>

            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="absolute relative top-5 right-5 z-40 flex h-8 w-8 items-center justify-center text-2xl font-light text-neutral-600 opacity-30 transition-all duration-700 group-hover/main:opacity-100 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            >
              ×
            </button>

            <div className="relative z-10 flex-1">
              <div className="group/photo relative mb-8 overflow-hidden border-b border-red-900/50 pb-6">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90"></div>
                <Image
                  src={ProfileImage}
                  alt="Profile Image"
                  className="h-[28rem] w-full object-cover object-center grayscale transition-all duration-700 ease-in-out group-hover/photo:scale-[1.02] group-hover/photo:grayscale-0"
                />
              </div>

              <div className="mb-8">
                {/* UBAH NAMA ANDA */}
                <h2 className="font-serif text-4xl font-bold tracking-wider text-neutral-100 drop-shadow-[0_2px_10px_rgba(153,27,27,0.3)] transition-all duration-500 hover:text-white hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  Asfia Fahmisan
                </h2>
                {/* UBAH NRP DAN ASAL */}
                <p className="mt-2 font-mono text-xs tracking-[0.3em] text-red-700/90 uppercase">
                  ID: 5027251043 - Solo
                </p>
              </div>

              <div className="mb-8 flex gap-3">
                {/* UBAH USERNAME INSTAGRAM */}
                <Instagram username="fahmi_jaj292929" />
                {/* UBAH USERNAME LINKEDIN */}
                <LinkedInButtonLink username="asfia-fahmisan-438221281" />
              </div>

              <div className="mb-8 grid gap-6 sm:grid-cols-2">
                <div className="group/box relative overflow-hidden border-l-2 border-neutral-900 bg-neutral-950/40 p-5 backdrop-blur-sm transition-colors duration-500 hover:border-red-600">
                  {/* UBAH HOBI KAMU */}
                  <p className="relative z-10 font-serif text-xs font-bold tracking-[0.2em] text-transparent uppercase transition-all duration-500 group-hover/box:text-red-500 group-hover/box:[text-shadow:0_0_8px_rgba(220,38,38,0.8)]">
                    Hobi
                  </p>
                  <p className="relative z-10 mt-2 text-sm leading-relaxed text-transparent transition-all duration-700 group-hover/box:text-neutral-100 group-hover/box:[text-shadow:0_0_8px_rgba(255,255,255,0.4)]">
                    Membaca dan bermain FIFA
                  </p>
                </div>

                <div className="group/box relative overflow-hidden border-l-2 border-neutral-900 bg-neutral-950/40 p-5 backdrop-blur-sm transition-colors duration-500 hover:border-red-600">
                  {/* UBAH FUNFACT KAMU */}
                  <p className="relative z-10 font-serif text-xs font-bold tracking-[0.2em] text-transparent uppercase transition-all duration-500 group-hover/box:text-red-500 group-hover/box:[text-shadow:0_0_8px_rgba(220,38,38,0.8)]">
                    Fun Fact
                  </p>
                  <p className="relative z-10 mt-2 text-sm leading-relaxed text-transparent transition-all duration-700 group-hover/box:text-neutral-100 group-hover/box:[text-shadow:0_0_8px_rgba(255,255,255,0.4)]">
                    TK-ku 3 tahun :)
                  </p>
                </div>
              </div>

              <div className="group/box relative z-10 overflow-hidden border-l-2 border-neutral-900 bg-neutral-950/40 p-5 backdrop-blur-sm transition-colors duration-500 hover:border-red-600">
                {/* UBAH LAGU FAVORIT KAMU */}
                <p className="relative z-10 mb-3 font-serif text-xs font-bold tracking-[0.2em] text-transparent uppercase transition-all duration-500 group-hover/box:text-red-500 group-hover/box:[text-shadow:0_0_8px_rgba(220,38,38,0.8)]">
                  Lagu Favorit
                </p>
                <p className="relative z-10 mb-4 text-sm font-semibold tracking-wide text-transparent transition-all duration-700 group-hover/box:text-neutral-100 group-hover/box:[text-shadow:0_0_8px_rgba(255,255,255,0.4)]">
                  The Nights
                </p>

                {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
                <div className="relative z-10 opacity-0 transition-all duration-700 group-hover/box:opacity-100 group-hover/box:drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0ct6r3EGTcMLPtrXHDvVjc?si=0725cd1e18c94e2f" />
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
