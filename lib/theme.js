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
      fontWeight: 400 // 👈 This sets default weight
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
      color: mode('#3d7aed', '#3d7aed')(props),
      textUnderlineOffset: 3
    })
  }
}

const fonts = {
  heading: "'Cinzel Decorative', cursive", //set to .400 weight
  body: "'Cinzel Decorative', cursive"
}

const colors = {
  black: {
    500: '#000'
  }
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
  disableTransitionOnChange: false
}

const theme = extendTheme({ config, styles, components, fonts, colors })
export default theme
