import { getApolloClient } from '../lib/wordpress'
import {
  Container,
  Box,
  Heading,
  Badge,
  Button,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import styles from '../styles/Home.module.css'
import { GET_GEORGIAS_LAW } from '../lib/queries'
import { parseHtmlContent } from '../lib/wordpress-parser'
import { Page } from '../components/work'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { INCREMENT_VIEWS_MUTATION } from '../lib/queries'

export default function GeorgiasLaw({ page }) {
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

  const imageUrl = page?.featuredImage?.node?.sourceUrl
  const isSpecificImage = imageUrl?.includes('Lace_Blades_300DPI')

  /* Use your custom parser here! 
     This ensures h1-h6, p, and buttons look exactly like your posts.
  */
  const renderedContent = parseHtmlContent(page.content, isMobile)

  return (
    <Layout title="Georgia's Law">
      <Container maxW="4xl" mt="4rem">
        <Section delay={0.1}>
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
            mb={4}
            textAlign="center"
            fontFamily="CartaMarina"
            fontSize="7xl"
          >
            {page.title}
          </Heading>

          {imageUrl && (
            <Box display="flex" justifyContent="center" mb={6}>
              <img
                className={styles.featuredImage}
                src={imageUrl}
                alt={page.title}
                style={
                  isSpecificImage
                    ? { maxWidth: '300px', height: 'auto' }
                    : { maxWidth: '100%', height: 'auto' }
                }
              />
            </Box>
          )}

          {/* This now uses all your custom styling for Headings, P, and Twitter */}
          <Box mb={10} className="post-content">
            {renderedContent}
          </Box>
        </Section>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: GET_GEORGIAS_LAW,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}
