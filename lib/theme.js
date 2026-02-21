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
  Heading: {
    baseStyle: {
      fontFamily: 'var(--font-spectral)',
      fontWeight: 300, // lighter heading
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
    baseStyle: props => ({
      color: mode('#ffffff', '#ffffff')(props),
      textDecoration: 'none',
      _hover: {
        textDecoration: 'none',
        color: mode('#2b5ac4', '#ccc')(props)
      }
    })
  }
}

const fonts = {
  heading: 'var(--font-spectral)',
  body: 'var(--font-spectral)'
}

const colors = {
  black: { 500: '#000' }
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
  disableTransitionOnChange: false
}

const theme = extendTheme({ config, styles, components, fonts, colors })

export default theme