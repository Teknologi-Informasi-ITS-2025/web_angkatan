'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useRef, useState } from 'react'

import { Cormorant_Garamond, Great_Vibes, Nunito, Silkscreen } from 'next/font/google'
import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import BackgroundImage from './background.jpg'
import ProfileImage from './image.jpg'
import IntroGif from './member-intro.gif'
import SleepingCatGif from './sleeping_cat_zzz_clean.gif'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const initialFont = Great_Vibes({
  subsets: ['latin'],
  weight: '400'
})

const pixelFont = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700']
})

const titleFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700']
})

const bodyFont = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800']
})

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [introPhase, setIntroPhase] = useState<'playing' | 'zooming' | 'done'>('playing')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setIntroPhase('playing')

    // GIF 7 detik, dimajuin 0.1 detik biar tidak sempat loop
    const zoomTimer = window.setTimeout(() => {
      setIntroPhase('zooming')
    }, 5900)

    const doneTimer = window.setTimeout(() => {
      setIntroPhase('done')
    }, 6900)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(zoomTimer)
      window.clearTimeout(doneTimer)
      document.body.style.overflow = ''

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || introPhase !== 'done') {
      return
    }

    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/audio/from-the-start.mp3')
    }

    const audio = audioRef.current
    audio.pause()
    audio.currentTime = 0
    audio.loop = false
    audio.muted = isMuted
    audio.volume = 1

    audio.play().catch(() => {
      // autoplay bisa diblokir browser
    })

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [isOpen, introPhase])

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.muted = isMuted
  }, [isMuted])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-3 py-3 sm:px-4 py-[5dvh] sm:py-8 ${bodyFont.className}`}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <style jsx global>{`
        @keyframes intro-gif-zoom {
          0% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }

          65% {
            opacity: 1;
            transform: scale(1.55);
            filter: blur(2px);
          }

          100% {
            opacity: 0;
            transform: scale(2.25);
            filter: blur(10px);
          }
        }

        @keyframes popup-reveal {
          0% {
            opacity: 0;
            transform: scale(0.76);
            filter: blur(16px);
          }

          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        @keyframes intro-glow-pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }

          50% {
            opacity: 0.95;
            transform: scale(1.09);
          }
        }

        @keyframes star-float {
          0%,
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.72;
          }

          50% {
            transform: translateY(-12px) scale(1.15) rotate(8deg);
            opacity: 1;
          }
        }

        @keyframes side-float-soft {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }

          50% {
            transform: translateY(-12px) rotate(5deg);
            opacity: 1;
          }
        }

        @keyframes glow-twinkle {
          0%,
          100% {
            opacity: 0.58;
            transform: scale(1) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.18) rotate(8deg);
          }
        }

        @keyframes ribbon-sway {
          0%,
          100% {
            transform: translateY(0) rotate(-8deg);
            opacity: 0.75;
          }

          50% {
            transform: translateY(-10px) rotate(8deg);
            opacity: 1;
          }
        }

        .member-popup-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .member-popup-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .member-popup-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 239, 179, 0.45);
          border-radius: 999px;
        }

        .member-popup-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 239, 179, 0.7);
        }
      `}</style>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md"
      />

      {introPhase !== 'done' ? (
        <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-95"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(3, 7, 18, 0.76), rgba(15, 39, 72, 0.72), rgba(3, 7, 18, 0.86)), url(${BackgroundImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          <div className="pointer-events-none absolute top-[14%] left-[8%] z-10 animate-[star-float_2700ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] sm:top-[16%] sm:left-[10%] sm:text-5xl">
            ✦
          </div>

          <div className="pointer-events-none absolute top-[18%] right-[8%] z-10 animate-[star-float_3300ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] sm:top-[20%] sm:right-[14%] sm:text-5xl">
            ☆
          </div>

          <div className="pointer-events-none absolute bottom-[18%] left-[12%] z-10 animate-[star-float_3000ms_ease-in-out_infinite] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] sm:left-[18%] sm:text-4xl">
            ୨ৎ
          </div>

          <div className="pointer-events-none absolute right-[14%] bottom-[16%] z-10 animate-[star-float_3600ms_ease-in-out_infinite] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] sm:right-[20%] sm:text-4xl">
            ❀
          </div>

          <div className="pointer-events-none absolute h-[280px] w-[280px] animate-[intro-glow-pulse_2800ms_ease-in-out_infinite] rounded-full bg-[#ffefb3]/20 blur-3xl sm:h-[420px] sm:w-[420px]" />

          <div
            className={`relative z-20 flex w-full max-w-[92vw] items-center justify-center overflow-visible rounded-[24px] bg-transparent sm:max-w-[720px] sm:rounded-[32px] ${
              introPhase === 'zooming' ? 'animate-[intro-gif-zoom_1000ms_cubic-bezier(0.16,1,0.3,1)_forwards]' : ''
            }`}
          >
            <Image
              src={IntroGif}
              alt="Member intro animation"
              unoptimized
              className="max-h-[70dvh] w-full object-contain drop-shadow-[0_0_38px_rgba(255,239,179,0.62)] sm:max-h-[80dvh] sm:drop-shadow-[0_0_50px_rgba(255,239,179,0.72)]"
            />
          </div>
        </div>
      ) : (
        <>
          {/* ORNAMEN KIRI DESKTOP - MENCAR */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[35] hidden w-[260px] lg:block">
            <div className="absolute top-[8%] left-8 animate-[side-float-soft_3600ms_ease-in-out_infinite] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)]">
              ✧
            </div>
            <div className="absolute top-[13%] left-28 animate-[glow-twinkle_2500ms_ease-in-out_infinite] text-5xl text-[#ffefb3] drop-shadow-[0_0_22px_rgba(255,239,179,0.95)]">
              ☆
            </div>
            <div className="absolute top-[24%] left-14 animate-[ribbon-sway_3300ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)]">
              ୨ৎ
            </div>
            <div className="absolute top-[34%] left-36 animate-[glow-twinkle_2800ms_ease-in-out_infinite] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)]">
              ✦
            </div>
            <div className="absolute top-[44%] left-6 animate-[side-float-soft_3400ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)]">
              ❀
            </div>
            <div className="absolute top-[55%] left-32 animate-[glow-twinkle_3000ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)]">
              🐾
            </div>
            <div className="absolute top-[66%] left-12 animate-[side-float-soft_3900ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)]">
              🐈
            </div>
            <div className="absolute top-[76%] left-40 animate-[ribbon-sway_3600ms_ease-in-out_infinite] text-5xl text-[#ffefb3] drop-shadow-[0_0_22px_rgba(255,239,179,0.95)]">
              ୨ৎ
            </div>
            <div className="absolute top-[88%] left-20 animate-[glow-twinkle_2600ms_ease-in-out_infinite] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)]">
              ✩
            </div>
          </div>

          {/* ORNAMEN KANAN DESKTOP - MENCAR */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[35] hidden w-[260px] lg:block">
            <div className="absolute top-[7%] right-12 animate-[glow-twinkle_2600ms_ease-in-out_infinite] text-5xl text-[#ffefb3] drop-shadow-[0_0_22px_rgba(255,239,179,0.95)]">
              ☆
            </div>
            <div className="absolute top-[16%] right-36 animate-[side-float-soft_3500ms_ease-in-out_infinite] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)]">
              ✦
            </div>
            <div className="absolute top-[27%] right-[4.5rem] animate-[ribbon-sway_3400ms_ease-in-out_infinite] text-5xl text-[#ffefb3] drop-shadow-[0_0_22px_rgba(255,239,179,0.95)]">
              ୨ৎ
            </div>
            <div className="absolute top-[38%] right-40 animate-[glow-twinkle_2900ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)]">
              ❀
            </div>
            <div className="absolute top-[50%] right-8 animate-[side-float-soft_4000ms_ease-in-out_infinite] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)]">
              ✧
            </div>
            <div className="absolute top-[60%] right-[8.5rem] animate-[glow-twinkle_2700ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)]">
              🐾
            </div>
            <div className="absolute top-[70%] right-14 animate-[side-float-soft_3800ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)]">
              🐱
            </div>
            <div className="absolute top-[82%] right-40 animate-[ribbon-sway_3600ms_ease-in-out_infinite] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)]">
              ୨ৎ
            </div>
            <div className="absolute top-[91%] right-10 animate-[glow-twinkle_3000ms_ease-in-out_infinite] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)]">
              ✩
            </div>
          </div>

          <div
            className="member-popup-scroll relative z-10 max-h-[90dvh] w-full max-w-[720px] animate-[popup-reveal_700ms_cubic-bezier(0.16,1,0.3,1)_forwards] overflow-y-auto overscroll-contain rounded-[24px] border border-[#ffefb3]/45 p-4 text-white shadow-[0_0_48px_rgba(255,239,179,0.28)] sm:rounded-[30px] sm:p-8 sm:shadow-[0_0_65px_rgba(255,239,179,0.34)]"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(13, 35, 64, 0.68), rgba(45, 79, 115, 0.52), rgba(4, 18, 37, 0.78)), url(${BackgroundImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              scrollbarWidth: 'thin',
              scrollbarColor: '#ffefb355 transparent'
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 rounded-[24px] bg-[radial-gradient(circle_at_18%_14%,rgba(255,239,179,0.18),transparent_25%),radial-gradient(circle_at_85%_35%,rgba(255,239,179,0.14),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(255,239,179,0.1),transparent_38%)] sm:rounded-[30px]" />

            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="absolute top-3 right-3 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-[#ffefb3]/75 bg-[#ffefb3]/12 text-xl leading-none text-[#ffefb3] shadow-[0_0_26px_rgba(255,239,179,0.5)] backdrop-blur-md transition hover:bg-[#ffefb3]/18 hover:shadow-[0_0_38px_rgba(255,239,179,0.85)] sm:top-4 sm:right-4 sm:h-11 sm:w-11 sm:text-2xl"
            >
              ×
            </button>

            <div className="relative z-10">
              <div className="relative mb-4 overflow-hidden rounded-[20px] border border-[#ffefb3]/45 bg-[rgba(91,133,182,0.16)] shadow-[0_0_30px_rgba(255,239,179,0.22)] backdrop-blur-md transition hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_42px_rgba(255,239,179,0.34)] sm:mb-5 sm:rounded-[24px] sm:shadow-[0_0_36px_rgba(255,239,179,0.26)] sm:hover:shadow-[0_0_48px_rgba(255,239,179,0.38)]">
                <Image
                  src={ProfileImage}
                  alt="Profile Image"
                  className="h-72 w-full object-cover object-center sm:h-120"
                />
              </div>

              <div className="relative overflow-visible rounded-[20px] border border-[#ffefb3]/40 bg-[rgba(91,133,182,0.16)] px-4 py-5 pr-8 shadow-[0_0_28px_rgba(255,239,179,0.22)] backdrop-blur-md transition hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_42px_rgba(255,239,179,0.34)] sm:rounded-[24px] sm:px-5 sm:py-5 sm:pr-10 sm:shadow-[0_0_32px_rgba(255,239,179,0.26)] sm:hover:shadow-[0_0_48px_rgba(255,239,179,0.38)]">
                <div className="pointer-events-none absolute -top-3 right-5 text-3xl text-[#ffefb3] drop-shadow-[0_0_14px_rgba(255,239,179,0.95)]">
                  ☆
                </div>

                <div className="pointer-events-none absolute -top-3 left-5 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                  ୨ৎ
                </div>

                {/* UBAH NAMA ANDA */}
                <h2 className="flex w-full flex-nowrap items-end gap-x-1 overflow-visible leading-none whitespace-nowrap text-[#fff5d0]">
                  <span className="flex min-w-0 shrink items-end overflow-visible">
                    <span
                      className={`${initialFont.className} shrink-0 text-[clamp(2rem,5.4vw,3.85rem)] leading-[0.78] text-[#fff5d0] drop-shadow-[0_0_26px_rgba(255,239,179,1)]`}
                    >
                      S
                    </span>

                    <span
                      className={`${pixelFont.className} ml-[-0.16rem] inline-block shrink text-[clamp(0.72rem,1.85vw,1.2rem)] tracking-[-0.04em] text-[#fff5d0] drop-shadow-[0_0_6px_rgba(255,239,179,0.45)] sm:ml-[-0.26rem]`}
                    >
                      A
                      <span className="relative inline-block text-[#fff5d0]">
                        HIRA
                        <span className="absolute -bottom-[5px] left-0 z-20 h-[2px] w-full rounded-full bg-[#ffefb3] shadow-[0_0_12px_rgba(255,239,179,1)]" />
                      </span>
                    </span>
                  </span>

                  <span className="flex min-w-0 shrink items-end overflow-visible">
                    <span
                      className={`${initialFont.className} shrink-0 text-[clamp(2rem,5.4vw,3.85rem)] leading-[0.78] text-[#fff5d0] drop-shadow-[0_0_26px_rgba(255,239,179,1)]`}
                    >
                      B
                    </span>

                    <span
                      className={`${pixelFont.className} ml-[-0.15rem] inline-block shrink text-[clamp(0.72rem,1.85vw,1.2rem)] tracking-[-0.04em] text-[#fff5d0] drop-shadow-[0_0_6px_rgba(255,239,179,0.45)] sm:ml-[-0.24rem]`}
                    >
                      ILQIS
                    </span>
                  </span>

                  <span className="flex min-w-0 shrink items-end overflow-visible">
                    <span
                      className={`${initialFont.className} shrink-0 text-[clamp(2rem,5.4vw,3.85rem)] leading-[0.78] text-[#fff5d0] drop-shadow-[0_0_26px_rgba(255,239,179,1)]`}
                    >
                      R
                    </span>

                    <span
                      className={`${pixelFont.className} ml-[-0.15rem] inline-block shrink text-[clamp(0.72rem,1.85vw,1.2rem)] tracking-[-0.04em] text-[#fff5d0] drop-shadow-[0_0_6px_rgba(255,239,179,0.45)] sm:ml-[-0.24rem]`}
                    >
                      IVADITO
                    </span>
                  </span>
                </h2>

                {/* UBAH NRP DAN ASAL */}
                <p className="mt-3 text-sm font-extrabold text-[#f8fafc]/92 sm:text-lg">5027251037 - Bekasi</p>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
                <div className="relative rounded-[18px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] px-4 py-3 shadow-[0_0_24px_rgba(255,239,179,0.18)] backdrop-blur-md transition hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_32px_rgba(255,239,179,0.28)]">
                  <div className="pointer-events-none absolute -top-3 left-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ୨ৎ
                  </div>
                  {/* UBAH USERNAME INSTAGRAM */}
                  <Instagram username="sahirabqs" />
                </div>

                <div className="relative rounded-[18px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] px-4 py-3 shadow-[0_0_24px_rgba(255,239,179,0.18)] backdrop-blur-md transition hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_32px_rgba(255,239,179,0.28)]">
                  <div className="pointer-events-none absolute -top-3 right-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ✦
                  </div>
                  {/* UBAH USERNAME LINKEDIN */}
                  <LinkedInButtonLink username="sahira-rivadito-211611379" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm font-semibold sm:mt-6 sm:grid-cols-2 sm:gap-4">
                <div className="relative flex min-h-[148px] flex-col items-center justify-center overflow-visible rounded-[20px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] p-4 shadow-[0_0_26px_rgba(255,239,179,0.18)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_36px_rgba(255,239,179,0.28)] sm:min-h-[168px] sm:rounded-[22px] sm:p-5">
                  <div className="pointer-events-none absolute -top-4 left-5 z-20 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ☆
                  </div>

                  <div className="pointer-events-none absolute -top-4 right-5 z-20 text-xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ✦
                  </div>

                  {/* UBAH HOBI KAMU */}
                  <p className="absolute top-4 left-4 z-10 text-xs font-extrabold tracking-[0.3em] text-[#ffefb3]/90 uppercase drop-shadow-[0_0_8px_rgba(255,239,179,0.65)] sm:top-5 sm:left-5">
                    Hobi
                  </p>

                  <div className="relative z-10 mt-5 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-[#ffefb3]/20 blur-2xl" />

                    <Image
                      src={SleepingCatGif}
                      alt="Sleeping cat"
                      unoptimized
                      className="relative z-10 h-20 w-20 object-contain drop-shadow-[0_0_22px_rgba(255,239,179,0.95)] sm:h-24 sm:w-24 sm:drop-shadow-[0_0_28px_rgba(255,239,179,1)]"
                    />
                  </div>
                </div>

                <div className="relative rounded-[20px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] p-4 shadow-[0_0_24px_rgba(255,239,179,0.18)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_34px_rgba(255,239,179,0.28)] sm:rounded-[22px] sm:p-5">
                  <div className="pointer-events-none absolute -top-3 right-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ୨ৎ
                  </div>

                  <div className="pointer-events-none absolute right-4 bottom-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ❀
                  </div>

                  {/* UBAH FUNFACT KAMU */}
                  <p className="text-xs font-extrabold tracking-[0.3em] text-[#ffefb3]/90 uppercase drop-shadow-[0_0_8px_rgba(255,239,179,0.65)]">
                    Fun Fact
                  </p>
                  <p className="mt-3 text-base leading-relaxed font-extrabold text-[#f8fafc] sm:text-lg">
                    hidup seputar kucing, biru, nonton, tidur /ᐠ - ˕ -マ
                  </p>
                </div>
              </div>

              <div className="relative mt-4 rounded-[20px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] p-4 shadow-[0_0_28px_rgba(255,239,179,0.2)] backdrop-blur-md transition hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_40px_rgba(255,239,179,0.3)] sm:rounded-[24px] sm:p-5 sm:shadow-[0_0_34px_rgba(255,239,179,0.22)] sm:hover:shadow-[0_0_44px_rgba(255,239,179,0.32)]">
                <div className="pointer-events-none absolute -top-3 right-5 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                  ❀
                </div>

                <div className="pointer-events-none absolute -top-3 left-5 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                  ୨ৎ
                </div>

                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="absolute top-4 right-4 z-20 flex h-10 min-w-[44px] items-center justify-center rounded-full border border-[#ffefb3]/65 bg-[#ffefb3]/10 px-3 text-sm font-extrabold text-[#fff5d0] shadow-[0_0_18px_rgba(255,239,179,0.28)] backdrop-blur-md transition hover:bg-[#ffefb3]/18 hover:shadow-[0_0_26px_rgba(255,239,179,0.4)]"
                  aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>

                {/* UBAH LAGU FAVORIT KAMU */}
                <p className="text-xs font-extrabold tracking-[0.3em] text-[#ffefb3]/90 uppercase drop-shadow-[0_0_8px_rgba(255,239,179,0.65)]">
                  Lagu Favorit
                </p>
                <p
                  className={`${titleFont.className} my-2 pr-14 text-[clamp(1.35rem,4.2vw,2.25rem)] leading-tight font-bold tracking-wide text-[#fff5d0] drop-shadow-[0_0_12px_rgba(255,239,179,0.9)] sm:leading-none`}
                >
                  apapun yg berunsur{' '}
                  <span className="inline-block text-[#fff0b3] drop-shadow-[0_0_14px_rgba(255,239,179,0.95)]">
                    Laufey/Reality Club
                  </span>{' '}
                  <span className="inline-block text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.9)]">౨ৎ</span>
                </p>

                <div className="rounded-[18px] border border-[#ffefb3]/18 bg-[#061a33]/72 p-2 shadow-[inset_0_0_24px_rgba(255,239,179,0.06)] sm:rounded-[20px] sm:p-3">
                  {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/43iIQbw5hx986dUEZbr3eN?si=95173f1123ab4b7a" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>,
    document.body
  )
}

export default MemberPopup