import { extendTheme } from '@chakra-ui/react'
import { mode, darken } from '@chakra-ui/theme-tools'

const styles = {
  global: props => ({
    body: {
      bg: mode('brand.purpleDark', 'brand.purple')(props),
      color: 'white'
    }
  })
}

const components = {
Heading: {
  baseStyle: {
    color: 'white'
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
      color: '#3d7aed',
      textUnderlineOffset: 3
    }
  }
}

const fonts = {
  heading: "'Roboto'"
}

const colors = {
  brand: {
    purple: '#8D54B4',
    purpleDark: '#512b71'
  }
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
  disableTransitionOnChange: false
}

const theme = extendTheme({
  config,
  styles,
  fonts,
  colors,
  components: {
    Heading: {
      baseStyle: { color: 'white' }
    },
    Link: {
      baseStyle: {
        color: '#3d7aed',
        textUnderlineOffset: 3
      }
    }
  }
})

export default theme
