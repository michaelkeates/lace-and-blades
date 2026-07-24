import { getApolloClient } from '../lib/apollo'
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  useColorModeValue
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { GET_SUPPORT_AGENCIES_INFORMATION } from '../lib/queries'
import { ParsedContent } from '../lib/parser'
import parse from 'html-react-parser'
import { Page } from '../components/work'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { INCREMENT_VIEWS_MUTATION } from '../lib/queries'

export default function GeorgiasLaw({ page }) {
  // Color-mode values must be resolved at the top level, never inside .map() (rules of hooks)
  const headerBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const cardBorderColor = useColorModeValue('gray.100', 'whiteAlpha.100')
  const btnBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.200')
  const btnHoverBg = useColorModeValue('gray.50', 'whiteAlpha.300')
    const [incrementViews] = useMutation(INCREMENT_VIEWS_MUTATION)
  
    // Trigger the view count increment
    useEffect(() => {
      if (page?.databaseId) {
        incrementViews({ variables: { id: page.databaseId } })
          .catch(e => console.error("Could not increment page views:", e))
      }
    }, [page?.databaseId, incrementViews])

  if (!page) return <p>Page not found</p>

  const pdfs = []
  const renderedPDFs = new Set()

  // 1. Extraction logic (The one that works for you)
  parse(page.content, {
    replace: node => {
      if (
        node.name === 'a' &&
        node.attribs?.href?.toLowerCase().endsWith('.pdf')
      ) {
        const href = node.attribs.href
        if (!renderedPDFs.has(href)) {
          renderedPDFs.add(href)
          const title = node.children?.[0]?.data || 'PDF Document'
          pdfs.push({ href, title })
        }
      }
    }
  })

  return (
    <Layout title={page.title}>
      {/* 2. Using a Box instead of Container to bypass narrow constraints */}
      <Box px={{ base: 4, md: 8, lg: 20 }} py={10} mx="auto" maxW="1400px">
        <Section delay={0.1}>
          <main className={styles.main}>
            <Box
              borderRadius="lg"
              mt={6}
              mb={2}
              p={2}
              pt={4}
              textAlign="center"
              bg={headerBg}
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
                  // 3. Ensuring the image stays large (Adjust width as needed)
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    height: 'auto',
                    borderRadius: '15px'
                  }}
                />
              </Box>
            )}

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              w="100%"
            >
              {pdfs.map((pdf, idx) => {
                const thumbnailUrl = pdf.href.replace(/\.pdf$/i, '-pdf.jpg')

                return (
                  <Box key={idx} display="flex" flexDirection="column">
                    <Box
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="lg"
                      height={{ base: 'auto', md: '450px' }}
                      bg="blackAlpha.50"
                      border="1px solid"
                      borderColor={cardBorderColor}
                    >
                      {/* Render both; toggle with CSS so SSR + client markup match (no hydration mismatch) */}
                      <Box display={{ base: 'block', md: 'none' }} h="100%">
                        <img
                          src={thumbnailUrl}
                          alt={pdf.title}
                          style={{ width: '100%', height: 'auto' }}
                          onError={e => {
                            e.target.src = pdf.href.replace(/\.pdf$/i, '.jpg')
                          }}
                        />
                      </Box>
                      <Box display={{ base: 'none', md: 'block' }} h="100%">
                        <object
                          data={pdf.href}
                          type="application/pdf"
                          width="100%"
                          height="100%"
                        >
                          <Box p={4}>No Preview</Box>
                        </object>
                      </Box>
                    </Box>

                    <Button
                      as="a"
                      href={pdf.href}
                      target="_blank"
                      mt={4}
                      w="100%"
                      fontSize="sm"
                      whiteSpace="normal"
                      height="auto"
                      py={4}
                      lineHeight="1.4"
                      bg={btnBg}
                      boxShadow="0px 4px 12px rgba(0,0,0,0.05)"
                      _hover={{ bg: btnHoverBg }}
                    >
                      📄 {pdf.title}
                    </Button>
                  </Box>
                )
              })}
            </SimpleGrid>

            {/* 4. THE GRID - Forced columns with 'minChildWidth' as a backup */}
          </main>
        </Section>
      </Box>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_SUPPORT_AGENCIES_INFORMATION,
    fetchPolicy: 'network-only'
  })

  return {
    props: {
      page: data?.pageBy ?? null,
      cookies: req.headers.cookie ?? ''
    }
  }
}
