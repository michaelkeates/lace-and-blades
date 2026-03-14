// pages/georgias-law.js

import { getApolloClient } from '../lib/wordpress'
import {
  Container,
  Box,
  Heading,
  SimpleGrid,
  Link,
  Button,
  useColorModeValue
} from '@chakra-ui/react'
import Section from '../components/section'
import styles from '../styles/Home.module.css'
import { GET_GEORGIAS_LAW } from '../lib/queries'
import parse from 'html-react-parser'

export default function GeorgiasLaw({ page }) {
  if (!page) return <p>Page not found</p>

  const renderedPDFs = new Set()
  const pdfs = []

  const imageUrl = page?.featuredImage?.node?.sourceUrl
  const isSpecificImage = imageUrl?.includes('Lace_Blades_300DPI')

  /**
   * Remove PDFs from content and collect them
   */
  const contentWithoutPDFLinks = parse(page.content, {
    replace: node => {
      if (
        node.name === 'a' &&
        node.attribs?.href?.toLowerCase().endsWith('.pdf')
      ) {
        const href = node.attribs.href

        if (renderedPDFs.has(href)) return <></>
        renderedPDFs.add(href)

        const title = node.children?.[0]?.data || 'PDF Document'

        pdfs.push({ href, title })

        return <></>
      }

      return undefined
    }
  })

  return (
    <Container maxW="4xl" mt="4rem">
      <Section delay={0.1}>

        <Heading as="h1" mb={4}>
          {page.title}
        </Heading>

        {imageUrl && (
          <img
            className={styles.featuredImage}
            src={imageUrl}
            alt={page.title}
            style={
              isSpecificImage
                ? { maxWidth: '300px', height: 'auto' }
                : undefined
            }
          />
        )}

        {/* Render main page content */}
        <Box mb={10}>{contentWithoutPDFLinks}</Box>

        {/* Render PDFs in 2-column grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {pdfs.map(pdf => (
            <Box key={pdf.href}>
              <embed
                src={pdf.href}
                type="application/pdf"
                width="100%"
                height="500px"
              />

              <Box mt={2} display="flex" justifyContent="center">
                <Link
                  href={pdf.href}
                  isExternal
                  _hover={{ textDecoration: 'none' }}
                >
                  <Button
                    bg={useColorModeValue(
                      'whiteAlpha.500',
                      'whiteAlpha.200'
                    )}
                  >
                    {pdf.title}
                  </Button>
                </Link>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

      </Section>
    </Container>
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