import { getApolloClient } from '../lib/apollo'
import {
  Container,
  Heading,
  Box,
  useBreakpointValue,
  useColorModeValue
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { GET_MEDIA_PRESS_BOOK } from '../lib/queries'
import { parseHtmlContent } from '../lib/parser'
import { Page } from '../components/work'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { INCREMENT_VIEWS_MUTATION } from '../lib/queries'

export default function MediaPress({ page }) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [incrementViews] = useMutation(INCREMENT_VIEWS_MUTATION)

  // Trigger the view count increment
  useEffect(() => {
    if (page?.databaseId) {
      incrementViews({ variables: { id: page.databaseId } }).catch(e =>
        console.error('Could not increment page views:', e)
      )
    }
  }, [page?.databaseId, incrementViews])

  if (!page) return <p>Page not found</p>

  // Use the parser - it already handles embedding PDFs and mobile thumbnails!
  const renderedContent = parseHtmlContent(page.content, isMobile)

  return (
    <Layout title={page.title}>
      <Container maxW="4xl" mt="4rem">
        <Section delay={0.1}>
          <main className={styles.main}>
            <Box
              borderRadius="lg"
              mt={6}
              mb={2}
              p={2}
              pt={4}
              textAlign="center"
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              css={{ backdropFilter: 'blur(10px)' }}
            >
              <Page>
                <div style={{ fontSize: '12px' }}>{page.title}</div>
              </Page>
            </Box>
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
                    maxWidth: '600px',
                    height: 'auto',
                    borderRadius: '15px'
                  }}
                />
              </Box>
            )}

            {/* Rendered content with embedded PDFs, columns, and proper typography */}
            <Box className="post-content" pb={16}>
              {renderedContent}
            </Box>
          </main>
        </Section>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_MEDIA_PRESS_BOOK,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null,
      cookies: req.headers.cookie ?? ''
    }
  }
}
