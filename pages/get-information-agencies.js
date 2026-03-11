// pages/georgias-law.js
import { getApolloClient } from '../lib/wordpress'
import { Container, Box, SimpleGrid, Link } from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import Section from '../components/section'
import { GET_SUPPORT_AGENCIES_INFORMATION } from '../lib/queries'
import parse from 'html-react-parser'

export default function GeorgiasLaw({ page }) {
  if (!page) return <p>Page not found</p>

  const renderedPDFs = new Set()
  const pdfs = []

  const contentWithoutPDFLinks = parse(page.content, {
    replace: node => {
      if (
        node.name === 'a' &&
        node.attribs?.href &&
        node.attribs.href.toLowerCase().endsWith('.pdf')
      ) {
        const href = node.attribs.href

        if (renderedPDFs.has(href)) return <></>
        renderedPDFs.add(href)

        const title = node.children?.[0]?.data || 'PDF Document'

        pdfs.push({ href, title })

        return <></> // remove original link
      }

      return undefined
    },
  })

  return (
    <layout>
      <Container maxW="4xl">
        <Section delay={0.1}>
          <main className={styles.main}>
            <div>
              <h1>{page.title}</h1>

              {page.featuredImage && (
                <img
                  src={page.featuredImage.node.sourceUrl}
                  alt={page.title}
                />
              )}

              {/* Render non-PDF content */}
              <Box mb={10}>{contentWithoutPDFLinks}</Box>

              {/* Render PDFs in 4-column grid */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {pdfs.map(pdf => (
                  <Box key={pdf.href}>
                    <embed
                      src={pdf.href}
                      type="application/pdf"
                      width="100%"
                      height="400px"
                    />
                    <Box mt={2}>
                      <Link
                        href={pdf.href}
                        isExternal
                        color="teal.500"
                        fontWeight="medium"
                      >
                        {pdf.title}
                      </Link>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </div>
          </main>
        </Section>
      </Container>
    </layout>
  )
}

export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_SUPPORT_AGENCIES_INFORMATION,
    fetchPolicy: 'network-only',
  })

  return {
    props: {
      page: data?.pageBy ?? null,
    },
  }
}