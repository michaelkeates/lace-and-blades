// pages/_document.js
import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../lib/theme'
import { cinzel, roboto } from '../lib/fonts'

export default class Document extends NextDocument {
  render() {
    return (
      // ✅ add the font variables to Html
      <Html lang="en" className={`${cinzel.variable} ${roboto.variable}`}>
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}