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

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button type="button" aria-label="Open YouTube" onClick={() => window.open('https://www.youtube.com/watch?v=Aq5WXmQQooo', '_blank')} className="absolute inset-0 cursor-pointer">
        <Image
          src="https://cdn.terminaltrove.com/m/a03290ca-6b48-4c34-9970-93174008e7c8.gif"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </button>

      <div
        className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 shadow-xl sm:p-8"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          background: 'linear-gradient(135deg, rgba(36, 39, 58, 0.85) 0%, rgba(30, 32, 48, 0.85) 100%)',
          borderColor: '#c6a0f6',
          color: '#cad3f5',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 30px rgba(198, 160, 246, 0.15), 0 8px 32px rgba(0,0,0,0.4)',
          animation: 'border-rainbow 6s ease-in-out infinite'
        }}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 text-lg leading-none font-bold transition-all"
          style={{ borderColor: '#c6a0f6', color: '#c6a0f6', backgroundColor: 'rgba(36, 39, 58, 0.9)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c6a0f6'
            e.currentTarget.style.color = '#24273a'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(36, 39, 58, 0.9)'
            e.currentTarget.style.color = '#c6a0f6'
          }}
        >
          ✕
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border-2" style={{ borderColor: '#c6a0f6' }}>
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black" style={{ color: '#c6a0f6' }}>
            Husam Danish
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold" style={{ color: '#a5adcb' }}>
            5027251060 - Buleleng
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="husam.danish" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="husam-danish" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div
            className="rounded-xl border p-4 transition-transform"
            style={{ borderColor: '#8bd5ca', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 213, 202, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide uppercase">Hobi</p>
            <ul className="mt-2 list-inside list-disc">
              <li>
                <a
                  href="https://www.reddit.com/r/unixporn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="highlight-link"
                  style={{ color: '#8bd5ca' }}
                >
                  <b>Ricing linux</b>
                </a>
              </li>
              <li>Baca (mostly novel & komik)</li>
              <li>Olahraga (jogging, cycling, basket)</li>
              <li>Main game (mostly MLBB, but sometimes random indie game)</li>
            </ul>
          </div>
          <div
            className="rounded-xl border p-4 transition-transform"
            style={{ borderColor: '#f5a97f', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 169, 127, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: '#f5a97f' }}>
              Fun Fact
            </p>
            <p className="mt-2">
              Sejauh ini bolak-balik surabaya-bali (mudik) selalu motoran
              <br></br>
              <br></br>I use{' '}
              <a
                href="https://wiki.archlinux.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="highlight-link"
                style={{ color: '#f5a97f' }}
              >
                <b>Arch</b>
              </a>{' '}
              BTW!
            </p>
          </div>
        </div>

        <div
          className="mt-4 rounded-xl border p-4 transition-transform"
          style={{ borderColor: '#c6a0f6', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(198, 160, 246, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase" style={{ color: '#c6a0f6' }}>
            Lagu Favorit
          </p>
          <p className="my-2 text-sm font-semibold">Laskar Pelangi</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0ejpHFKbEqTcNQ4OMBawrP?si=1a84201e2f18426f" />
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800');
.highlight-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 2px;
  text-decoration-color: inherit;
  transition: opacity 0.2s;
}
.highlight-link:hover {
  opacity: 0.7;
}
@keyframes border-rainbow {
  0% { border-color: #c6a0f6; }
  25% { border-color: #8bd5ca; }
  50% { border-color: #f5a97f; }
  75% { border-color: #eed49f; }
  100% { border-color: #c6a0f6; }
}`}</style>
    </div>,
    document.body
  )
}

export default MemberPopup
