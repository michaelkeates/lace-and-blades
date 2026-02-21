// lib/fonts.js
import { Cinzel, Roboto } from 'next/font/google'

export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'], // match 400..900
  variable: '--font-cinzel',
  display: 'swap',
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '700'],
  variable: '--font-roboto',
  display: 'swap',
})