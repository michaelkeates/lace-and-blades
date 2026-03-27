// pages/_app.js
import Chakra from '../components/chakra'
import Layout from '../components/layouts/main'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../lib/wordpress'
import { spectral, roboto } from '../lib/fonts'
import '../styles/fonts.css';
import '../styles/globals.css'
import { AnimatePresence } from 'framer-motion'

if (typeof window !== 'undefined') window.history.scrollRestoration = 'manual'

// pages/_app.js
function Website({ Component, pageProps, router }) {
  const client = getApolloClient()

  // Determine if the connection is "up" based on the existence of data 
  // or a custom isConnected prop passed from getServerSideProps
  const isConnected = pageProps.isConnected !== false

  return (
    <Chakra cookies={pageProps.cookies}>
      <ApolloProvider client={client}>
        <div className={`${spectral.variable} ${roboto.variable}`}>
          {/* Pass the status to your Layout */}
          <Layout router={router} isConnected={isConnected}>
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