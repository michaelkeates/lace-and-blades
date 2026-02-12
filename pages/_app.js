import Layout from '../components/layouts/main'
import Fonts from '../components/fonts'
import { AnimatePresence } from 'framer-motion'
import Chakra from '../components/chakra'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../lib/wordpress';
import '../styles/customstyle.css'

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

function Website({ Component, pageProps, router }) {
  const client = getApolloClient();

  return (
    <Chakra cookies={pageProps.cookies}>
      <ApolloProvider client={client}>
        {' '}
        {/* Wrap with ApolloProvider and pass client */}
        <Fonts />
        <Layout router={router}>
          <AnimatePresence
            mode="wait"
            initial={true}
            onExitComplete={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0 })
              }
            }}
          >
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </Layout>
      </ApolloProvider>
    </Chakra>
  )
}

export default Website
