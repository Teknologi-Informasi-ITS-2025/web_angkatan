'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getTextStrokeStyle } from '@/lib/textStroke'

import LogoIcon from '@/components/atoms/icon/LogoIcon'
import LogoWithTextHorizontal from '@/components/atoms/icon/LogoWithTextHorizontal'
import Star from '@/components/atoms/icon/Star'

const Navbar = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Profil DTI', href: '/dti-profile' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Members', href: '/members' },
    { label: 'Fun Corners', href: '/fun-corners' }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  useEffect(() => {
    if (!isMenuOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  return (
    <>
      <nav
        className="bg-blue-cs-40/85 fixed top-3 left-1/2 z-50 flex w-[calc(100%-1rem)] -translate-x-1/2 items-center justify-between gap-3 rounded-[16px] px-3 py-2.5 text-white backdrop-blur-xs sm:top-4 sm:w-[calc(100%-2rem)] sm:px-5 sm:py-3 lg:w-[calc(100%-3rem)] lg:px-8 lg:py-4"
        aria-label="Main navigation"
      >
        <Link href="/" aria-label="Go to homepage" className="flex shrink-0 items-center gap-2 md:hidden">
          <LogoIcon alt="Evastra - Teknologi Informasi ITS 2025" width={36} height={40} />
          <span
            className="font-rubikone text-blue-cs-30 relative mt-1 text-xl"
            style={getTextStrokeStyle({ color: '#ffffff', width: 2 })}
          >
            EVASTRA
            <Star className="absolute top-1 -right-3.5" width={20} height={20} />
          </span>
        </Link>
        <Link href="/" aria-label="Go to homepage" className="hidden shrink-0 md:block">
          <LogoWithTextHorizontal alt="Evastra - Teknologi Informasi ITS 2025" width={168} height={28} />
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 md:flex lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors lg:text-base ${
                isActive(item.href)
                  ? 'text-yellow-cs-30 decoration-yellow-cs-30 underline decoration-2 underline-offset-6'
                  : 'text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className={`fixed inset-0 z-50 md:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          className={`bg-blue-cs-40/65 absolute inset-0 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close navigation overlay"
        />

        <aside
          id="mobile-nav-drawer"
          className={`bg-blue-cs-40 absolute top-0 right-0 flex h-full w-[min(84vw,320px)] flex-col px-5 py-5 shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="Go to homepage" onClick={() => setIsMenuOpen(false)}>
              <LogoWithTextHorizontal alt="Evastra - Teknologi Informasi ITS 2025" width={150} height={24} />
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                className="text-neutral-cs-10"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="mt-7 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                  isActive(item.href) ? 'bg-yellow-cs-30/15 text-yellow-cs-30' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}

export default Navbar
