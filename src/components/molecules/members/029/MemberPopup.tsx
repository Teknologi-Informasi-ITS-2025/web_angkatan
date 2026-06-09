'use client'
import React, { useEffect, useState, useCallback } from 'react'
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

const GRID = 3
const TOTAL = GRID * GRID
const SYMBOLS = ['★', '◆', '▲', '●', '◀', '▶', '▼', '■']

function isSolvable(arr: number[]) {
  let inv = 0
  const flat = arr.filter(x => x !== 0)
  for (let i = 0; i < flat.length - 1; i++)
    for (let j = i + 1; j < flat.length; j++)
      if (flat[i] > flat[j]) inv++
  return inv % 2 === 0
}

function createShuffled(): number[] {
  let arr: number[]
  do {
    arr = [...Array(TOTAL - 1).keys()].map(i => i + 1)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    arr.push(0)
  } while (!isSolvable(arr))
  return arr
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const init = useCallback(() => {
    setTiles(createShuffled())
    setMoves(0)
    setWon(false)
    setRevealed(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const frame = requestAnimationFrame(() => init())
    return () => cancelAnimationFrame(frame)
  }, [isOpen, init])

  useEffect(() => {
    if (!isOpen) return
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

  const tryMove = (idx: number) => {
    if (won) return
    const empty = tiles.indexOf(0)
    const row = Math.floor(idx / GRID), col = idx % GRID
    const erow = Math.floor(empty / GRID), ecol = empty % GRID
    if (Math.abs(row - erow) + Math.abs(col - ecol) !== 1) return
    const next = [...tiles]
    ;[next[idx], next[empty]] = [next[empty], next[idx]]
    setTiles(next)
    setMoves(m => m + 1)
    const solved = next.every((v, i) => (i === TOTAL - 1 ? v === 0 : v === i + 1))
    if (solved) setWon(true)
  }

  const correctCount = tiles.filter((v, i) => i < TOTAL - 1 && v === i + 1).length

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-[5dvh]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-[500px] animate-[member-popup-show_200ms_ease-out] overflow-hidden rounded-3xl shadow-2xl"
        style={{ background: '#0d1426', border: '1px solid #1a2540' }}
      >
        {/* Accent bar */}
        <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg,#22d3ee,#3b82f6,#8b5cf6)' }} />

        {/* Close button */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:text-white"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="h-4 w-4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!revealed ? (
          /* ─── PUZZLE SCREEN ─── */
          <div className="flex flex-col items-center gap-5 px-6 py-8">
            <div className="text-center">
              <h2 className="text-xl font-black text-white">Susun puzzle dulu!</h2>
              <p className="mt-1 text-sm" style={{ color: '#475569' }}>
                Urutkan simbol 1–8 untuk membuka profil
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black" style={{ color: '#38bdf8' }}>{moves}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Gerakan</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black" style={{ color: '#38bdf8' }}>{correctCount}/8</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>Benar</span>
              </div>
            </div>

            {/* Board */}
            <div
              className="grid grid-cols-3 gap-1.5 rounded-2xl p-2"
              style={{ width: 282, height: 282, background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b' }}
            >
              {tiles.map((val, idx) => {
                const isCorrect = val !== 0 && val === idx + 1
                const isEmpty = val === 0
                return (
                  <button
                    key={idx}
                    onClick={() => tryMove(idx)}
                    disabled={isEmpty || won}
                    className="relative flex flex-col items-center justify-center rounded-xl transition-all duration-150 active:scale-95"
                    style={{
                      width: 84, height: 84,
                      background: isEmpty ? 'transparent' : isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                      border: isEmpty ? 'none' : isCorrect ? '1px solid rgba(34,197,94,0.35)' : '1px solid #1e293b',
                      cursor: isEmpty ? 'default' : 'pointer',
                    }}
                  >
                    {!isEmpty && (
                      <>
                        <span
                          className="absolute top-1.5 left-2 text-[9px] font-bold"
                          style={{ color: isCorrect ? '#4ade80' : '#334155' }}
                        >{val}</span>
                        <span style={{ fontSize: 26, color: isCorrect ? '#4ade80' : '#475569' }}>
                          {SYMBOLS[val - 1]}
                        </span>
                      </>
                    )}
                  </button>
                )
              })}
            </div>

            <p className="text-xs text-center" style={{ color: '#334155' }}>
              Klik kepingan di sebelah ruang kosong untuk menggeser
            </p>

            {won ? (
              <div
                className="w-full flex flex-col items-center gap-3 rounded-2xl p-5 text-center"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <p className="text-lg font-black" style={{ color: '#4ade80' }}>Puzzle selesai!</p>
                <p className="text-sm" style={{ color: '#86efac' }}>Diselesaikan dalam {moves} gerakan</p>
                <button
                  onClick={() => setRevealed(true)}
                  className="px-7 py-2.5 rounded-full text-white text-sm font-bold transition-all active:scale-95 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}
                >
                  Buka profil
                </button>
              </div>
            ) : (
              <button
                onClick={init}
                className="px-6 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1e293b', color: '#64748b' }}
              >
                Acak ulang
              </button>
            )}
          </div>
        ) : (
          /* ─── PROFILE SCREEN ─── */
          <div className="max-h-[90dvh] overflow-y-auto">

            {/* Foto profil */}
            <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #1a2540' }}>
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-72 w-full object-cover object-center"
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0"
                style={{ height: 60, background: 'linear-gradient(to top,#0d1426,transparent)' }}
              />
            </div>

            {/* Info */}
            <div className="px-5 pt-5 pb-2">
              {/* UBAH NAMA ANDA */}
              <h2 className="text-xl font-black leading-tight" style={{ color: '#f1f5f9' }}>
                Muhammad Rifqi Fathurrahman
              </h2>
              {/* UBAH NRP DAN ASAL */}
              <p className="mt-1 text-sm font-semibold" style={{ color: '#475569' }}>
                5027251029 - Jombang
              </p>
              <div className="mt-4 flex gap-2">
                {/* UBAH USERNAME INSTAGRAM */}
                <Instagram username="fthur_rhn" />
                {/* UBAH USERNAME LINKEDIN */}
                <LinkedInButtonLink username="fthurrhn" />
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5 px-5 pt-4 pb-6">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl p-4" style={{ background: '#111827', border: '1px solid #1e293b' }}>
                  {/* UBAH HOBI KAMU */}
                  <p className="text-[10px] font-black uppercase tracking-[.18em] mb-2" style={{ color: '#2563eb' }}>Hobi</p>
                  <p className="text-sm font-bold" style={{ color: '#e2e8f0' }}>Olahraga</p>
                </div>
                <div className="rounded-2xl p-4" style={{ background: '#111827', border: '1px solid #1e293b' }}>
                  {/* UBAH FUNFACT KAMU */}
                  <p className="text-[10px] font-black uppercase tracking-[.18em] mb-2" style={{ color: '#2563eb' }}>Fun Fact</p>
                  <p className="text-sm font-bold" style={{ color: '#e2e8f0' }}>Baik banget ini orang</p>
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: '#111827', border: '1px solid #1e293b' }}>
                {/* UBAH LAGU FAVORIT KAMU */}
                <p className="text-[10px] font-black uppercase tracking-[.18em] mb-1" style={{ color: '#2563eb' }}>Lagu Favorit</p>
                <p className="mb-3 text-sm font-bold" style={{ color: '#e2e8f0' }}>The Color Violet</p>
                {/* UBAH URL SPOTIFY KAMU */}
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3azJifCSqg9fRij2yKIbWz?si=FKnkJcX3Sc-UdhA0K2tVag" />
              </div>

              <button
                onClick={() => { setRevealed(false); init() }}
                className="mt-1 w-full py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', color: '#334155' }}
              >
                ← Main puzzle lagi
              </button>
            </div>

          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
