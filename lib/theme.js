// lib/theme.js
import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: props => ({
    body: {
      bg: mode('#f2b9ff', '#1f1821')(props),
      transitionProperty: 'all',
      transitionDuration: 'normal'
    }
  })
}

const components = {
  Menu: {
    baseStyle: props => ({
      list: {
        // Use very light transparency
        bg: mode('rgba(255, 255, 255, 0.5)', 'rgba(30, 34, 42, 0.5)')(props),
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid',
        borderColor: mode('blackAlpha.200', 'whiteAlpha.200')(props),
        boxShadow: 'xl'
      }
    })
  },
  Heading: {
    baseStyle: {
      fontFamily: 'var(--font-spectral)',
      fontWeight: 300
    },
    variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: '#525252',
        textDecorationThickness: 1,
        marginTop: 3,
        marginBottom: 4
      }
    }
  },
  Link: {
    baseStyle: {
      color: 'inherit',
      textDecoration: 'none',
      _hover: {
        textDecoration: 'underline'
      }
    }
  }
}

const fonts = {
  heading: 'var(--font-spectral)',
  body: 'var(--font-spectral)',
  footer: 'var(--font-roboto)',
  display: 'var(--font-playfair)',
  script: 'var(--font-dancing)',
  serif: 'var(--font-cormorant)'
}

const colors = {
  black: { 500: '#000' }
}

const config = {
  initialColorMode: 'dark',
  // MUST be false for SSR: the server can't read the OS prefers-color-scheme,
  // so `true` makes light-mode visitors hydrate light over dark server HTML
  // -> React #418/#423 hydration crash. Mode now persists via the cookie/
  // localStorage manager + the theme toggle instead.
  useSystemColorMode: false,
  disableTransitionOnChange: false
}

const theme = extendTheme({ config, styles, components, fonts, colors })

export default theme
