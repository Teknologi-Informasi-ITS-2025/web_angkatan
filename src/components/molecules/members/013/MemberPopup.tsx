'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Image from 'next/image'
import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type StyleVars = React.CSSProperties & Record<`--${string}`, string | number>

const fairyChapters = [
  {
    title: '📖 Chapter 1 — The Goodbye',
    text: `Once upon a time,
a princess held on too tightly
to a story that had already ended.`
  },
  {
    title: '📖 Chapter 2 — The Empty Castle',
    text: `The castle felt quieter than before.
She wondered if some rooms
would stay empty forever.`
  },
  {
    title: '📖 Chapter 3 — The Rain',
    text: `Some days felt like endless rain.
The princess thought
the storm would never leave.`
  },
  {
    title: '📖 Chapter 4 — Learning',
    text: `Little by little,
she learned that letting go
isn't the same as losing.`
  },
  {
    title: '📖 Chapter 5 — The Butterflies',
    text: `She stopped chasing butterflies.
And somehow,
they returned on their own.`
  },
  {
    title: '📖 Chapter 6 — The Moonlight',
    text: `On lonely nights,
the moon reminded her
that even darkness can be beautiful.`
  },
  {
    title: '📖 Chapter 7 — New Pages',
    text: `Some endings, she discovered,
are simply new chapters
waiting to begin.`
  },
  {
    title: '📖 Chapter 8 — Blooming',
    text: `While she was busy healing,
the flowers around the castle
quietly began to bloom.`
  },
  {
    title: '📖 Chapter 9 — The Storm',
    text: `One day,
the princess looked around
and realized the storm was gone.`
  },
  {
    title: '📖 Chapter 10 — Happily Ever After',
    text: `The castle felt warm again.
Not because nothing had happened,
but because she survived it.`
  }
]

