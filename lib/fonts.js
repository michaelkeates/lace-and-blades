import { Spectral, Roboto } from 'next/font/google'

// Google fonts
export const spectral = Spectral({
  subsets: ['latin'],
  weight: ['200','300','400','500','600','700','800'],
  variable: '--font-spectral',
  display: 'swap',
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300','700'],
  variable: '--font-roboto',
  display: 'swap',
})