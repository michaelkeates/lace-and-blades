import { getApolloClient } from '../lib/wordpress'
import { 
  Container, 
  Heading, 
  Box, 
  useBreakpointValue 
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import Layout from '../components/layouts/article' // Ensure consistent Layout component
import { GET_SUPPORT_AND_HELPLINES } from '../lib/queries'
import { parseHtmlContent } from '../lib/wordpress-parser'

export default function SupportAndHelplines({ page }) {
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (!page) return <p>Page not found</p>

  // Use your custom parser for the content
  const renderedContent = parseHtmlContent(page.content, isMobile)

  return (
    <Layout title={page.title}>
      <Container maxW="4xl" mt="4rem">
        <Section delay={0.1}>
          <main className={styles.main}>
            {/* Styled Heading to match your blog posts */}
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
                  style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '15px' }}
                />
              </Box>
            )}

            {/* Rendered via your custom parser logic */}
            <Box className="post-content">
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
    query: GET_SUPPORT_AND_HELPLINES,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null
    }
  }
}