const secretChapter = {
  title: '🔒 Secret Chapter',
  text: `The princess never got back
the chapter she lost.
But she found something better, peace.
👑✨`
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [answer, setAnswer] = useState('')
  const [isWrong, setIsWrong] = useState(false)
  const [step, setStep] = useState<'quiz' | 'quote' | 'card' | 'fairy'>('quiz')
  const [isMusicMode, setIsMusicMode] = useState(false)
  const [butterflyMessage, setButterflyMessage] = useState(false)
  const [butterflyPos, setButterflyPos] = useState({ top: 26, left: 76 })
  const [flowerTrail, setFlowerTrail] = useState<{ id: number; x: number; y: number; emoji: string }[]>([])
  const [chapterIndex, setChapterIndex] = useState(0)
  const [isPageFlipping, setIsPageFlipping] = useState(false)

  const trailId = useRef(0)

  const magicalFloaters = [
    { e: '⭐', sz: 28 },
    { e: '✨', sz: 24 },
    { e: '🌟', sz: 32 },
    { e: '🌸', sz: 26 },
    { e: '🌷', sz: 24 },
    { e: '💫', sz: 30 },
    { e: '✦', sz: 22 },
    { e: '💗', sz: 26 },
    { e: '🎀', sz: 28 },
    { e: '🫧', sz: 22 },
    { e: '👑', sz: 32 },
    { e: '💌', sz: 24 },
    { e: '🌺', sz: 26 },
    { e: '💕', sz: 22 },
    { e: '✨', sz: 28 }
  ]

  const stars = useMemo(() => Array.from({ length: 85 }), [])
  const sakura = useMemo(() => Array.from({ length: 28 }), [])

  const resetPopupState = useCallback(() => {
    setAnswer('')
    setIsWrong(false)
    setStep('quiz')
    setIsMusicMode(false)
    setButterflyMessage(false)
    setButterflyPos({ top: 26, left: 76 })
    setFlowerTrail([])
    setChapterIndex(0)
    setIsPageFlipping(false)
    trailId.current = 0
  }, [])

  const handleClose = useCallback(() => {
    resetPopupState()
    onClose()
  }, [onClose, resetPopupState])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  useEffect(() => {
    if (!isOpen) return

    const handleMouseMove = (event: MouseEvent) => {
      const emojis = ['🌸', '🌷', '💗', '✨', '🌺']
      const newTrail = {
        id: trailId.current++,
        x: event.clientX,
        y: event.clientY,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      }

      setFlowerTrail((prev) => [...prev.slice(-18), newTrail])

      setTimeout(() => {
        setFlowerTrail((prev) => prev.filter((item) => item.id !== newTrail.id))
      }, 1000)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isOpen])

  if (!isOpen) return null

  const checkAnswer = () => {
    const normalizedAnswer = answer.trim().toLowerCase().replace(/\s+/g, ' ')

    if (normalizedAnswer === 'nadya') {
      setStep('quote')
      setIsWrong(false)
      return
    }

    setIsWrong(true)
  }

  const closeWrong = () => {
    setIsWrong(false)
    setAnswer('')
  }

  const moveButterfly = () => {
    setButterflyMessage(true)
    setButterflyPos({
      top: 12 + Math.random() * 68,
      left: 8 + Math.random() * 82
    })

    setTimeout(() => {
      setButterflyMessage(false)
    }, 2200)
  }

  const turnFairyPage = () => {
    if (isPageFlipping) return

    setIsPageFlipping(true)

    const audio = new Audio('/sounds/paper-flip.mp3')
    audio.volume = 0.45
    audio.play().catch(() => {})

    setTimeout(() => {
      if (chapterIndex === -1) {
        setChapterIndex(0)
      } else if (chapterIndex >= fairyChapters.length - 1) {
        setChapterIndex(-1)
      } else {
        setChapterIndex((prev) => prev + 1)
      }

      setIsPageFlipping(false)
    }, 430)
  }

  const currentChapter = chapterIndex === -1 ? secretChapter : fairyChapters[chapterIndex]

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto px-4 py-[5dvh]">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
      />

      <div className={`member-popup-shell ${isMusicMode ? 'music-mode' : ''}`}>
      <div className="bg-kingdom">
        <div className="castle-wrap">
          <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" fill="rgba(180,80,255,.7)">
            <rect x="60" y="180" width="90" height="320" rx="4" />
            <rect x="45" y="160" width="120" height="40" rx="2" />
            <rect x="50" y="130" width="20" height="50" />
            <rect x="80" y="120" width="20" height="60" />
            <rect x="110" y="130" width="20" height="50" />
            <polygon points="100,60 60,160 140,160" />
            <rect x="170" y="260" width="60" height="240" rx="2" />
            <polygon points="200,210 170,265 230,265" />
            <rect x="260" y="200" width="380" height="300" rx="4" />
            <ellipse cx="450" cy="380" rx="55" ry="75" fill="rgba(100,20,160,.5)" />
            <rect x="395" y="380" width="110" height="120" fill="rgba(100,20,160,.5)" />
            <rect x="370" y="80" width="160" height="200" rx="4" />
            <rect x="355" y="60" width="190" height="35" rx="2" />
            <polygon points="450,0 355,65 545,65" />
            <ellipse cx="450" cy="140" rx="22" ry="28" fill="rgba(100,20,160,.45)" />
            <ellipse cx="410" cy="230" rx="14" ry="18" fill="rgba(100,20,160,.45)" />
            <ellipse cx="490" cy="230" rx="14" ry="18" fill="rgba(100,20,160,.45)" />
            <rect x="670" y="260" width="60" height="240" rx="2" />
            <polygon points="700,210 670,265 730,265" />
            <rect x="750" y="180" width="90" height="320" rx="4" />
            <rect x="735" y="160" width="120" height="40" rx="2" />
            <polygon points="800,60 750,160 850,160" />
          </svg>
        </div>

        <div className="moon">🌙</div>

        <div className="star-field">
          {stars.map((_, i) => (
            <div
              key={i}
              className="star-dot"
              style={
                {
                  width: `${1.5 + (i % 4)}px`,
                  height: `${1.5 + (i % 4)}px`,
                  top: `${(i * 13.7) % 96}%`,
                  left: `${(i * 19.3) % 99}%`,
                  '--d': `${1.2 + (i % 4) * 0.6}s`,
                  '--dl': `${(i * 0.15) % 4}s`
                } as StyleVars
              }
            />
          ))}
        </div>

        <div className="floaters">
          {magicalFloaters.map((item, i) => (
            <div
              key={i}
              className="floater"
              style={
                {
                  top: `${2 + ((i * 14.5) % 92)}%`,
                  left: `${1 + ((i * 21.4) % 97)}%`,
                  '--sz': `${item.sz}px`,
                  '--ty': `${-(12 + (i % 6) * 4)}px`,
                  '--r0': `${(i % 4) * 8 - 16}deg`,
                  '--r1': `${(i % 5) * 8 - 12}deg`,
                  '--op': 0.65 + (i % 4) * 0.08,
                  '--d': `${2.5 + (i % 3) * 0.8}s`,
                  '--dl': `${i * 0.14}s`
                } as StyleVars
              }
            >
              {item.e}
            </div>
          ))}
        </div>

        <div className="sakura-layer">
          {sakura.map((_, i) => (
            <span
              key={i}
              className="sakura"
              style={
                {
                  left: `${1 + i * 3.5}%`,
                  '--sz': `${14 + (i % 6) * 3}px`,
                  '--d': `${5 + (i % 4) * 1.5}s`,
                  '--dl': `${i * 0.25}s`
                } as StyleVars
              }
            >
              {i % 4 === 0 ? '🌸' : i % 4 === 1 ? '🌺' : i % 4 === 2 ? '🌷' : '💗'}
            </span>
          ))}
        </div>

        <div className="cloud-base cloud-1">
          <span>☁️</span>
        </div>
        <div className="cloud-base cloud-2">
          <span>☁️</span>
        </div>
        <div className="cloud-base cloud-3">
          <span>☁️</span>
        </div>
        <div className="cloud-base cloud-4">
          <span>☁️</span>
        </div>
      </div>

      <button
        type="button"
        className="butterfly-companion"
        style={{
          top: `${butterflyPos.top}%`,
          left: `${butterflyPos.left}%`
        }}
        onClick={moveButterfly}
        title="Click the butterfly"
      >
        🦋
      </button>

      {butterflyMessage && (
        <div
          className="butterfly-message"
          style={{
            top: `${butterflyPos.top + 6}%`,
            left: `${butterflyPos.left}%`
          }}
        >
          <b>🦋 Butterfly Message</b>
          <br />
          Some people are meant to be a chapter,
          <br />
          not the whole story
        </div>
      )}

      <div className="flower-trail-layer">
        {flowerTrail.map((item) => (
          <span
            key={item.id}
            className="flower-trail"
            style={{
              left: item.x,
              top: item.y
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="page">
        <div className="card">
          <button className="close-btn" onClick={handleClose} title="Tutup">
            ×
          </button>

          <div className="cd moon-tl">🌙</div>
          <div className="cd star-tr">⭐</div>
          <div className="cd star2">✨</div>
          <div className="cd flower-tr">🌸</div>
          <div className="cd tulip-r">🌷</div>
          <div className="cd flower-bl">🌸</div>
          <div className="cd flower-br">🌸</div>
          <div className="cd heart-bl">💗</div>
          <div className="cd heart-br">💕</div>

          {step === 'quiz' && (
            <div className="slide">
              <div className="quiz-icon-row">
                <span className="quiz-crown">👑</span>
                <span className="quiz-bow">🎀</span>
              </div>

              <div className="quiz-title">The castle gate is locked 👑</div>
              <div className="quiz-body">Only the princess&apos;s name can open it</div>

              <div className="clue-box">
                <p>👑 Hint: It&apos;s her first name</p>
              </div>

              <div className="input-row">
                <input
                  className="q-input"
                  value={answer}
                  placeholder="type her name..."
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') checkAnswer()
                  }}
                />
                <button className="btn-kirim" onClick={checkAnswer}>
                  Kirim
                </button>
              </div>

              <div className={`wrong-overlay ${isWrong ? 'show' : ''}`}>
                <div className="sad-cloud-wrap">
                  <div className="sad-cloud-img">
                    <div className="cloud-body">
                      <div className="cloud-eye-l" />
                      <div className="cloud-eye-r" />
                      <div className="tear-l" />
                      <div className="tear-r" />
                    </div>
                    <span className="cloud-star-l">✦</span>
                    <span className="cloud-star-r">✨</span>
                  </div>
                </div>
                <div className="wrong-msg-only">
                  🌙 The magic didn&apos;t work...
                  <br />
                  Perhaps that&apos;s not the princess we&apos;re looking for.
                </div>
                <button className="btn-wrong-close" onClick={closeWrong}>
                  ✕
                </button>
              </div>
            </div>
          )}

          {step === 'quote' && (
            <div className="slide">
              <div className="quote-header">Secret quote unlocked 💌</div>

              <div className="env-scene">
                <div className="q-paper">
                  <div className="paper-crown-icon">👑</div>
                  <div className="paper-quote">
                    &quot;You can always
                    <br />
                    <em>begin again!</em>
                    <br />
                    Romanticize your life
                    <br />
                    cause you&apos;re the
                    <br />
                    main character.&quot;
                  </div>
                </div>

                <div className="env-body">
                  <div className="env-main">
                    <div className="env-fold-l" />
                    <div className="env-fold-r" />
                    <div className="env-gold-l" />
                    <div className="env-gold-r" />
                    <div className="env-seal">💗</div>
                  </div>
                </div>

                <div className="env-wing l">🪽</div>
                <div className="env-wing r">🪽</div>
                <div className="env-flower-l">🌸</div>
                <div className="env-flower-r">🎀</div>
                <div className="env-cloud-l">☁️</div>
                <div className="env-cloud-r">☁️</div>
              </div>

              <button className="btn-found" onClick={() => setStep('card')}>
                You Found Me 👀
              </button>
            </div>
          )}

          {step === 'card' && (
            <div className="slide">
              <div className="prof-crown">👑</div>

              <div className="photo-frame">
                <Image src={ProfileImage} alt="Profile" className="profile-img" />
                <span className="photo-spark spark-1">✦</span>
                <span className="photo-spark spark-2">✨</span>
                <span className="photo-spark spark-3">💫</span>
                <span className="photo-spark spark-4">⭐</span>
              </div>

              <div className="prof-name">Nadya Putri Agustin 👑</div>
              <div className="prof-id">5027251013 - Surabaya</div>

              <div className="social-row">
                <Instagram username="nadyaputria._" />
                <LinkedInButtonLink username="nadyaputria" />
              </div>

              <div className="info-grid">
                <div className="info-card">
                  <div className="ic-label">Hobi</div>
                  <div className="ic-val">Ketiduran sambil dengerin musik 🎧🎶</div>
                </div>

                <div className="info-card">
                  <div className="ic-label">Fun Fact</div>
                  <div className="ic-val">Kalau aku gak bales chat berarti aku ketiduran 🥱</div>
                </div>
              </div>

              <div className="music-hint">🌙 Tap the song card to unlock the starry night</div>

              <div className="spotify-box" onClick={() => setIsMusicMode(true)}>
                <div className="sp-label-title">Lagu Favorit</div>
                <div className="sp-song-name">Begin Again 🎶</div>
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/05GsNucq8Bngd9fnd4fRa0?si=87e953ecc5f4492c" />
              </div>

              <button type="button" className="fairy-open-btn" onClick={() => setStep('fairy')}>
                Open Fairy Tale Page 📖
              </button>
            </div>
          )}

          {step === 'fairy' && (
            <div className="slide fairy-slide">
              <div className="fairy-title">Fairy Tale Page 📖</div>

              <div className={`fairy-book ${isPageFlipping ? 'flipping' : ''}`} onClick={turnFairyPage}>
                <div className="fairy-page">
                  <div className="fairy-corner top-left">🦋</div>
                  <div className="fairy-corner top-right">✨</div>
                  <div className="fairy-corner bottom-left">🌸</div>
                  <div className="fairy-corner bottom-right">👑</div>

                  <div className="fairy-chapter-title">{currentChapter.title}</div>
                  <pre className="fairy-text">{currentChapter.text}</pre>
                </div>
              </div>

              <div className="fairy-hint">📖 Every princess keeps a story untold</div>

              <button type="button" className="fairy-back-btn" onClick={() => setStep('card')}>
                Back to Princess Card 👑
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700;900&family=Playfair+Display:ital,wght@0,700;1,700&family=Nunito:wght@600;700;800;900&family=Cormorant+Garamond:ital,wght@0,600;1,500;1,600&display=swap');

        .member-popup-shell * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .member-popup-shell {
          position: relative;
          z-index: 10;
          width: 100%;
          min-height: 90dvh;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
          user-select: none;
        }

        .bg-kingdom {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: linear-gradient(
            160deg,
            #2c0a5e 0%,
            #5a18a0 18%,
            #8e3bcc 34%,
            #c26ed4 50%,
            #e89ccc 64%,
            #f7c4e0 78%,
            #fde0f0 90%,
            #fff4fa 100%
          );
        }

        .bg-kingdom::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 45% at 50% 0%, rgba(255, 200, 240, 0.5) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 8% 28%, rgba(140, 60, 210, 0.4) 0%, transparent 55%),
            radial-gradient(ellipse 55% 65% at 92% 22%, rgba(190, 80, 230, 0.35) 0%, transparent 58%),
            radial-gradient(ellipse 90% 35% at 50% 100%, rgba(255, 210, 235, 0.7) 0%, transparent 65%);
        }

        .castle-wrap {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 900px;
          pointer-events: none;
          opacity: 0.35;
          filter: drop-shadow(0 0 50px rgba(200, 120, 255, 0.7)) drop-shadow(0 0 25px rgba(255, 180, 240, 0.5));
        }

        .castle-wrap svg {
          width: 100%;
          height: auto;
        }

        .moon {
          position: absolute;
          left: 3%;
          top: 4%;
          font-size: clamp(60px, 8vw, 100px);
          filter: drop-shadow(0 0 24px rgba(255, 240, 120, 0.95)) drop-shadow(0 0 60px rgba(255, 200, 80, 0.4));
          animation: moonFloat 7s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes moonFloat {
          0%,
          100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-16px) rotate(5deg);
          }
        }

        .star-field {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .star-dot {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          animation: starBlink var(--d, 2s) ease-in-out infinite var(--dl, 0s);
        }

        @keyframes starBlink {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.6);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .floaters {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .floater {
          position: absolute;
          font-size: var(--sz, 26px);
          animation: floaterAnim var(--d, 4s) ease-in-out infinite var(--dl, 0s);
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
        }

        @keyframes floaterAnim {
          0%,
          100% {
            transform: translateY(0) rotate(var(--r0, 0deg)) scale(1);
            opacity: var(--op, 0.85);
          }
          50% {
            transform: translateY(var(--ty, -14px)) rotate(var(--r1, 5deg)) scale(1.1);
            opacity: 1;
          }
        }

        .sakura-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .sakura {
          position: absolute;
          top: -40px;
          font-size: var(--sz, 20px);
          animation: sakuraFall var(--d, 9s) linear infinite var(--dl, 0s);
        }

        @keyframes sakuraFall {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(105vh) translateX(50px) rotate(420deg);
            opacity: 0;
          }
        }

        .cloud-base {
          position: absolute;
          z-index: 2;
          pointer-events: none;
        }

        .cloud-base span {
          display: block;
          font-size: var(--sz, 180px);
          animation: cloudSway var(--d, 6s) ease-in-out infinite var(--dl, 0s);
          opacity: 0.93;
        }

        .cloud-1 {
          left: -50px;
          bottom: -10px;
          --sz: 200px;
          --d: 5s;
          --dl: 0s;
          --sh: 28px;
        }

        .cloud-2 {
          right: -50px;
          bottom: -10px;
          --sz: 220px;
          --d: 6s;
          --dl: 0.6s;
          --sh: -28px;
        }

        .cloud-3 {
          left: 18%;
          bottom: -5px;
          --sz: 155px;
          --d: 4.5s;
          --dl: 0.3s;
          --sh: 20px;
        }

        .cloud-4 {
          right: 16%;
          bottom: -5px;
          --sz: 145px;
          --d: 5.5s;
          --dl: 1s;
          --sh: -20px;
        }

        @keyframes cloudSway {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(var(--sh, 20px));
          }
        }

        .butterfly-companion {
          position: fixed;
          z-index: 12;
          border: none;
          background: transparent;
          font-size: 38px;
          cursor: pointer;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 18px rgba(255, 120, 220, 0.6));
          animation: butterflyFly 4s ease-in-out infinite;
          transition:
            top 1s ease,
            left 1s ease,
            transform 0.2s ease;
        }

        .butterfly-companion:hover {
          transform: scale(1.25) rotate(10deg);
        }

        @keyframes butterflyFly {
          0%,
          100% {
            transform: translateY(0) rotate(-8deg);
          }
          50% {
            transform: translateY(-18px) rotate(12deg);
          }
        }

        .butterfly-message {
          position: fixed;
          z-index: 13;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.92);
          border: 2px solid #ffb3d1;
          border-radius: 18px;
          padding: 12px 16px;
          text-align: center;
          color: #9b1461;
          font-size: 13px;
          font-weight: 800;
          box-shadow:
            0 8px 25px rgba(233, 30, 140, 0.28),
            0 0 20px rgba(255, 255, 255, 0.6);
          animation: butterflyNotePop 2.2s ease both;
          pointer-events: none;
        }

        @keyframes butterflyNotePop {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(12px) scale(0.8);
          }
          15%,
          80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-14px) scale(0.92);
          }
        }

        .flower-trail-layer {
          position: fixed;
          inset: 0;
          z-index: 11;
          pointer-events: none;
        }

        .flower-trail {
          position: fixed;
          transform: translate(-50%, -50%);
          font-size: 20px;
          animation: flowerTrailFade 1s ease-out forwards;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }

        @keyframes flowerTrailFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.7) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -95%) scale(1.5) rotate(60deg);
          }
        }

        .page {
          position: relative;
          z-index: 10;
          min-height: 90dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .card {
          width: 100%;
          max-width: 430px;
          max-height: 90dvh;
          background: linear-gradient(
            160deg,
            rgba(255, 255, 255, 0.93) 0%,
            rgba(255, 243, 252, 0.9) 45%,
            rgba(255, 218, 240, 0.88) 100%
          );
          border: 3.5px solid rgba(255, 170, 210, 0.75);
          border-radius: 36px;
          padding: 32px 28px 28px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 0 0 7px rgba(255, 255, 255, 0.22),
            0 28px 70px rgba(200, 0, 110, 0.38),
            0 6px 20px rgba(255, 100, 180, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          overflow-y: auto;
          animation: cardPop 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes cardPop {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(36px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 32px;
          pointer-events: none;
          background:
            radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.88) 0%, transparent 28%),
            radial-gradient(circle at 82% 78%, rgba(255, 175, 215, 0.35) 0%, transparent 32%);
        }

        .cd {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }

        .cd.moon-tl {
          top: 14px;
          left: 14px;
          font-size: 28px;
          animation: floaterAnim 5s ease-in-out infinite;
        }
        .cd.star-tr {
          top: 14px;
          right: 50px;
          font-size: 22px;
          animation: twinkleAnim 2.2s ease-in-out infinite 0.4s;
        }
        .cd.star2 {
          top: 14px;
          right: 22px;
          font-size: 18px;
          animation: twinkleAnim 1.8s ease-in-out infinite 0.9s;
        }
        .cd.flower-tr {
          top: 60px;
          right: 18px;
          font-size: 26px;
          animation: floaterAnim 4.5s ease-in-out infinite 0.5s;
        }
        .cd.tulip-r {
          top: 120px;
          right: 14px;
          font-size: 22px;
          animation: floaterAnim 4s ease-in-out infinite 1s;
        }
        .cd.flower-bl {
          bottom: 80px;
          left: -6px;
          font-size: 46px;
          animation: floaterAnim 5s ease-in-out infinite 0.3s;
        }
        .cd.flower-br {
          bottom: 70px;
          right: -6px;
          font-size: 46px;
          animation: floaterAnim 5s ease-in-out infinite 0.6s;
        }
        .cd.heart-bl {
          bottom: 130px;
          left: 18px;
          font-size: 22px;
          animation: heartPop 1.8s ease-in-out infinite;
        }
        .cd.heart-br {
          bottom: 115px;
          right: 16px;
          font-size: 18px;
          animation: heartPop 2s ease-in-out infinite 0.4s;
        }

        @keyframes heartPop {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.25);
          }
        }

        .close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 30;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #ffb3d1;
          font-size: 20px;
          font-weight: 900;
          color: #e91e8c;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 16px rgba(233, 30, 140, 0.28);
          transition:
            transform 0.15s,
            box-shadow 0.15s;
          line-height: 1;
        }

        .close-btn:hover {
          transform: scale(1.12);
          box-shadow: 0 8px 22px rgba(233, 30, 140, 0.4);
        }

        .slide {
          position: relative;
          z-index: 5;
        }

        .quiz-icon-row {
          text-align: center;
          margin-bottom: 4px;
        }

        .quiz-crown {
          font-size: 50px;
          animation: floaterAnim 3s ease-in-out infinite;
          display: inline-block;
        }

        .quiz-bow {
          font-size: 42px;
          animation: floaterAnim 3.5s ease-in-out infinite 0.4s;
          display: inline-block;
          margin-left: 6px;
        }

        .quiz-title {
          font-family: 'Dancing Script', cursive;
          font-size: 30px;
          font-weight: 900;
          color: #c0185a;
          text-align: center;
          margin: 8px 0 4px;
          text-shadow: 0 1px 8px rgba(200, 0, 100, 0.15);
        }

        .quiz-body {
          font-size: 18px;
          font-weight: 800;
          color: #d4366e;
          text-align: center;
          line-height: 1.55;
          margin-bottom: 18px;
          font-style: italic;
        }

        .clue-box {
          background: rgba(255, 255, 255, 0.82);
          border: 2.5px dashed #ffb3d1;
          border-radius: 22px;
          padding: 14px 18px;
          text-align: center;
          margin-bottom: 18px;
          box-shadow: inset 0 2px 8px rgba(255, 100, 160, 0.08);
        }

        .clue-box p {
          font-size: 15px;
          font-weight: 800;
          color: #c0185a;
          line-height: 1.65;
        }

        .input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 6px;
        }

        .q-input {
          flex: 1;
          border: 2.5px solid #ffb3d1;
          border-radius: 16px;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 700;
          color: #c0185a;
          background: rgba(255, 255, 255, 0.92);
          outline: none;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .q-input:focus {
          border-color: #ff3d8b;
          box-shadow: 0 0 0 3px rgba(255, 60, 140, 0.18);
        }

        .q-input::placeholder {
          color: #ffaacc;
          font-weight: 600;
        }

        .btn-kirim {
          background: linear-gradient(135deg, #ff6eb0, #e91e8c);
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 11px 22px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 5px 16px rgba(233, 30, 140, 0.4);
          transition:
            transform 0.15s,
            box-shadow 0.15s;
          white-space: nowrap;
        }

        .btn-kirim:hover {
          transform: scale(1.06);
        }

        .btn-kirim:active {
          transform: scale(0.96);
        }

        .wrong-overlay {
          display: none;
          position: absolute;
          inset: 0;
          border-radius: 32px;
          z-index: 40;
          background: linear-gradient(160deg, rgba(255, 240, 250, 0.97), rgba(255, 210, 235, 0.96));
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 32px;
          animation: cardPop 0.35s ease-out both;
        }

        .wrong-overlay.show {
          display: flex;
        }

        .sad-cloud-wrap {
          position: relative;
          margin-bottom: 10px;
        }

        .sad-cloud-img {
          width: 130px;
          height: 100px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cloud-body {
          position: absolute;
          width: 120px;
          height: 70px;
          background: linear-gradient(160deg, #fde0ee, #f9b8d8);
          border-radius: 40px;
          border: 3px solid rgba(255, 150, 190, 0.4);
          box-shadow:
            0 6px 20px rgba(255, 100, 160, 0.25),
            inset 0 2px 0 rgba(255, 255, 255, 0.7);
          bottom: 10px;
          left: 0;
        }

        .cloud-body::before {
          content: '';
          position: absolute;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fde8f3, #f9c0dc);
          border: 3px solid rgba(255, 150, 190, 0.35);
          top: -26px;
          left: 18px;
        }

        .cloud-body::after {
          content: '';
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fdeaf5, #f9c8e0);
          border: 3px solid rgba(255, 150, 190, 0.3);
          top: -16px;
          left: 52px;
        }

        .cloud-eye-l,
        .cloud-eye-r {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #a0405c;
          z-index: 2;
          top: 22px;
        }

        .cloud-eye-l {
          left: 36px;
        }
        .cloud-eye-r {
          left: 66px;
        }

        .tear-l,
        .tear-r {
          position: absolute;
          width: 7px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(180deg, #88c4f0, #4a9fd4);
          z-index: 2;
          animation: tearDrop 1.4s ease-in infinite var(--dl, 0s);
        }

        .tear-l {
          top: 38px;
          left: 38px;
          --dl: 0s;
        }
        .tear-r {
          top: 38px;
          left: 68px;
          --dl: 0.3s;
        }

        @keyframes tearDrop {
          0% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          80% {
            opacity: 0.4;
            transform: translateY(22px) scaleY(0.4);
          }
          100% {
            opacity: 0;
            transform: translateY(28px);
          }
        }

        .cloud-star-l,
        .cloud-star-r {
          position: absolute;
          font-size: 16px;
          z-index: 2;
          animation: twinkleAnim 1.5s ease-in-out infinite;
        }

        .cloud-star-l {
          top: -4px;
          left: -4px;
        }
        .cloud-star-r {
          top: 0;
          right: -8px;
          animation-delay: 0.4s;
        }

        @keyframes twinkleAnim {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.6) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.4) rotate(20deg);
          }
        }

        .wrong-msg-only {
          font-size: 16px;
          font-weight: 800;
          color: #d4366e;
          margin-top: 14px;
          line-height: 1.65;
          text-align: center;
        }

        .btn-wrong-close {
          margin-top: 20px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff5b5b, #e53535);
          border: 3px solid rgba(255, 255, 255, 0.5);
          color: #fff;
          font-size: 22px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(229, 53, 53, 0.45);
          transition: transform 0.15s;
        }

        .btn-wrong-close:hover {
          transform: scale(1.1);
        }

        .quote-header {
          font-family: 'Dancing Script', cursive;
          font-size: 22px;
          font-weight: 900;
          color: #c0185a;
          text-align: center;
          margin-bottom: 10px;
          text-shadow: 0 1px 8px rgba(200, 0, 100, 0.15);
        }

        .env-scene {
          position: relative;
          height: 360px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin-bottom: 14px;
        }

        .q-paper {
          position: absolute;
          top: 0;
          left: 50%;
          width: 240px;
          background: linear-gradient(155deg, #fff9fc, #fff0f6);
          border: 2px solid #ffdaec;
          border-radius: 20px;
          padding: 26px 20px 18px;
          text-align: center;
          z-index: 10;
          box-shadow:
            0 -8px 35px rgba(255, 100, 180, 0.28),
            0 0 0 1px rgba(255, 255, 255, 0.85);
          transform: translateX(-50%) translateY(200px);
          opacity: 0;
          animation: paperOut 1.1s cubic-bezier(0.34, 1.28, 0.64, 1) 0.25s both;
        }

        @keyframes paperOut {
          0% {
            transform: translateX(-50%) translateY(200px) scale(0.9);
            opacity: 0;
          }
          55% {
            transform: translateX(-50%) translateY(-8px) scale(1.04) rotate(-1.5deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(4px) scale(1) rotate(-1.5deg);
            opacity: 1;
          }
        }

        .paper-crown-icon {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 36px;
          animation: heartPop 2s ease-in-out infinite;
        }

        .paper-quote {
          font-family: 'Dancing Script', cursive;
          font-size: 18px;
          font-weight: 700;
          color: #9b1461;
          line-height: 1.6;
          margin-top: 8px;
        }

        .paper-quote em {
          color: #e91e8c;
          font-style: italic;
        }

        .env-body {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 185px;
          z-index: 2;
        }

        .env-main {
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #ff9ed4, #e91e8c, #ff5ba7);
          border-radius: 18px 18px 26px 26px;
          border: 3px solid rgba(255, 255, 255, 0.45);
          box-shadow:
            0 18px 55px rgba(233, 30, 140, 0.55),
            inset 0 2px 0 rgba(255, 255, 255, 0.4);
          position: relative;
          overflow: hidden;
        }

        .env-fold-l {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to bottom right, rgba(255, 190, 220, 0.8), rgba(220, 30, 130, 0.7));
          clip-path: polygon(0 100%, 100% 100%, 0 0);
        }

        .env-fold-r {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to bottom left, rgba(255, 190, 220, 0.8), rgba(220, 30, 130, 0.7));
          clip-path: polygon(0 100%, 100% 100%, 100% 0);
        }

        .env-gold-l,
        .env-gold-r {
          position: absolute;
          bottom: 0;
          height: 100%;
          width: 3px;
          background: linear-gradient(to top, rgba(255, 210, 80, 0.9), transparent);
          z-index: 3;
        }

        .env-gold-l {
          left: 50%;
          transform-origin: bottom left;
          transform: rotate(-34deg);
        }

        .env-gold-r {
          right: 50%;
          transform-origin: bottom right;
          transform: rotate(34deg);
        }

        .env-seal {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff4d8c, #bf1862);
          border: 4px solid rgba(255, 255, 255, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          box-shadow: 0 5px 18px rgba(192, 24, 98, 0.55);
          animation: heartPop 1.6s ease-in-out infinite;
        }

        .env-wing {
          position: absolute;
          bottom: 36px;
          font-size: 54px;
          z-index: 1;
          filter: drop-shadow(0 4px 8px rgba(255, 120, 180, 0.35));
        }

        .env-wing.l {
          left: -14px;
          transform: rotate(-18deg) scaleX(-1);
          animation: wingL 2s ease-in-out infinite;
        }

        .env-wing.r {
          right: -14px;
          transform: rotate(18deg);
          animation: wingR 2s ease-in-out infinite;
        }

        @keyframes wingL {
          0%,
          100% {
            transform: rotate(-18deg) scaleX(-1) translateY(0);
          }
          50% {
            transform: rotate(-25deg) scaleX(-1) translateY(-9px);
          }
        }

        @keyframes wingR {
          0%,
          100% {
            transform: rotate(18deg) translateY(0);
          }
          50% {
            transform: rotate(25deg) translateY(-9px);
          }
        }

        .env-cloud-l,
        .env-cloud-r {
          position: absolute;
          bottom: 0;
          font-size: 60px;
          z-index: 3;
          animation: cloudSway 5s ease-in-out infinite;
        }

        .env-cloud-l {
          left: -12px;
        }
        .env-cloud-r {
          right: -12px;
          animation-duration: 6s;
          animation-delay: 0.5s;
        }

        .env-flower-l,
        .env-flower-r {
          position: absolute;
          bottom: 55px;
          font-size: 32px;
          z-index: 4;
          animation: floaterAnim 3.5s ease-in-out infinite;
        }

        .env-flower-l {
          left: 4px;
        }
        .env-flower-r {
          right: 2px;
          animation-delay: 0.6s;
        }

        .btn-found,
        .fairy-open-btn,
        .fairy-back-btn {
          display: block;
          width: 100%;
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 14px 28px;
          font-family: 'Dancing Script', cursive;
          font-size: 21px;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 0.15s,
            box-shadow 0.15s;
          letter-spacing: 0.3px;
        }

        .btn-found {
          background: linear-gradient(135deg, #ff5ba7, #e91e8c);
          box-shadow: 0 8px 26px rgba(233, 30, 140, 0.5);
          animation: btnPulse 2s ease-in-out infinite;
        }

        .btn-found:hover,
        .fairy-open-btn:hover,
        .fairy-back-btn:hover {
          transform: scale(1.05);
        }

        @keyframes btnPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }

        .prof-crown {
          text-align: center;
          font-size: 44px;
          animation: heartPop 2s ease-in-out infinite;
          margin-bottom: 6px;
        }

        .photo-frame {
          position: relative;
          margin: 0 auto 18px;
          border-radius: 24px;
          overflow: hidden;
          border: 4px solid #ff6eb0;
          box-shadow:
            0 0 0 6px rgba(255, 110, 176, 0.22),
            0 15px 40px rgba(233, 30, 140, 0.4);
          height: 260px;
          background: linear-gradient(135deg, #ffd6f0, #ffaad4);
        }

        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
        }

        .photo-spark {
          position: absolute;
          animation: twinkleAnim 2s ease-in-out infinite;
          pointer-events: none;
        }

        .spark-1 {
          top: 8px;
          left: 10px;
          font-size: 16px;
        }
        .spark-2 {
          top: 8px;
          right: 12px;
          font-size: 14px;
          animation-duration: 2.5s;
        }
        .spark-3 {
          bottom: 10px;
          left: 14px;
          font-size: 18px;
          animation-duration: 2.2s;
        }
        .spark-4 {
          bottom: 10px;
          right: 10px;
          font-size: 14px;
          animation-duration: 1.8s;
        }

        .prof-name {
          font-family: 'Dancing Script', cursive;
          font-size: 28px;
          font-weight: 900;
          color: #c0185a;
          text-align: center;
          margin-bottom: 3px;
        }

        .prof-id {
          font-size: 12px;
          font-weight: 800;
          color: #e86fa0;
          text-align: center;
          letter-spacing: 0.3px;
          margin-bottom: 12px;
        }

        .social-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin-bottom: 14px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.78);
          border: 2px solid #ffd4e8;
          border-radius: 16px;
          padding: 11px 12px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(255, 100, 160, 0.12);
          transition: transform 0.2s;
        }

        .info-card:hover {
          transform: scale(1.04);
        }

        .ic-label {
          font-size: 10px;
          font-weight: 900;
          color: #e91e8c;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .ic-val {
          font-size: 14px;
          font-weight: 600;
          color: #8a1457;
          line-height: 1.45;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
        }

        .spotify-box {
          background: rgba(255, 255, 255, 0.78);
          border: 2px solid #ffd4e8;
          border-radius: 16px;
          padding: 12px 14px;
          box-shadow: 0 3px 10px rgba(255, 100, 160, 0.12);
          cursor: pointer;
        }

        .sp-label-title {
          font-size: 10px;
          font-weight: 900;
          color: #e91e8c;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 3px;
          text-align: center;
        }

        .sp-song-name {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-style: italic;
          font-weight: 700;
          color: #8a1457;
          text-align: center;
          margin-bottom: 8px;
        }

        /* =========================
   MUSIC MODE - NIGHT SKY
========================= */

        .member-popup-shell.music-mode .bg-kingdom {
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15), transparent 20%),
            radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.12), transparent 25%),
            radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.08), transparent 30%),
            linear-gradient(180deg, #050816 0%, #0b1330 20%, #1b2558 45%, #35296d 65%, #5d3e91 85%, #7f5ab5 100%);
          animation: nightSkyGlow 8s ease-in-out infinite;
        }

        @keyframes nightSkyGlow {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.15);
          }
        }

        /* SHOOTING STAR */

        .member-popup-shell.music-mode .bg-kingdom::after {
          content: '';
          position: absolute;
          width: 220px;
          height: 2px;
          top: 20%;
          left: -250px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), transparent);
          transform: rotate(-25deg);
          animation: shootingStar 4s linear infinite;
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(-25deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateX(1800px) translateY(350px) rotate(-25deg);
            opacity: 0;
          }
        }

        /* SUPER TWINKLE STARS */

        .member-popup-shell.music-mode .star-dot {
          background: #fff;
          animation: magicalTwinkle 0.8s ease-in-out infinite !important;
          box-shadow:
            0 0 8px #fff,
            0 0 15px #fff,
            0 0 25px #8ec5ff,
            0 0 40px #caa8ff;
        }

        @keyframes magicalTwinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.6);
          }
          50% {
            opacity: 1;
            transform: scale(2);
          }
        }

        /* EXTRA FLOWERS */

        .member-popup-shell.music-mode .sakura {
          animation-duration: 2.8s !important;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }

        .member-popup-shell.music-mode .sakura-layer::before,
        .member-popup-shell.music-mode .sakura-layer::after {
          content: '🌸 🌷 💗 🌺 🌸 💗 🌷 🌸';
          position: absolute;
          width: 100%;
          left: 0;
          font-size: 26px;
          letter-spacing: 26px;
          animation: extraFlowerFall 4s linear infinite;
          opacity: 0.95;
        }

        .member-popup-shell.music-mode .sakura-layer::after {
          left: 40px;
          animation-delay: 2s;
          font-size: 22px;
        }

        @keyframes extraFlowerFall {
          0% {
            transform: translateY(-80px) translateX(0) rotate(0deg);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          100% {
            transform: translateY(110vh) translateX(80px) rotate(360deg);
            opacity: 0;
          }
        }

        /* FLOATERS MORE ACTIVE */

        .member-popup-shell.music-mode .floater {
          animation-duration: 1.8s !important;
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 25px rgba(255, 180, 255, 0.6));
        }

        /* CARD AURORA GLOW */

        .member-popup-shell.music-mode .card {
          animation:
            cardPop 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both,
            auroraGlow 4s ease-in-out infinite;
        }

        @keyframes auroraGlow {
          0%,
          100% {
            box-shadow:
              0 0 20px rgba(130, 180, 255, 0.3),
              0 0 40px rgba(175, 120, 255, 0.25),
              0 20px 60px rgba(120, 80, 255, 0.25);
          }

          50% {
            box-shadow:
              0 0 50px rgba(130, 180, 255, 0.7),
              0 0 90px rgba(175, 120, 255, 0.55),
              0 30px 90px rgba(120, 80, 255, 0.4);
          }
        }

        /* SPOTIFY GLOW */

        .member-popup-shell.music-mode .spotify-box {
          transform: scale(1.03);
          box-shadow:
            0 0 20px rgba(130, 180, 255, 0.4),
            0 0 45px rgba(175, 120, 255, 0.35);
        }

        .music-hint {
          text-align: center;
          font-size: 13px;
          font-weight: 800;
          color: #8a1457;
          margin-bottom: 10px;
          animation: hintGlow 2.5s ease-in-out infinite;
          letter-spacing: 0.3px;
        }

        .fairy-open-btn {
          margin-top: 12px;
          background: linear-gradient(135deg, #c471ed, #f64f9d);
          box-shadow: 0 8px 24px rgba(180, 80, 220, 0.45);
          animation: btnPulse 2s ease-in-out infinite;
        }

        .fairy-title {
          text-align: center;
          font-family: 'Dancing Script', cursive;
          font-size: 31px;
          font-weight: 900;
          color: #9b1461;
          margin-bottom: 16px;
          text-shadow: 0 2px 12px rgba(255, 120, 190, 0.25);
        }

        .fairy-book {
          width: 100%;
          min-height: 360px;
          perspective: 1000px;
          cursor: pointer;
        }

        .fairy-page {
          min-height: 360px;
          padding: 38px 26px 30px;
          border-radius: 26px;
          background:
            radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.95), transparent 28%),
            radial-gradient(circle at 85% 90%, rgba(255, 190, 220, 0.45), transparent 35%),
            linear-gradient(145deg, #fffaf0 0%, #fff1dc 45%, #ffe2ef 100%);
          border: 3px solid rgba(255, 190, 215, 0.92);
          box-shadow:
            inset 0 0 20px rgba(255, 180, 210, 0.35),
            inset 0 0 0 2px rgba(255, 255, 255, 0.45),
            0 18px 45px rgba(180, 60, 150, 0.28);
          transform-origin: left center;
          transition:
            transform 0.45s ease,
            opacity 0.25s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .fairy-page::before {
          content: '';
          position: absolute;
          inset: 18px;
          border: 2px dashed rgba(210, 120, 160, 0.35);
          border-radius: 18px;
          pointer-events: none;
        }

        .fairy-page::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 22px;
          width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(180, 90, 130, 0.25), transparent);
        }

        .fairy-book.flipping .fairy-page {
          animation: pageFlip 0.55s ease both;
        }

        @keyframes pageFlip {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          45% {
            transform: rotateY(-75deg);
            opacity: 0.45;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }

        .fairy-corner {
          position: absolute;
          font-size: 20px;
          animation: floaterAnim 3s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }

        .fairy-corner.top-left {
          top: 22px;
          left: 24px;
        }

        .fairy-corner.top-right {
          top: 22px;
          right: 24px;
          animation-delay: 0.4s;
        }

        .fairy-corner.bottom-left {
          bottom: 20px;
          left: 24px;
          animation-delay: 0.8s;
        }

        .fairy-corner.bottom-right {
          bottom: 20px;
          right: 24px;
          animation-delay: 1.1s;
        }

        .fairy-chapter-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 800;
          color: #9b1461;
          text-align: center;
          margin-bottom: 18px;
          position: relative;
          z-index: 2;
        }

        .fairy-text {
          font-family: 'Cormorant Garamond', serif;
          white-space: pre-wrap;
          text-align: center;
          font-size: 19px;
          line-height: 1.75;
          color: #7a174d;
          font-style: italic;
          position: relative;
          z-index: 2;
          margin: 0 auto;
        }

        .fairy-hint {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          font-weight: 900;
          color: #9b1461;
          animation: hintGlow 2.5s ease-in-out infinite;
        }

        .fairy-back-btn {
          margin-top: 16px;
          background: linear-gradient(135deg, #ff8cc6, #e91e8c);
          box-shadow: 0 8px 24px rgba(233, 30, 140, 0.42);
        }

        @keyframes hintGlow {
          0%,
          100% {
            opacity: 0.7;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px);
            text-shadow:
              0 0 8px rgba(255, 105, 180, 0.5),
              0 0 15px rgba(190, 120, 255, 0.4);
          }
        }

        @media (max-width: 520px) {
          .card {
            max-width: 360px;
            padding: 28px 20px 24px;
          }

          .photo-frame {
            height: 220px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .input-row {
            flex-direction: column;
          }

          .butterfly-companion {
            font-size: 32px;
          }

          .butterfly-message {
            font-size: 12px;
            max-width: 220px;
          }

          .fairy-book,
          .fairy-page {
            min-height: 340px;
          }

          .fairy-text {
            font-size: 17px;
          }
        }
      `}</style>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
