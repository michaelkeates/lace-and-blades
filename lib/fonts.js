import { Spectral, Roboto, Playfair_Display, Cormorant_Garamond, Dancing_Script } from 'next/font/google'

export const spectral = Spectral({ subsets: ['latin'], weight: ['200','300','400','500','600','700','800'], variable: '--font-spectral', display: 'swap' })
export const roboto = Roboto({ subsets: ['latin'], weight: ['300','700'], variable: '--font-roboto', display: 'swap' })

// New fonts
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
export const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500','600','700'], variable: '--font-cormorant', display: 'swap' })
export const dancing = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing', display: 'swap' })