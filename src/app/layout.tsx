import type { Metadata, Viewport } from 'next'
import { Cinzel, Montserrat } from 'next/font/google'
import localFont from 'next/font/local'

import { defineMetadata } from '@/lib/metadata'

import Footer from '@/components/organisms/layout/Footer'
import Navbar from '@/components/organisms/layout/Navbar'

import { Toaster } from 'sonner'

import './globals.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin']
})

const cinzel = Cinzel({
  variable: '--font-cinzel-local',
  subsets: ['latin']
})

const rubikone = localFont({
  src: '../assets/fonts/rubik-one/RubikOne-Regular.ttf',
  variable: '--font-rubikone-local',
  display: 'swap'
})

const simplicity = localFont({
  src: '../assets/fonts/simplicity/Simplicity.otf',
  variable: '--font-simplicity',
  display: 'swap'
})

const blackGoth = localFont({
  src: '../assets/fonts/blackGoth/Blackgoth.otf',
  variable: '--font-blackgoth',
  display: 'swap'
})

const cloisterBlack = localFont({
  src: '../assets/fonts/cloister-black/CloisterBlack.ttf',
  variable: '--font-cloisterblack',
  display: 'swap'
})

const Bodo = localFont({
  src: '../assets/fonts/bodo/BodoRoman.ttf',
  variable: '--font-bodo',
  display: 'swap'
})

const ringerLuctor = localFont({
  src: '../assets/fonts/ringer-luctor/RingerLuctor.otf',
  variable: '--font-ringer',
  display: 'swap'
})

export const metadata: Metadata = defineMetadata()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cinzel.variable} ${rubikone.variable} ${simplicity.variable} ${blackGoth.variable} 
      ${cloisterBlack.variable} ${Bodo.variable} ${ringerLuctor.variable} h-full antialiased`}>
      <head>
        <link rel="icon" type="image/png" href="/assets/images/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/assets/images/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/assets/images/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Evastra" />
        <link rel="manifest" href="/assets/images/favicon/site.webmanifest" />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        {children}
        <Footer />

        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={5000}
        />
      </body>
    </html>
  )
}
