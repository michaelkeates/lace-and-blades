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

const fonts = {
  heading: "'Roboto'"
}

const colors = {
  brand: {
    purple: '#c39cdf',
    purpleDark: '#512b71'
  }
}

const config = {
  initialColorMode: 'light',
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
