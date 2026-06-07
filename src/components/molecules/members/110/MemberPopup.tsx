'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// helper supaya bisa pakai CSS custom property (--dash, --delay) di inline style tanpa error TypeScript
const cssVars = (vars: Record<string, string | number>) => vars as React.CSSProperties

// === Kumpulan doodle ala corat-coret Jinx (digambar sendiri pakai SVG, bukan ambil dari gambar) ===
const doodleShapes: Record<string, React.ReactNode> = {
  skull: (
    <g fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinejoin="round">
      <path d="M22 7c-9 0-13 7-11 15 .8 3 2 4 3 7h16c1-3 2.2-4 3-7 2-8-2-15-11-15Z" />
      <path d="M14 20l6 5M20 20l-6 5M30 20l-6 5M24 20l6 5M17 34v4M22 34v5M27 34v4" strokeLinecap="round" />
    </g>
  ),
  bolt: (
    <path
      d="M24 4 10 24h9l-5 14 18-22h-9l6-12Z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinejoin="round"
    />
  ),
  crown: (
    <path
      d="M8 30 6 12l8 8 8-12 8 12 8-8-2 18Z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinejoin="round"
    />
  ),
  star: (
    <path
      d="M22 5 27 18 41 18 30 26 34 39 22 31 10 39 14 26 3 18 17 18Z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinejoin="round"
    />
  ),
  heart: (
    <path
      d="M22 36C8 26 6 16 13 12c4-2 7 0 9 4 2-4 5-6 9-4 7 4 5 14-9 24Z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinejoin="round"
    />
  ),
  spiral: (
    <path
      d="M30 22a8 8 0 1 1-8-8 12 12 0 0 1 12 12 16 16 0 0 1-16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
    />
  ),
  bomb: (
    <g fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
      <circle cx={19} cy={27} r={12} />
      <path d="M28 17c2-4 6-6 9-4M33 8l2 4 4-1" />
    </g>
  ),
  fish: (
    <path
      d="M5 22 26 11v8h9l5-7 2 8-2 8-5-7h-9v8Z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinejoin="round"
    />
  ),
  cross: <path d="M10 10 34 34M34 10 10 34" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
}

type Sticker = {
  type: string
  top: string
  left: string
  rot: number
  size: number
  color: string
  delay: number
}

