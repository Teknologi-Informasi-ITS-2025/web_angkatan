'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './web.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const NOTES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si']
const SECRET_MELODY = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'Mi', 'Do']

const playSound = (note: string) => {
  const frequencies: { [key: string]: number } = {
    'Do': 261.63,
    'Re': 293.66,
    'Mi': 329.63,
    'Fa': 349.23,
    'Sol': 392.00,
    'La': 440.00,
    'Si': 493.88
  }

  const freq = frequencies[note]
  if (!freq) return

  const AudioContext = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContext) return
  
  const audioCtx = new AudioContext()
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  oscillator.type = 'triangle' 
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime)

  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1)

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.start()
  oscillator.stop(audioCtx.currentTime + 1)
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [playedNotes, setPlayedNotes] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false)
      setPlayedNotes([])
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const playNote = (note: string) => {
    playSound(note)

    const newPlayedNotes = [...playedNotes, note]
    setPlayedNotes(newPlayedNotes)

    const currentStep = newPlayedNotes.length - 1
    
    if (newPlayedNotes[currentStep] !== SECRET_MELODY[currentStep]) {
      setPlayedNotes([])
    } else if (newPlayedNotes.length === SECRET_MELODY.length) {
      setTimeout(() => setIsUnlocked(true), 400)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Kontainer Utama dengan background gambar luar angkasa */}
      <div 
        className={`relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] rounded-2xl border border-neutral-700 bg-[#07080e] p-6 text-white shadow-2xl sm:max-h-[calc(100vh-10rem)] sm:p-8 ${isUnlocked ? 'overflow-y-auto' : 'overflow-hidden'} bg-[url('/space-bg.jpg')] bg-cover bg-center`}
      >
        
        {!isUnlocked && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080911]/90 p-6 text-center backdrop-blur-xl transition-opacity duration-500">
            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xl leading-none text-white transition-colors hover:bg-white/10"
            >
              x
            </button>
            <h3 className="mb-2 text-3xl font-serif tracking-widest text-[#d5b98a] drop-shadow-sm">Crackling Box</h3>
            <p className="mb-8 text-sm font-light tracking-wide text-neutral-400">
              "The German Songs That Familiar in Ears" <br/> Play the melody to open my profile
            </p>
            
            <div className="w-full max-w-2xl border-y border-white/10 py-5">
              <div className="flex w-full items-center justify-between divide-x divide-white/10">
                {NOTES.map((note) => (
                  <div key={note} className="flex flex-1 justify-center px-1 sm:px-2">
                    <button
                      onClick={() => playNote(note)}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d5b98a]/60 bg-transparent text-lg font-serif italic text-[#d5b98a] transition-all hover:bg-[#d5b98a]/10 active:scale-95 active:bg-[#d5b98a]/20 sm:h-16 sm:w-16 sm:text-2xl"
                    >
                      {note}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              {SECRET_MELODY.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2.5 w-2.5 rounded-full border border-[#d5b98a]/50 transition-all duration-300 ${
                    i < playedNotes.length ? 'scale-125 bg-[#d5b98a]' : 'bg-transparent'
                  }`} 
                />
              ))}
            </div>

            <p className="mt-10 text-xs tracking-[0.2em] text-neutral-500 uppercase">
              Clue: Do - Re - Mi - Fa - Sol - Mi - Do
            </p>
          </div>
        )}

        {/* KONTEN PROFILE */}
      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-700 hover:bg-neutral-700/20 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-neutral-700">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          <h2 className="text-2xl font-black text-neutral-100">Pradipta Airlangga Ramadhan</h2>
          <p className="mt-1 text-sm font-semibold text-neutral-400">5027251118 - Jombang</p>
        </div>

        <div className="mt-5 flex gap-2">
          <Instagram username="airlangga_24.r" />
          <LinkedInButtonLink username="Pradipta Airlangga" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-4">
            <p className="text-xs tracking-wide text-neutral-400 uppercase">Hobi</p>
            <p className="mt-2 text-neutral-200">
              1. Baca sambil dengerin musik <br />
              2. Nonton film/anime <br />
              3. Main game
            </p>
          </div>
          <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-4">
              <p className="text-xs uppercase text-neutral-400">Fun Fact</p>
              <p className="mt-2 text-neutral-200">
                1. Tamat end game content game Reverse: 1999 <br />
                2. Udah punya mY kisah <br />
                3. Suka semua olahan
              </p>
            </div>
          </div>

        <div className="mt-4 rounded-xl border border-neutral-700 bg-neutral-800/50 p-4">
          <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-neutral-200">Liar</p>
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4MwVirVMyerMiHkFomOZay?si=N445j-l9T2KrBer8yreJRQ" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup