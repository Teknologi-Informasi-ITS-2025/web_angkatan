'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react'
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
  const cardWrapperRef = useRef<HTMLDivElement>(null)
  const splashLayerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const lastSplashTime = useRef(0)
  const [nrpText, setNrpText] = useState('0000000000')
  const [isRevealed, setIsRevealed] = useState(false)

  const handleClose = useCallback(() => {
    setNrpText('0000000000')
    setIsRevealed(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  // Magnetic button handler
  const handleMagneticMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`
  }, [])

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px)'
  }, [])

  const spawnSplash = useCallback((x: number, y: number) => {
    const container = splashLayerRef.current
    if (!container) return

    const now = Date.now()
    if (now - lastSplashTime.current < 60) return
    lastSplashTime.current = now

    const colors = ['#55FFEA60', '#44ef6c60', '#55FFEA40', '#44ef6c40', '#88FFF050', '#55FFEA50']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = 8 + Math.random() * 18
    const rotation = Math.random() * 360

    const splash = document.createElement('div')
    splash.className = 'paint-splash'
    splash.style.left = `${x}px`
    splash.style.top = `${y}px`
    splash.style.width = `${size}px`
    splash.style.height = `${size}px`
    splash.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`

    const splatPaths = [
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 5C55 25 75 20 85 35C95 50 80 55 90 70C80 85 65 75 50 90C35 75 20 85 10 70C20 55 5 50 15 35C25 20 45 25 50 5Z" fill="${color}"/></svg>`,
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 0C60 30 70 15 95 30C75 45 100 55 80 75C65 60 55 80 40 95C45 70 15 75 5 55C25 50 0 30 25 20C35 35 40 10 50 0Z" fill="${color}"/></svg>`,
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="${color}"/><circle cx="25" cy="30" r="12" fill="${color}"/><circle cx="78" cy="35" r="10" fill="${color}"/><circle cx="30" cy="75" r="8" fill="${color}"/><circle cx="72" cy="70" r="14" fill="${color}"/></svg>`,
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="40" ry="30" fill="${color}"/><ellipse cx="20" cy="35" rx="15" ry="10" fill="${color}"/><ellipse cx="80" cy="65" rx="12" ry="8" fill="${color}"/></svg>`,
    ]
    splash.innerHTML = splatPaths[Math.floor(Math.random() * splatPaths.length)]

    container.appendChild(splash)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        splash.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1.5)`
        splash.style.opacity = '0'
      })
    })

    setTimeout(() => splash.remove(), 1300)
  }, [])

  // Cursor glow + image parallax
  useEffect(() => {
    if (!isOpen) return

    const wrapper = cardWrapperRef.current
    const card = cardRef.current
    if (!wrapper || !card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      spawnSplash(x, y)

      // 3D Card Tilt
      const cardCenterX = rect.width / 2
      const cardCenterY = rect.height / 2
      const rotateY = ((x - cardCenterX) / cardCenterX) * 1.5
      const rotateX = -((y - cardCenterY) / cardCenterY) * 1.5
      card.style.transition = 'transform 0.1s ease-out'
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(85, 255, 234, 0.15), transparent 40%)`
      }

      // Parallax image shift
      if (imageRef.current) {
        const moveX = ((x - cardCenterX) / cardCenterX) * 8
        const moveY = ((y - cardCenterY) / cardCenterY) * 8
        imageRef.current.style.transition = 'transform 0.15s ease-out'
        imageRef.current.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`
      }
    }

    const handleMouseLeave = () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
      if (glowRef.current) glowRef.current.style.background = 'none'

      if (imageRef.current) {
        imageRef.current.style.transition = 'transform 0.8s ease-out'
        imageRef.current.style.transform = 'scale(1) translate(0, 0)'
      }
    }

    wrapper.addEventListener('mousemove', handleMouseMove)
    wrapper.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      wrapper.removeEventListener('mousemove', handleMouseMove)
      wrapper.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isOpen, spawnSplash])

  // NRP counter roll-up animation
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const target = '5027251101'
    let frame = 0
    const totalFrames = 20
    let interval: ReturnType<typeof setInterval> | undefined

    const startFrame = requestAnimationFrame(() => {
      setNrpText('0000000000')
      setIsRevealed(true)

      interval = setInterval(() => {
        frame++
        if (frame >= totalFrames) {
          setNrpText(target)

          if (interval) {
            clearInterval(interval)
          }

          return
        }
        const progress = frame / totalFrames
        const revealed = Math.floor(progress * target.length)
        let text = ''
        for (let i = 0; i < target.length; i++) {
          if (i < revealed) {
            text += target[i]
          } else {
            text += Math.floor(Math.random() * 10).toString()
          }
        }
        setNrpText(text)
      }, 50)
    })

    return () => {
      cancelAnimationFrame(startFrame)

      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div ref={cardWrapperRef} className="relative z-10 flex w-full max-w-[720px] justify-center animate-[member-popup-show_200ms_ease-out]" style={{ perspective: '2000px' }}>
        {/* Invisible backplate to catch mouse events even when the card rotates away from the cursor */}
        <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.001)' }} />
        <div
          ref={splashLayerRef}
          className="pointer-events-none absolute inset-0 z-[15] overflow-hidden rounded-2xl"
          aria-hidden="true"
        />

        <div ref={cardRef} className="border-neutral-cs-10 bg-blue-cs-40 member-popup-font card-breathe card-tilt relative z-10 w-full max-h-[100dvh] overflow-y-auto overflow-x-hidden rounded-2xl border-2 p-6 text-white sm:p-8">
          {/* Cursor glow overlay */}
          <div ref={glowRef} className="pointer-events-none absolute inset-0 z-0 rounded-2xl" />

          <div className="hover-gradient-icon-circle absolute top-4 right-4 z-20 inline-flex magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
            <button
              type="button"
              aria-label="Close member detail"
              onClick={handleClose}
              className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
            >
              x
            </button>
          </div>

          <div className={`border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '0ms' }}>
            <div ref={imageRef} className={`image-zoom-wrapper ${isRevealed ? 'zoomed' : ''}`}>
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            </div>
          </div>

          <div className={`pr-10 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '100ms' }}>
            {/* UBAH NAMA ANDA */}
            <h2 className="text-2xl font-black member-name-font">
              <a href="https://saktisadhana.github.io/" target="_blank" rel="noopener noreferrer" className="hover-gradient-text hover:underline">
                Putu Putra <span className="gradient-text-eternal">Sakti</span> Sadhana
              </a>
            </h2>
            {/* UBAH NRP DAN ASAL */}
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Workbench&family=SUSE+Mono:wght@100..800&display=swap');
            .member-popup-font {
              font-family: 'SUSE Mono', monospace;
            }
            .member-name-font {
              font-family: 'Workbench', sans-serif;
            }
            @keyframes gradientCycle {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            .hover-gradient-text {
              transition: all 0.3s ease;
            }
            .hover-gradient-text:hover, .gradient-text-eternal {
              color: transparent !important;
              background-image: linear-gradient(to right, #55FFEA, #44ef8eff, #55FFEA);
              background-size: 200% auto;
              -webkit-background-clip: text;
              background-clip: text;
              animation: gradientCycle 3s linear infinite;
            }
            .hover-gradient-icon {
              position: relative;
              border-radius: 0.75rem;
              padding: 4px;
              transition: all 0.3s ease;
            }
            .hover-gradient-icon::before {
              content: '';
              position: absolute;
              inset: 0;
              pointer-events: none;
              border-radius: 0.75rem;
              padding: 2px;
              background: linear-gradient(to right, #55FFEA, #44ef6c, #55FFEA);
              background-size: 200% auto;
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .hover-gradient-icon:hover::before {
              opacity: 1;
              animation: gradientCycle 3s linear infinite;
            }
            .hover-gradient-icon:hover {
              filter: drop-shadow(0 0 6px #55FFEA80) drop-shadow(0 0 6px #44ef6c80);
            }
            .hover-gradient-icon-circle {
              border-radius: 9999px;
              padding: 4px;
              transition: all 0.3s ease;
            }
            .hover-gradient-icon-circle::before {
              content: '';
              position: absolute;
              inset: 0;
              pointer-events: none;
              border-radius: 9999px;
              padding: 2px;
              background: linear-gradient(to right, #55FFEA, #44ef6c, #55FFEA);
              background-size: 200% auto;
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .hover-gradient-icon-circle:hover::before {
              opacity: 1;
              animation: gradientCycle 3s linear infinite;
            }
            .hover-gradient-icon-circle:hover {
              filter: drop-shadow(0 0 6px #55FFEA80) drop-shadow(0 0 6px #44ef6c80);
            }
            .paint-splash {
              position: absolute;
              pointer-events: none;
              opacity: 0.4;
              contain: paint;
              transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease-out;
              filter: blur(2px);
              mix-blend-mode: screen;
              will-change: transform, opacity;
            }
            /* Staggered reveal animation */
            .popup-reveal {
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.5s ease-out, transform 0.5s ease-out;
            }
            .popup-reveal-active {
              opacity: 1;
              transform: translateY(0);
            }
            /* 3D Card Tilt & Breathe */
            .card-tilt {
              transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            }
            @keyframes breathe {
              0% { box-shadow: 0 0 15px rgba(85, 255, 234, 0.1), 0 0 30px rgba(68, 239, 108, 0.05); }
              50% { box-shadow: 0 0 25px rgba(85, 255, 234, 0.3), 0 0 50px rgba(68, 239, 108, 0.15); }
              100% { box-shadow: 0 0 15px rgba(85, 255, 234, 0.1), 0 0 30px rgba(68, 239, 108, 0.05); }
            }
            .card-breathe {
              transition: box-shadow 0.5s ease;
              animation: breathe 4s infinite ease-in-out;
            }
            /* Magnetic Buttons */
            .magnetic-btn {
              transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
            }
            /* Image zoom entrance animation */
            .image-zoom-wrapper {
              transform: scale(1);
              transition: transform 0.8s ease-out;
            }
            .image-zoom-wrapper.zoomed {
              transform: scale(1.05);
            }
            /* Info box hover effects */
            .info-box {
              position: relative;
              overflow: hidden;
              transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
              cursor: default;
            }
            .info-box::after {
              content: '';
              position: absolute;
              inset: 0;
              opacity: 0;
              transition: opacity 0.3s ease;
              background: radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(85, 255, 234, 0.12), transparent 60%);
              pointer-events: none;
            }
            .info-box:hover::after {
              opacity: 1;
            }
            .info-box:hover {
              transform: translateY(-3px);
              border-color: rgba(85, 255, 234, 0.4);
              box-shadow: 0 8px 25px rgba(85, 255, 234, 0.1), 0 4px 10px rgba(68, 239, 108, 0.08);
            }
          `}</style>
            <p className="mt-1 text-sm font-semibold gradient-text-eternal w-fit cursor-default">
              {nrpText} - Badung
            </p>
          </div>

          <div className={`mt-5 flex gap-2 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '200ms' }}>
            {/* UBAH USERNAME INSTAGRAM */}
            <div className="hover-gradient-icon magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
              <Instagram username="sakti.putu" />
            </div>
            {/* UBAH USERNAME LINKEDIN */}
            <div className="hover-gradient-icon magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
              <LinkedInButtonLink username="saktis" />
            </div>
          </div>


          <div className={`mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '300ms' }}>
            <div
              className="info-box border-neutral-cs-10/40 rounded-xl border p-4"
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`) }}
            >
              {/* UBAH HOBI KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">
                <a href="https://myanimelist.net/profile/GRACINGZONE" target="_blank" rel="noopener noreferrer" className="hover-gradient-text hover:underline">Nonton media</a>,{' '}
                <a href="https://www.youtube.com/watch?v=fZ2pXyBBwsQ&list=RDfZ2pXyBBwsQ&start_radio=1" target="_blank" rel="noopener noreferrer" className="hover-gradient-text hover:underline">dengerin lagu tapi lagu cringe</a>
              </p>
            </div>
            <div
              className="info-box border-neutral-cs-10/40 rounded-xl border p-4"
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`) }}
            >
              {/* UBAH FUNFACT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Professional Larper, deadliner handal.</p>
            </div>
          </div>

          <div className={`popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '350ms' }}>
            <div
              className="info-box border-neutral-cs-10/40 mt-4 rounded-xl border p-4"
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`) }}
            >
              {/* UBAH LAGU FAVORIT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
              <p className="my-2 text-sm font-semibold">Color Your Night</p>

              {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4pjFNyjGaoKgLTnndISP6V?si=6d9de41822ca4fc7" />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
