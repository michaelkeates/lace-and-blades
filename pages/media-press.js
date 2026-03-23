import { getApolloClient } from '../lib/wordpress'
import { 
  Container, 
  Heading, 
  Box, 
  useBreakpointValue 
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { GET_MEDIA_PRESS_BOOK } from '../lib/queries'
import { parseHtmlContent } from '../lib/wordpress-parser'

export default function MediaPress({ page }) {
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (!page) return <p>Page not found</p>

  // Use the parser - it already handles embedding PDFs and mobile thumbnails!
  const renderedContent = parseHtmlContent(page.content, isMobile)

  return (
    <Layout title={page.title}>
      <Container maxW="4xl" mt="4rem">
        <Section delay={0.1}>
          <main className={styles.main}>
            {/* Standardized CartaMarina Heading */}
            <Heading 
              as="h1" 
              textAlign="center" 
              fontFamily="CartaMarina" 
              fontSize={{ base: "5xl", md: "7xl" }} 
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

export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_MEDIA_PRESS_BOOK,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}