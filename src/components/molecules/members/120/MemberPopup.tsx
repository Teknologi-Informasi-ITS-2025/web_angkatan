'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

// ZetaGif buat backgroung
// Import file JPG dari folder yang sama
import CinemeowImg from './absolute_cinemeow.jpg'
import ProfileImage from './image.png'
// Import file GIF dari folder yang sama
import ZetaGif from './zeta.gif'

//CinemeowImg buat overay profile image di popup

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  // TAMBAHKAN STATE INI:
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      const resetTimer = setTimeout(() => {
        setIsFlipped(false) // Reset status saat popup ditutup
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

      {/* =========================================================
          KOTAK LUAR POPUP: Menentukan tinggi-lebar kartu & memotong ujung GIF
          (z-10 diubah ke relative, overflow-y-auto DIHAPUS dari sini)
         ========================================================= */}
      <div className="border-neutral-cs-10 relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-hidden rounded-2xl border-2 text-white shadow-xl">
        {/* BACKGROUND GIF: Sekarang pakai 'absolute', dia otomatis stay karena box luarnya tidak bisa di-scroll */}
        <Image
          src={ZetaGif}
          alt="Vestia Zeta Background"
          fill
          unoptimized
          className="pointer-events-none absolute inset-0 -z-10 object-cover object-center"
        />
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>
        {/* LAPISAN OVERLAY GELAP */}
        <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-[1px]" />
        {/* =========================================================
            KOTAK DALAM POPUP: Khusus menampung konten yang bisa di-scroll
            (Trik utama agar konten gerak tapi background di luar tetap diam)
           ========================================================= */}
        <div className="absolute inset-0 overflow-y-auto p-6 sm:p-8">
          {/* TOMBOL CLOSE POPUP */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
          >
            x
          </button>

          {/* CONTAINER FOTO PROFIL */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)} // Tambahkan fungsi untuk toggle flip saat foto diklik (buat bantu mobile user)
            className="border-neutral-cs-10/40 group relative z-10 mb-5 cursor-pointer overflow-hidden rounded-2xl border select-none"
          >
            {/* Foto profile asli */}
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            {/* Lapisan overlay dengan efek blur dan gambar Cinemeow */}
            <Image
              src={CinemeowImg}
              alt="Absolute Cinemeow Overlay"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className={`${isFlipped ? 'opacity-0' : 'opacity-100'} pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out group-hover:opacity-0`}
            />
          </div>

          <div className="relative z-10 pr-10">
            {/* NAMA */}
            <h2 className="font-sans text-2xl font-black tracking-wide">Rido Patra Yudhistira Edwin</h2>
            {/* NRP DAN ASAL */}
            <p className="text-neutral-cs-10/70 mt-1 font-mono text-sm font-semibold">5027251120 - Surabaya</p>
          </div>

          <div className="relative z-10 mt-5 flex gap-2">
            <Instagram username="bl4nk_06/" />
            <LinkedInButtonLink username="rido-patra-yudhistira-edwin-2a0697379" />
          </div>

          {/* GRIDS INFORMASI DENGAN EFEK GLASSMORPHISM */}
          <div className="relative z-10 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="border-neutral-cs-10/40 rounded-xl border bg-black/40 p-4 backdrop-blur-md">
              <p className="text-neutral-cs-10/60 font-mono text-xs tracking-wide uppercase">
                Site ɑ: 俺の趣味 (Hobiku):
              </p>
              <p className="mt-2 font-sans font-medium">
                Nonton Anime dan Donghua, Baca Manga, Manhwa, Manhua, dan Light Novel, Main Game; terutama game Gacha,
                Shooter, RPG, Anime, Sandbox, Menggambar, Mendengarkan Lagu; mostly lagu Jepang, Game, Anime
              </p>
            </div>
            <div className="border-neutral-cs-10/40 rounded-xl border bg-black/40 p-4 backdrop-blur-md">
              <p className="text-neutral-cs-10/60 font-mono text-xs tracking-wide uppercase">
                Site β: 俺の豆知識 (Fun Fact tentang aku):
              </p>
              <p className="mt-2 font-sans font-medium">
                Sudah main dan preregist banyak anime style RPG gacha game (Terlalu banyak sampe bisa jadi bahan yapping
                berjam-jam)
              </p>
            </div>
          </div>

          <div className="border-neutral-cs-10/40 relative z-10 mt-4 rounded-xl border bg-black/40 p-4 backdrop-blur-md">
            <p className="text-neutral-cs-10/60 font-mono text-xs font-bold tracking-wide uppercase">
              Site ζ: 俺が好きな曲 (Lagu kesukaanku):
            </p>
            <p className="my-2 font-sans text-sm font-semibold">&quot;You&apos;re Mine&quot; — Vestia Zeta</p>

            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3kK8euC9eUBRwZKpMsQsDZ?si=2337bb62b0bd4ada" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
