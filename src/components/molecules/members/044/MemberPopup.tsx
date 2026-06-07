'use client'

import React, { useEffect } from 'react'

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
    <>
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
          >
            x
          </button>

          <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="main-name text-2xl font-black">Arrumanta Ekna Luhkinasih</h2>
            {/* UBAH NRP DAN ASAL */}
            <p className="text-neutral-cs-10/70 sub-details mt-1 text-sm font-semibold">5027251044 - Solo</p>
          </div>

          <div className="mt-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="arrumantaa" />
            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="arrumanta" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              {/* UBAH HOBI KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">read you like a magazine ;)</p>
            </div>
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              {/* UBAH FUNFACT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Oh I&apos;m the FUN one, darling :p</p>
            </div>
          </div>

          <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold">Anugerah Terindah Yang Pernah Kumiliki</p>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/41OCQS2Mul3MluLUUsfadr?si=c721971a8b304f3a" />
          </div>
        </div>
      </div>
      <style jsx>{`
        div[class*='fixed'][class*='inset-0'] > button + div {
          background: linear-gradient(135deg, #ebe6e1 0%, #bdb5b1 100%);
          border: 1px solid #c78d96;
          border-radius: 12px;
          box-shadow:
            8px 8px 0px rgba(108, 73, 82, 0.15),
            inset 0 0 20px rgba(189, 181, 177, 0.5);
          color: #6c4952 !important;
          font-family: 'Cormorant Garamond', 'Lora', serif;
        }
        div[class*='fixed'][class*='inset-0'] > button + div h2,
        div[class*='fixed'][class*='inset-0'] > button + div p {
          font-family: 'Cormorant Garamond', 'Lora', serif !important;
        }
        div[class*='fixed'][class*='inset-0'] > button + div > div:nth-child(2) img {
          padding: 8px;
          background-color: #ebe6e1;
          border: 1px solid #bdb5b1;
          border-radius: 4px;
          box-shadow: 2px 4px 12px rgba(108, 73, 82, 0.2);
          filter: sepia(0.3) contrast(1.1) saturate(0.8) brightness(0.95);
        }

        div[class*='fixed'][class*='inset-0'] > button + div .pr-10 h2.main-name {
          color: #6c4952 !important;
          text-shadow: 2px 2px 4px rgba(108, 73, 82, 0.1);
          font-weight: 500;
          font-family: 'Cormorant Garamond', 'Lora', serif;
        }

        div[class*='fixed'][class*='inset-0'] > button + div .pr-10 p.sub-details {
          color: #c78d96 !important;
          font-style: italic;
          letter-spacing: 0.5px;
          font-family: 'Cormorant Garamond', 'Lora', serif;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-6 > div:nth-child(1),
        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-6 > div:nth-child(2) {
          background: linear-gradient(to bottom right, rgba(235, 230, 225, 0.9), rgba(199, 141, 150, 0.15));
          border: 1px solid #c78d96;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(199, 141, 150, 0.1);
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-6 > div > p:first-child {
          color: #6c4952 !important;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 0.78rem;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-6 > div > p:last-child {
          color: #6c4952 !important;
          font-weight: normal;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-4 {
          background: #6c4952;
          border: 3px double #bdb5b1;
          border-radius: 6px;
          color: #ebe6e1;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-4 p {
          color: #ebe6e1 !important;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-4 iframe {
          filter: sepia(0.4) opacity(0.9) contrast(1.1);
          border-radius: 4px !important;
          border: 1px solid #bdb5b1 !important;
        }
      `}</style>
    </>,
    document.body
  )
}

export default MemberPopup