// posisi disebar ke seluruh layar; "text" = stiker tulisan, sisanya = doodle SVG
const STICKERS: Sticker[] = [
  { type: 'skull', top: '14%', left: '6%', rot: -16, size: 84, color: '#4ad7ff', delay: 0.0 },
  { type: 'bolt', top: '8%', left: '78%', rot: 12, size: 70, color: '#ffd23f', delay: 0.2 },
  { type: 'crown', top: '20%', left: '40%', rot: -6, size: 76, color: '#ff2e88', delay: 0.35 },
  { type: 'star', top: '6%', left: '30%', rot: 8, size: 58, color: '#b06bff', delay: 0.1 },
  { type: 'star', top: '74%', left: '84%', rot: -10, size: 64, color: '#4adf7a', delay: 0.6 },
  { type: 'heart', top: '60%', left: '4%', rot: 10, size: 70, color: '#ff4fa3', delay: 0.45 },
  { type: 'spiral', top: '40%', left: '88%', rot: 0, size: 78, color: '#4ad7ff', delay: 0.55 },
  { type: 'bomb', top: '78%', left: '52%', rot: -8, size: 86, color: '#b06bff', delay: 0.7 },
  { type: 'fish', top: '50%', left: '12%', rot: 14, size: 80, color: '#ff2e88', delay: 0.5 },
  { type: 'fish', top: '30%', left: '70%', rot: -18, size: 66, color: '#4adf7a', delay: 0.85 },
  { type: 'cross', top: '86%', left: '24%', rot: 6, size: 54, color: '#ffd23f', delay: 0.4 },
  { type: 'cross', top: '34%', left: '20%', rot: -12, size: 46, color: '#ff4fa3', delay: 0.9 },
  { type: 'bolt', top: '64%', left: '66%', rot: -20, size: 58, color: '#4ad7ff', delay: 0.3 },
  { type: 'text:HA HA!', top: '12%', left: '60%', rot: -8, size: 0, color: '#4ad7ff', delay: 0.25 },
  { type: 'text:BOOM', top: '82%', left: '68%', rot: 6, size: 0, color: '#ff4fa3', delay: 0.8 },
  { type: 'text:JINX', top: '46%', left: '46%', rot: -10, size: 0, color: '#ff2e88', delay: 0.15 },
  { type: 'text:POW!', top: '70%', left: '32%', rot: 12, size: 0, color: '#ffd23f', delay: 0.65 },
  { type: 'text:BIA BIA', top: '24%', left: '84%', rot: 14, size: 0, color: '#b06bff', delay: 0.95 }
]

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  // mengatur ledakan stiker yang tampil 5 detik saat popup dibuka
  const [showStickers, setShowStickers] = useState(false)

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

  // burst stiker: nyala saat dibuka, mati otomatis setelah 5 detik
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowStickers(isOpen)
    }, 0)

    if (!isOpen) {
      return () => clearTimeout(showTimer)
    }

    const hideTimer = setTimeout(() => setShowStickers(false), 5000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      {/* === Tema Jinx: keyframes + font marker ditaruh lokal di sini supaya self-contained (tidak perlu ngubah global CSS) === */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Gloria+Hallelujah&display=swap');

        @keyframes jinx-pop-in {
          0%   { transform: scale(.8) rotate(-3deg); opacity: 0; }
          55%  { transform: scale(1.04) rotate(1.6deg); opacity: 1; }
          100% { transform: scale(1) rotate(-.5deg); opacity: 1; }
        }
        @keyframes jinx-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes jinx-splat {
          0%   { transform: scale(0) rotate(-12deg); opacity: 0; }
          70%  { transform: scale(1.18) rotate(7deg); opacity: 1; }
          100% { transform: scale(1) rotate(5deg); opacity: 1; }
        }
        @keyframes jinx-sticker-in {
          0%   { transform: scale(0); opacity: 0; }
          65%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes jinx-layer-out {
          to { opacity: 0; }
        }

        .jinx-marker { font-family: 'Permanent Marker', 'Comic Sans MS', cursive; }
        .jinx-hand   { font-family: 'Gloria Hallelujah', 'Comic Sans MS', cursive; }

        /* tiap garis corat-coret di-"gambar" pakai stroke-dashoffset saat popup dibuka */
        .jinx-scribble > * {
          stroke-dasharray: var(--dash, 1200);
          stroke-dashoffset: var(--dash, 1200);
          animation: jinx-draw 850ms ease-out forwards;
          animation-delay: var(--delay, 150ms);
        }

        /* layer ledakan stiker: muncul, lalu seluruhnya memudar di detik ke-4.4 sampai hilang ~detik ke-5 */
        .jinx-sticker-layer { animation: jinx-layer-out 600ms ease 4400ms forwards; }
        .jinx-sticker        { animation: jinx-sticker-in 480ms cubic-bezier(.2,1.7,.4,1) both; }
      `}</style>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-[#080518]/80 backdrop-blur-sm"
      />

      <div
        className="jinx-hand relative z-10 max-h-screen w-full max-w-[720px] overflow-y-auto rounded-[20px] border-[3px] border-[#ff2e88] bg-[#150d36] p-6 text-white shadow-[0_0_45px_rgba(255,46,136,.4)] sm:p-8"
        style={{
          animation: 'jinx-pop-in 400ms cubic-bezier(.2,1.35,.45,1) both',
          backgroundImage:
            'radial-gradient(circle at 16% 10%, rgba(255,46,136,.22), transparent 42%), radial-gradient(circle at 88% 82%, rgba(74,215,255,.18), transparent 46%)'
        }}
      >
        {/* === Layer corat-coret: muncul ke-gambar saat dibuka. pointer-events-none supaya tidak menghalangi klik === */}
        <svg
          className="jinx-scribble pointer-events-none absolute inset-0 z-20 h-full w-full"
          viewBox="0 0 720 920"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* loop scribble pojok kiri atas */}
          <path
            d="M36 64 C 26 34, 96 26, 126 48 S 184 92, 142 112 S 56 122, 48 88"
            stroke="#4ad7ff"
            strokeWidth="4"
            strokeLinecap="round"
            style={cssVars({ '--dash': 620, '--delay': '120ms' })}
          />
          {/* petir zigzag ala Jinx kanan atas */}
          <polyline
            points="600,52 636,30 618,86 662,64 638,128"
            stroke="#ffd23f"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={cssVars({ '--dash': 420, '--delay': '260ms' })}
          />
          {/* silang corat-coret kiri bawah */}
          <path
            d="M70 800 L 130 858 M 130 800 L 70 858"
            stroke="#ff2e88"
            strokeWidth="6"
            strokeLinecap="round"
            style={cssVars({ '--dash': 320, '--delay': '440ms' })}
          />
          {/* hati doodle kanan bawah */}
          <path
            d="M600 800 c -22 -26, -58 4, -30 32 l 30 30 l 30 -30 c 28 -28, -8 -58, -30 -32 z"
            stroke="#ff4fa3"
            strokeWidth="4"
            strokeLinecap="round"
            style={cssVars({ '--dash': 360, '--delay': '520ms' })}
          />
          {/* garis bawah gelombang panjang */}
          <path
            d="M50 892 q 80 -28 160 0 t 160 0 t 160 0 t 130 0"
            stroke="#4ad7ff"
            strokeWidth="4"
            strokeLinecap="round"
            style={cssVars({ '--dash': 1100, '--delay': '300ms' })}
          />
        </svg>

        {/* === Stiker "JINX!" yang nge-splat saat dibuka === */}
        <div
          className="jinx-marker pointer-events-none absolute -top-4 left-8 z-30 text-4xl text-[#ff2e88] select-none"
          style={{
            animation: 'jinx-splat 520ms 240ms cubic-bezier(.2,1.7,.4,1) both',
            textShadow: '3px 3px 0 #4ad7ff'
          }}
        >
          JINX!
        </div>

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="jinx-marker absolute top-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#ff2e88] bg-[#150d36] text-xl leading-none text-[#ff2e88] transition-colors hover:bg-[#ff2e88] hover:text-white"
        >
          x
        </button>

        <div className="relative z-10 mb-5 overflow-hidden rounded-2xl border-2 border-[#4ad7ff]/60 shadow-[0_0_25px_rgba(74,215,255,.25)]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="relative z-30 pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="jinx-marker text-3xl text-[#ff4fa3]" style={{ textShadow: '2px 2px 0 #4ad7ff' }}>
            Bambang Nasarillah K
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold tracking-wide text-[#4ad7ff]">5027251110 - Sorowako</p>
        </div>

        <div className="relative z-30 mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="bam.nasr_" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="bambang-nasarillah-kurniawan-6b4a272b1" />
        </div>

        <div className="relative z-30 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border-2 border-dashed border-[#ff2e88]/70 bg-[#1d1248]/80 p-4">
            {/* UBAH HOBI KAMU */}
            <p className="jinx-marker text-xs tracking-wider text-[#4ad7ff] uppercase">Hobi</p>
            <p className="mt-2">Nyanyi, olahraga</p>
          </div>
          <div className="rounded-xl border-2 border-dashed border-[#4ad7ff]/70 bg-[#1d1248]/80 p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="jinx-marker text-xs tracking-wider text-[#ff4fa3] uppercase">Fun Fact</p>
            <p className="mt-2">Minum kopi ngantukkk</p>
          </div>
        </div>

        <div className="relative z-30 mt-4 rounded-xl border-2 border-dashed border-[#ffd23f]/70 bg-[#1d1248]/80 p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="jinx-marker text-xs tracking-wider text-[#ffd23f] uppercase">Mulai</p>
          <p className="my-2 text-sm font-semibold">Semoga Sembuh</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7AQEea9KCrVkF5NdC3MLeN?si=1d78c4886d6248c0" />
        </div>
      </div>

      {/* === LEDAKAN STIKER: muncul saat dibuka, hilang otomatis setelah 5 detik. pointer-events-none supaya popup tetap bisa diklik === */}
      {showStickers && (
        <div className="jinx-sticker-layer pointer-events-none fixed inset-0 z-[60] select-none">
          {STICKERS.map((s, i) => {
            const isText = s.type.startsWith('text:')

            return (
              <div
                key={i}
                className="jinx-sticker absolute"
                style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
              >
                <div style={{ transform: `rotate(${s.rot}deg)` }}>
                  {isText ? (
                    <span
                      className="jinx-marker block text-3xl sm:text-4xl"
                      style={{ color: s.color, textShadow: '2px 2px 0 rgba(0,0,0,.6)' }}
                    >
                      {s.type.slice(5)}
                    </span>
                  ) : (
                    <svg
                      width={s.size}
                      height={s.size}
                      viewBox="0 0 44 44"
                      style={{ color: s.color, filter: 'drop-shadow(0 0 6px currentColor)' }}
                    >
                      {doodleShapes[s.type]}
                    </svg>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>,
    document.body
  )
}

export default MemberPopup
