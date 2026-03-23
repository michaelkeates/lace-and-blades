import { getApolloClient } from '../lib/wordpress'
import {
  Container,
  Box,
  Heading,
  SimpleGrid,
  Button,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { GET_GIVING_BACK_PAGE } from '../lib/queries'
import { parseHtmlContent } from '../lib/wordpress-parser'
import parse from 'html-react-parser'

export default function GivingBackDonationsFundraisers({ page }) {
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (!page) return <p>Page not found</p>

  // 2. Render content (Excluding the PDF links since we show them in the grid below)
  const renderedContent = parseHtmlContent(page.content, isMobile, true)

  return (
    <Layout title={page.title}>
      <Container maxW="4xl" mt="4rem">
        <Section delay={0.1}>
          <main className={styles.main}>
            <Heading
              as="h1"
              textAlign="center"
              fontFamily="CartaMarina"
              fontSize={{ base: '5xl', md: '7xl' }}
              mb={6}
            >
              {page.title}
            </Heading>
            {page.featuredImage && (
              <Box display="flex" justifyContent="center" mb={10}>
                <img
                  className={styles.featuredImage}
                  src={page.featuredImage.node.sourceUrl}
                  alt={page.title}
                  style={{
                    width: '100%',
                    maxWidth: '800px',
                    height: 'auto',
                    borderRadius: '15px'
                  }}
                />
              </Box>
            )}
            {/* Content wrapper - now handles H1-H6, P, Twitter, and Columns! */}
            <Box mb={10} className="post-content">
              {renderedContent}
            </Box>
          </main>
        </Section>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_GIVING_BACK_PAGE,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}
