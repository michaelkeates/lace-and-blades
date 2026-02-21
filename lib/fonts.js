// lib/fonts.js
import { Spectral, Roboto } from 'next/font/google'

export const spectral = Spectral({
  subsets: ['latin'],
  weight: ['200','300','400','500','600','700','800'], // only valid weights
  variable: '--font-spectral',
  display: 'swap',
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '700'],
  variable: '--font-roboto',
  display: 'swap',
})