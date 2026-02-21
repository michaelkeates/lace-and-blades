// pages/_app.js
import { AnimatePresence } from 'framer-motion'
import Chakra from '../components/chakra'
import Layout from '../components/layouts/main'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../lib/wordpress'
import { spectral, roboto } from '../lib/fonts'
import '../styles/globals.css'

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

function Website({ Component, pageProps, router }) {
  const client = getApolloClient()

  return (
    <Chakra cookies={pageProps.cookies}>
      <ApolloProvider client={client}>
        {/* wrapper div is optional now, for global CSS */}
        <div className={`${spectral.variable} ${roboto.variable}`}>
          <Layout router={router}>
            <AnimatePresence
              mode="wait"
              initial={true}
              onExitComplete={() => {
                if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
              }}
            >
              <Component {...pageProps} key={router.route} />
            </AnimatePresence>
          </Layout>
        </div>
      </ApolloProvider>
    </Chakra>
  )
}

export default Website