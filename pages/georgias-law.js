// pages/georgias-law.js
import { getApolloClient } from '../lib/wordpress'
import { Container, Box, Heading, useBreakpointValue } from '@chakra-ui/react'
import Section from '../components/section'
import styles from '../styles/Home.module.css'
import { GET_GEORGIAS_LAW } from '../lib/queries'
import parse from 'html-react-parser'

// ---------------------------
// Wrap images in anchors
// ---------------------------
export function parseHtml(html) {
  if (typeof window === 'undefined') return html

  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('img').forEach(img => {
    const src = img.src
    const wrapper = document.createElement('a')
    wrapper.href = src
    wrapper.target = '_blank'
    img.parentNode.replaceChild(wrapper, img)
    wrapper.appendChild(img)
  })

  return doc.body.innerHTML
}

// ---------------------------
// Main Page Component
// ---------------------------
export default function GeorgiasLaw({ page }) {
  if (!page) return <p>Page not found</p>

  const renderedPDFs = new Set()

  // Detect if on mobile (Chakra hook)
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Parse page content and embed PDFs
  const contentWithEmbeddedPDFs = parse(parseHtml(page.content), {
    replace: node => {
      if (node.name === 'a' && node.attribs?.href?.toLowerCase().endsWith('.pdf')) {
        const href = node.attribs.href
        if (renderedPDFs.has(href)) return <></>
        renderedPDFs.add(href)
        const title = node.children?.[0]?.data || 'PDF Document'

        return (
          <Box
            key={href}
            my={4}
            width="100%"
            overflow="hidden"
            borderRadius="md"
          >
            {/* Desktop: use embed for thumbnail preview */}
            {!isMobile && (
              <embed
                src={href}
                type="application/pdf"
                width="100%"
                height="500px"
                style={{ maxWidth: '100%' }}
              />
            )}

            {/* Mobile: fallback to thumbnail image */}
            {isMobile && (
              <img
                src={page.featuredImage?.node?.sourceUrl || '/pdf-placeholder.png'}
                alt={title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}

            {/* PDF link */}
            <Box mt={2}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            </Box>
          </Box>
        )
      }
      return undefined
    },
  })

  return (
    <Section delay={0.1}>
      <Container maxW="container.md" mt="4rem">
        <Heading as="h1" mb={4}>
          {page.title}
        </Heading>

        {page.featuredImage && (
          <img
            src={page.featuredImage.node.sourceUrl}
            alt={page.title}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        )}

        <Box>{contentWithEmbeddedPDFs}</Box>
      </Container>
    </Section>
  )
}

// ---------------------------
// Server-side Fetch
// ---------------------------
export async function getServerSideProps() {
  const apolloClient = getApolloClient()
  const { data } = await apolloClient.query({
    query: GET_GEORGIAS_LAW,
    fetchPolicy: 'network-only',
  })

  return {
    props: {
      page: data?.pageBy ?? null,
    },
  }
}