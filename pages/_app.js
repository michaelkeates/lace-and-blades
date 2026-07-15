// pages/_app.js
import Chakra from '../components/chakra'
import Layout from '../components/layouts/main'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../lib/apollo'
import { spectral, roboto, playfair, cormorant, dancing } from '../lib/fonts'
import '../styles/fonts.css';
import '../styles/globals.css'

if (typeof window !== 'undefined') window.history.scrollRestoration = 'manual'

// pages/_app.js
function Website({ Component, pageProps, router }) {
  const client = getApolloClient()
  const isConnected = pageProps.isConnected !== false

  return (
    <Chakra cookies={pageProps.cookies}>
      <ApolloProvider client={client}>
        <div className={`${spectral.variable} ${roboto.variable} ${playfair.variable} ${cormorant.variable} ${dancing.variable}`}>
          {/* Layout owns the page-transition animation via motion.div key={router.route} */}
          <Layout router={router} isConnected={isConnected}>
            <Component {...pageProps} key={router.route} />
          </Layout>
        </div>
      </ApolloProvider>
    </Chakra>
  )
}

export default Website