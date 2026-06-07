'use client'

import React, { useEffect } from 'react'
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
  return (
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
<>
<style jsx>{`
  @keyframes floating {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  @keyframes snakeBorder {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
    @keyframes snakeMove {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
`}</style>

<div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">

  <button
    type="button"
    aria-label="Close member detail"
    onClick={onClose}
    className="absolute inset-0 bg-black/50 backdrop-blur-md"
  />

  <div
    className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] overflow-y-auto rounded-[38px] border-[3px] border-white bg-gradient-to-br from-[#ffe7f3] via-[#f9efff] to-[#eef5ff] p-6 shadow-[0_0_60px_rgba(255,192,203,.25)] sm:max-h-[calc(100vh-10rem)] sm:p-8"
    style={{
      animation: 'floating 5s ease-in-out infinite'
    }}
  >

    {/* CLOSE */}
    <button
      type="button"
      aria-label="Close member detail"
      onClick={onClose}
      className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#d7e8ff] text-xl font-bold text-[#355e9a]"
    >
      ×
    </button>

   {/* FOTO */}
<div
  className="relative mb-5 overflow-hidden rounded-[32px] p-[3px]"
  style={{
    boxShadow:
      '0 0 25px rgba(255,182,193,.45), 0 0 50px rgba(173,216,230,.35), 0 0 80px rgba(196,181,253,.25)'
  }}
>

  {/* SNAKE GLOW */}
  <div
    className="absolute -inset-[120%]"
    style={{
      background:
        'conic-gradient(transparent 0deg, transparent 220deg, #60a5fa 260deg, #8b5cf6 310deg, #60a5fa 360deg)',
      animation: 'snakeMove 6s linear infinite'
    }}
  />

  {/* FOTO */}
  <div className="relative overflow-hidden rounded-[30px] border-[4px] border-white bg-white">

    <Image
      src={ProfileImage}
      alt="Profile Image"
      className="h-120 w-full object-cover object-top"
    />

  </div>

</div>

    {/* NAMA */}
    <div className="pr-10">
      <h2
        className="text-4xl font-black"
  style={{
    background:
      'linear-gradient(90deg,#ff69b4,#ff9ac8,#ff69b4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 10px rgba(255,105,180,.45))'
  }}
      >
        Ferlin Erdina S
      </h2>

      <p className="mt-2 text-sm font-semibold text-[#7285a8]">
        5027251002  ✧  Sidoarjo
      </p>
    </div>

    {/* SOCIAL */}
    <div className="mt-5 flex gap-3">

      <div className="rounded-full border-[3px] border-white bg-[#d7e8ff] p-3 shadow-[0_0_20px_rgba(180,210,255,.5)]">
        <Instagram username="ferlinnerdn" />
      </div>

      <div className="rounded-full border-[3px] border-white bg-[#d7e8ff] p-3 shadow-[0_0_20px_rgba(180,210,255,.5)]">
        <LinkedInButtonLink username="FerlinErdina" />
      </div>

    </div>

    {/* HOBI + FUN FACT */}
    <div className="mt-6 grid gap-4 sm:grid-cols-2">

     <div className="relative overflow-hidden rounded-[30px] border-[3px] border-white bg-[#d7e8ff] p-6">

  <div
    className="absolute -inset-[120%]"
    style={{
      background:
        'conic-gradient(transparent 0deg, transparent 260deg, #60a5fa 290deg, #8b5cf6  330deg, #60a5fa 360deg)',
      animation: 'snakeMove 6s linear infinite'
    }}
  />

  <div className="absolute inset-[3px] rounded-[26px] bg-[#d7e8ff]" />

  <div className="relative z-10">
    <p className="text-xs font-black uppercase tracking-[0.35em] text-[#355e9a]">
      ✦ HOBI
    </p>

    <p className="mt-3 text-1xl font-black text-[#355e9a]">
      Melukis
    </p>
  </div>

</div>

      {/* FUN FACT */}
    <div className="relative overflow-hidden rounded-[30px] border-[3px] border-white bg-[#d7e8ff] p-6">

  <div
    className="absolute -inset-[120%]"
    style={{
      background:
          'conic-gradient(transparent 0deg, transparent 260deg, #60a5fa 290deg, #8b5cf6  330deg, #60a5fa 360deg)',
      animation: 'snakeMove 6s linear infinite'
    }}
  />

  <div className="absolute inset-[3px] rounded-[26px] bg-[#d7e8ff]" />

  <div className="relative z-10">
    <p className="text-xs font-black uppercase tracking-[0.35em] text-[#355e9a]">
      ✦ FUN FACT
    </p>

    <p className="mt-3 text-1xl font-black text-[#355e9a]">
      Top 1 gapernah makan sambal
    </p>
  </div>

</div>
</div>

    {/* SONG */}
   <div className="relative mt-5 overflow-hidden rounded-[32px] border-[3px] border-white bg-[#d7e8ff] p-6">

  <div
    className="absolute -inset-[120%]"
    style={{
      background:
          'conic-gradient(transparent 0deg, transparent 260deg, #60a5fa 290deg, #8b5cf6  330deg, #60a5fa 360deg)',
      animation: 'snakeMove 6s linear infinite'
    }}
  />

  <div className="absolute inset-[3px] rounded-[28px] bg-[#d7e8ff]" />

  <div className="relative z-10">

    <p className="text-xs font-black uppercase tracking-[0.35em] text-[#355e9a]">
      ✦ FAVORITE SONG
    </p>

    <p className="my-3 text-2xl font-black text-[#355e9a]">
      E85
    </p>

    <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3B4cjvGlPvyBLNG3AzEgkZ?si=28c25523329b4c0f" />

  </div>

</div>

    <div className="mt-6 text-center text-xl tracking-[0.5em] text-pink-400">
      ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
    </div>

  </div>

</div>
</>
)

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
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
          <h2 className="text-2xl font-black">Catherina Vallencia K</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251082 - Surakarta</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="jkt48.erine" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="jkt48.erine" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2">Nyanyi</p>
          </div>
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2">Gwe Member JKT</p>
          </div>
        </div>

        <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">There Is a Light That Never Goes Out</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2X62SjtuwVQiGiZvZZ9Ztr?si=f6718391848a4469" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
