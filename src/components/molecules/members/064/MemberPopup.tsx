'use client'

import React, { useEffect, useState, useRef } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import BombImage from './csgo-bomb.png'
import ProfileImage from './image.png'

const SOUND_BEEP = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
const SOUND_BGM = 'https://files.catbox.moe/84g1mk.mp3'
const SOUND_PLANTED = 'https://files.catbox.moe/y3sabd.mp3'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const TARGET_CODE = '7355608'

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [inputCode, setInputCode] = useState('')
  const [isError, setIsError] = useState(false)

  const bgmRef = useRef<HTMLAudioElement | null>(null)

  const playClickSound = () => {
    const audio = new Audio(SOUND_BEEP)
    audio.volume = 0.4
    audio.play().catch((err) => console.log('Audio error:', err))
  }

  useEffect(() => {
    if (isOpen && !isUnlocked) {
      bgmRef.current = new Audio(SOUND_BGM)
      bgmRef.current.volume = 0.1
      bgmRef.current.loop = true

      bgmRef.current.play().catch((err) => console.log('BGM Autoplay blocked:', err))
    }

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause()
        bgmRef.current.currentTime = 0
      }
    }
  }, [isOpen, isUnlocked])

  useEffect(() => {
    if (!isOpen) {
      const resetTimer = setTimeout(() => {
        setIsUnlocked(false)
        setInputCode('')
        setIsError(false)
      }, 0)

      return () => clearTimeout(resetTimer)
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

  const handleDigitClick = (digit: string) => {
    if (inputCode.length >= TARGET_CODE.length || isUnlocked) return

    playClickSound()

    const newCode = inputCode + digit
    setInputCode(newCode)

    if (newCode.length === TARGET_CODE.length) {
      if (newCode === TARGET_CODE) {
        const plantedAudio = new Audio(SOUND_PLANTED)
        plantedAudio.volume = 0.5
        plantedAudio.play().catch((err) => console.log('Audio planted error:', err))

        setTimeout(() => {
          if (bgmRef.current) {
            bgmRef.current.pause()
          }
          setIsUnlocked(true)
        }, 2000)
      } else {
        setIsError(true)
        setTimeout(() => {
          setInputCode('')
          setIsError(false)
        }, 500)
      }
    }
  }

  const handleClear = () => {
    setInputCode('')
    setIsError(false)
  }

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      {/* BACKGROUND LUAR */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default"
      >
        <img
          src="https://files.catbox.moe/duq9ss.gif"
          alt="Outer Background"
          className="absolute inset-0 h-full w-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-black/55" />
      </button>

      {/* CONTAINER POPUP */}
      <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-500">
        {!isUnlocked ? (
          // Bomb Interface
          <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto p-8">
            <img
              src="https://files.catbox.moe/pi8xqr.gif"
              alt="Bomb Background"
              className="absolute inset-0 h-full w-full object-cover opacity-100"
            />
            <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-xs" />

            {/* BOMB IMAGE */}
            <div className="relative z-20 aspect-[470/700] w-[380px] drop-shadow-2xl sm:w-[450px]">
              <img
                src={BombImage.src}
                alt="CS:GO Bomb"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              />

              {/* OVERLAY: Inputs */}
              <div className="absolute top-[26.5%] left-[34.5%] flex h-[7.5%] w-[45%] items-center justify-center overflow-hidden">
                <span
                  className={`font-mono text-3xl font-black tracking-[0.2em] opacity-80 sm:text-4xl ${isError ? 'animate-pulse text-red-700' : 'text-neutral-900'}`}
                >
                  {inputCode}
                </span>
              </div>

              {/* OVERLAY: Keypad */}
              <div className="absolute top-[53.5%] left-[33.5%] grid h-[27%] w-[33%] grid-cols-3 grid-rows-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => (key === '*' || key === '#' ? handleClear() : handleDigitClick(key))}
                    className="h-full w-full rounded-sm transition-colors hover:bg-white/15 active:bg-black/30"
                    aria-label={`Digit ${key}`}
                  />
                ))}
              </div>
            </div>

            <p className="relative z-20 mt-8 font-mono text-xs tracking-[0.3em] text-white/50 uppercase">
              HINT: same bomb, same code, valve never changed it.
            </p>
            <p className="relative z-20 mt-2 font-mono text-xs tracking-[0.3em] text-white/50 uppercase">
              -- (7355608) --
            </p>
          </div>
        ) : (
          // Profile Interface
          <div className="relative h-full w-full animate-[member-popup-show_400ms_ease-out] overflow-hidden">
            <img
              src="https://files.catbox.moe/njk7f3.gif"
              alt="Inner Background"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-20 h-full overflow-y-auto p-6 text-white sm:p-8">
              <button
                type="button"
                aria-label="Close member detail"
                onClick={onClose}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/20"
              >
                ✕
              </button>

              <div className="mb-6 overflow-hidden rounded-2xl border border-white/20 shadow-lg transition-all duration-300 hover:border-white/50 hover:shadow-[0_0_30px_10px_rgba(255,255,255,0.15)]">
                <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
              </div>

              <div className="pr-10">
                <h2 className="text-3xl font-black tracking-tight text-white/95">I Made Tobby Anantha Adiwijaya</h2>
                <p className="mt-1 text-sm font-medium tracking-wide text-white/60">5027251064 - Mataram</p>
              </div>

              <div className="mt-5 flex gap-3">
                <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-2 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/15 transition-transform hover:scale-105 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <Instagram username="tobbyadiwijaya" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-2 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/15 transition-transform hover:scale-105 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <LinkedInButtonLink username="tobby-adiwijaya" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <p className="text-xs font-bold tracking-widest text-white/50 uppercase mb-3">Hobi</p>
                  <ul className="space-y-2 text-white/80 font-medium">
                    <li>• games (Battlefield, Counter-Strike)</li>
                    <li>• olahraga (running, cycling, hiking)</li>
                    <li>• music enthusiast</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <p className="text-xs font-bold tracking-widest text-white/50 uppercase mb-3">Fun Fact</p>
                  <p className="text-white/80 font-medium leading-relaxed">
                    idk but i share the same birthday with elon musk (lol) (#BlessPeopleBornInJune)
                  </p>
                </div>
              </div>
                              
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                <p className="text-xs font-bold tracking-widest text-white/50 uppercase mb-3">Lagu Favorit</p>
                <p className="mb-4 text-base font-semibold text-white/90">End of Beginning</p>
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3qhlB30KknSejmIvZZLjOD?si=a084a797da404a92" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
